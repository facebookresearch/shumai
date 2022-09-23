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
