import * as base from './tensor'
import type { Tensor } from './tensor'
import * as ops from './tensor_ops_gen'
const sm = { ...base, ...ops }

export interface Grad {
  idx: number
  in: Tensor[]
  grad_in: Tensor
  out: Tensor
}

function possiblyReduce(grad_out: Tensor, grad: Grad) {
  const input = grad.in[grad.idx]
  const new_shape = input.shape
  if (grad.grad_in.shape.length != input.shape.length) {
    for (let i = 0; i < grad.grad_in.shape.length - input.shape.length; ++i) {
      new_shape.push(1)
    }
  }
  const reduction_axes = []
  for (let i = 0; i < new_shape.length; ++i) {
    if (new_shape[i] === 1 && grad.grad_in.shape[i] !== 1) {
      reduction_axes.push(i)
    }
  }
  if (reduction_axes.length) {
    return grad_out.sum(reduction_axes, true)
  }
  return grad_out
}

const impls = {
  add: (grad: Grad) => {
    return possiblyReduce(grad.grad_in, grad)
  },
  conv2d: (grad: Grad) => {
    const [x, w, sx, sy, px, py, dx, dy, g] = grad.in
    if (dx !== 1 || dy !== 1) {
      throw `cannot differentiate convolution with dilation (${dx}, ${dy}), please file an issue.`
    } else if (sx !== sy) {
      throw `cannot differentiate convolution with stride (${sx}, ${sy}), please file an issue.`
    } else if (px !== py) {
      throw `cannot differentiate convolution with padding (${px}, ${py}), please file an issue.`
    }
    const batch = x.shape[0]
    const channel_out = grad.grad_in.shape[1]
    const channel_in = x.shape[1]
    const k = w.shape[2]
    if (grad.idx === 0) {
      const padding = k - 1 - (sx - 1) - px
      let dxgrad = grad.grad_in
      if (sx > 1) {
        dxgrad = dxgrad.reshape(dxgrad.shape.concat([1, 1]))
        dxgrad = dxgrad
          .pad([
            [0, 0],
            [0, 0],
            [sx - 1, 0],
            [sx - 1, 0]
          ])
          .transpose([3, 4])
        const shape = grad.grad_in.shape
        dxgrad = dxgrad.reshape(shape.slice(0, 2).concat(shape.slice(2).map((x) => x * 2)))
        dxgrad = dxgrad.pad([
          [0, 0],
          [0, 0],
          [0, sx - 1],
          [0, sx - 1]
        ])
      }
      let dxw = w.flip(2).flip(3)
      if (g > 1) {
        dxw = dxw.reshape([g, dxw.shape[0] / g].concat(dxw.shape.slice(1)))
        dxw = dxw.transpose([0, 2])
        dxw = dwx.reshape([dxw.shape[0] * dxw.shape[1]].concat(dxw.shape.slice(2)))
      } else {
        dxw = dxw.transpose([1, 0, 2, 3])
      }
      return sm.conv2d(dxgrad, dxw, 1, 1, padding, padding, 1, 1, g)
    }

    const dwgrad = grad.grad_in.tranpose(0, 1)
    let dwx = x.transpose([0, 1])
    if (g > 1) {
      dwx = x.reshape([x.shape[0], g, x.shape[1] / g].concat(x.shape.slice(2)))
      dwx = dwx.tranpose([0, 2])
      dwx = dwx.reshape([dwx.shape[0], dwx.shape[1] * dwx.shape[2]].concat(dwx.shape.slice(3)))
    }
    return sm.conv2d(dwx, dwgrad, 1, 1, px, px, sx, sx, g)
  },
  div: (grad: Grad) => {
    const recip = sm.scalar(1).div(grad.in[1])
    const go = grad.grad_in.mul(recip)
    if (grad.idx === 0) {
      return possiblyReduce(go, grad)
    } else if (grad.idx === 1) {
      return possiblyReduce(go.negative().mul(recip), grad)
    }
  },
  exp: (grad: Grad) => {
    return sm.exp(grad.in[0])
  },
  matmul: (grad: Grad) => {
    if (grad.idx === 0) {
      const yT = grad.in[1].transpose([1, 0])
      return grad.grad_in.matmul(yT)
    } else if (grad.idx === 1) {
      const xT = grad.in[0].transpose([1, 0])
      return xT.matmul(grad.grad_in)
    }
  },
  maximum: (grad: Grad) => {
    const a_idx = grad.idx
    const b_idx = 1 - grad.idx
    const mask = grad.in[a_idx].greaterThan(grad.in[b_idx])
    return mask.mul(grad.grad_in)
  },
  mean: (grad: Grad) => {
    const num = sm.scalar(grad.in[0].elements)
    return grad.grad_in.tile(grad.in[0].shape).div(num)
  },
  mul: (grad: Grad) => {
    return possiblyReduce(grad.in[1 - grad.idx].mul(grad.grad_in), grad)
  },
  sigmoid: (grad: Grad) => {
    const o = sm.scalar(1).sub(grad.out)
    return grad.out.mul(o)
  },
  sub: (grad: Grad) => {
    if (grad.idx) {
      return possiblyReduce(grad.grad_in.negative(), grad)
    }
    return possiblyReduce(grad.grad_in, grad)
  },
  sum: (grad: Grad) => {
    return grad.grad_in.tile(grad.in[0].shape)
  },
  tanh: (grad: Grad) => {
    return sm.scalar(1).sub(grad.out.mul(grad.out))
  }
}

Object.assign(sm.gradient_functions, impls)
