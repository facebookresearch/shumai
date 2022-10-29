import type { Tensor } from './tensor'
import * as base from './tensor'
import * as ops from './tensor_ops'
const sm = { ...base, ...ops }

type ArgType = Tensor | number | number[] | BigInt64Array | boolean

export interface Grad {
  idx: number
  in: [Tensor, ...ArgType[]]
  grad_in: Tensor
  out: Tensor
}

function recoverShape(tensor: Tensor, originalShape: number[], lostAxes: number[]) {
  const shapeForBroadcast = [...originalShape]
  for (let axis of lostAxes) {
    if (axis < 0) {
      axis += originalShape.length
    }
    shapeForBroadcast[axis] = 1
  }
  const tensorForBroadcast = tensor.reshape(shapeForBroadcast)
  return tensorForBroadcast.add(sm.full(originalShape, 0))
}

function possiblyReduce(grad_out: Tensor, grad: Grad) {
  const input = <Tensor>grad.in[grad.idx]
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
    const [x, w, sx, sy, px, py, dx, dy, g] = <
      [Tensor, Tensor, number, number, number, number, number, number, number]
    >grad.in
    if (dx !== 1 || dy !== 1) {
      throw new Error(
        `cannot differentiate convolution with dilation (${dx}, ${dy}), please file an issue.`
      )
    } else if (sx !== sy) {
      throw new Error(
        `cannot differentiate convolution with stride (${sx}, ${sy}), please file an issue.`
      )
    } else if (px !== py) {
      throw new Error(
        `cannot differentiate convolution with padding (${px}, ${py}), please file an issue.`
      )
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const batch = x.shape[0]
    const channel_out = grad.grad_in.shape[1]
    const channel_in = x.shape[1]
    /* eslint-enable @typescript-eslint/no-unused-vars */

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
        dxw = dxw.reshape([dxw.shape[0] * dxw.shape[1]].concat(dxw.shape.slice(2)))
      } else {
        dxw = dxw.transpose([1, 0, 2, 3])
      }
      return sm.conv2d(dxgrad, dxw, 1, 1, padding, padding, 1, 1, g)
    }

    const dwgrad = grad.grad_in.transpose([0, 1])
    let dwx = x.transpose([0, 1])
    if (g > 1) {
      dwx = x.reshape([x.shape[0], g, x.shape[1] / g].concat(x.shape.slice(2)))
      dwx = dwx.transpose([0, 2])
      dwx = dwx.reshape([dwx.shape[0], dwx.shape[1] * dwx.shape[2]].concat(dwx.shape.slice(3)))
    }
    return sm.conv2d(dwx, dwgrad, 1, 1, px, px, sx, sx, g)
  },
  div: (grad: Grad) => {
    const recip = sm.scalar(1).div(<Tensor>grad.in[1])
    const go = grad.grad_in.mul(recip)
    if (grad.idx === 0) {
      return possiblyReduce(go, grad)
    } else if (grad.idx === 1) {
      return possiblyReduce(go.negative().mul(recip), grad)
    }
  },
  sqrt: (grad: Grad): Tensor => {
    return grad.grad_in.div(grad.out.mul(sm.scalar(2)))
  },
  exp: (grad: Grad) => {
    return sm.exp(grad.in[0])
  },
  matmul: (grad: Grad) => {
    if (grad.idx === 0) {
      const y = <Tensor>grad.in[1]
      if (grad.grad_in.shape.length === 1 && y.shape.length === 1) {
        // grad_in and y are 1D column vectors
        const expandedGradIn = grad.grad_in.reshape([grad.grad_in.shape[0], 1])
        const expandedY = y.reshape([y.shape[0], 1])
        return expandedGradIn.matmul(expandedY.T())
      }
      return grad.grad_in.matmul(y.T()) // this is 1D if grad_in is a 1D row vector
    } else if (grad.idx === 1) {
      const x = <Tensor>grad.in[0]
      if (grad.grad_in.shape.length === 1 && x.shape.length === 1) {
        // grad_in and x are 1D row vectors
        const expandedGradIn = grad.grad_in.reshape([1, grad.grad_in.shape[0]])
        const expandedX = x.reshape([1, x.shape[0]])
        return expandedX.T().matmul(expandedGradIn)
      }
      return x.T().matmul(grad.grad_in) // this is 1D if grad_in is a 1D column vector
    } else {
      throw new Error(`Invalid Grad argument`)
    }
  },
  maximum: (grad: Grad) => {
    const a_idx = grad.idx
    const b_idx = <0 | 1>(1 - grad.idx)
    const mask = (<Tensor>grad.in[a_idx]).greaterThan(<Tensor>grad.in[b_idx])
    return mask.mul(grad.grad_in)
  },
  mean: (grad: Grad) => {
    const inShape = (<Tensor>grad.in[0]).shape
    let axes = <number[]>grad.in[1]
    if (axes.length === 0) {
      axes = inShape.map((x, i) => i) // All axes
    }

    let num = 1
    for (const axis of axes) {
      num *= inShape[axis]
    }

    return recoverShape(grad.grad_in.div(sm.scalar(num)), inShape, axes)
  },
  var: (grad: Grad) => {
    const input = <Tensor>grad.in[0]
    const inShape = input.shape
    let axes = <number[]>grad.in[1]
    if (axes.length === 0) {
      axes = inShape.map((x, i) => i)
    }

    const bias = <boolean>grad.in[2]
    let num = 1
    for (const axis of axes) {
      num *= inShape[axis]
    }
    if (bias) {
      num -= 1
    }

    const expandedGradIn = recoverShape(grad.grad_in, inShape, axes)
    const expandedMean = recoverShape(input.mean(axes), inShape, axes)

    return expandedGradIn.mul(sm.scalar(2 / num)).mul(input.sub(expandedMean))
  },
  mul: (grad: Grad) => {
    const grad_idx = <0 | 1>(1 - grad.idx)
    return possiblyReduce((<Tensor>grad.in[grad_idx]).mul(grad.grad_in), grad)
  },
  greaterThanEqual: (grad: Grad) => {
    const o = sm.scalar(1).sub(grad.out)
    return grad.out.mul(o)
  },
  logicalNot: (grad: Grad) => {
    const o = sm.scalar(1).sub(grad.out)
    return grad.out.mul(o)
  },
  sigmoid: (grad: Grad) => {
    const o = sm.scalar(1).sub(grad.out)
    return grad.out.mul(o)
  },
  clip: (grad: Grad) => {
    const result = <Tensor>grad.in[0]
    const low = <Tensor>grad.in[1]
    const high = <Tensor>grad.in[2]

    const lowMask = result.greaterThan(low);
    const highMask = result.lessThan(high);
    const lowHighMask = lowMask.bitwiseAnd(highMask);
    const gradMask = sm.where(lowHighMask, grad.out, sm.full(grad.out.shape, 0))

    return gradMask
  },
  sub: (grad: Grad) => {
    if (grad.idx) {
      return possiblyReduce(grad.grad_in.negative(), grad)
    }
    return possiblyReduce(grad.grad_in, grad)
  },
  sum: (grad: Grad) => {
    const inShape = grad.in[0].shape
    let axes = <number[]>grad.in[1]
    if (axes.length === 0) {
      axes = inShape.map((x, i) => i) // All axes
    }
    return recoverShape(grad.grad_in, inShape, axes)
  },
  tanh: (grad: Grad) => {
    return sm.scalar(1).sub(grad.out.mul(grad.out))
  },
  concatenate: (grad: Grad): Tensor => {
    const axis = <number>grad.in[grad.in.length - 1]
    const idx = grad.idx
    const prevTensors = <Tensor[]>grad.in.slice(0, idx)
    const start = prevTensors.reduce((r, t) => r + t.shape[axis], 0)
    const end = start + (<Tensor>grad.in[idx]).shape[axis]
    const range = grad.out.shape.map(() => ':')
    range[axis] = start + ':' + end

    return grad.grad_in.index(range)
  },
  transpose: (grad: Grad): Tensor => {
    const forwardAxes = <number[]>grad.in[1]
    const reverseAxes = [...forwardAxes]
    for (let i = 0; i < forwardAxes.length; i++) {
      reverseAxes[forwardAxes[i]] = i
    } // If forwardAxes === [], reverseAxes === []
    return grad.grad_in.transpose(reverseAxes)
  },
  reshape: (grad: Grad): Tensor => {
    const inShape = (<Tensor>grad.in[0]).shape
    return grad.grad_in.reshape(inShape)
  }
}

Object.assign(sm.gradient_functions, impls)
