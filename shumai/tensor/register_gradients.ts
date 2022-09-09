import * as base from './tensor'
import * as ops from './tensor_ops_gen'
const sm = { ...base, ...ops }

function possiblyReduce(grad_out, grad) {
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
  add: (grad) => {
    return possiblyReduce(grad.grad_in, grad)
  },
  sub: (grad) => {
    if (grad.idx) {
      return possiblyReduce(grad.grad_in.negative(), grad)
    }
    return possiblyReduce(grad.grad_in, grad)
  },
  mul: (grad) => {
    return possiblyReduce(grad.in[1 - grad.idx].mul(grad.grad_in), grad)
  },
  div: (grad) => {
    const recip = sm.scalar(1).div(grad.in[1])
    const go = grad.grad_in.mul(recip)
    if (grad.idx === 0) {
      return possiblyReduce(go, grad)
    } else if (grad.idx === 1) {
      return possiblyReduce(go.negate().mul(recip), grad)
    }
  },
  sum: (grad) => {
    return grad.grad_in.tile(grad.in[0].shape)
  },
  sigmoid: (grad) => {
    const o = sm.scalar(1).sub(grad.out)
    return grad.out.mul(o)
  },
  tanh: (grad) => {
    return sm.scalar(1).sub(grad.out.mul(grad.out))
  },
  mean: (grad) => {
    const num = sm.scalar(grad.in[0].elements)
    return grad.grad_in.tile(grad.in[0].shape).div(num)
  },
  maximum: (grad) => {
    const a_idx = grad.idx
    const b_idx = 1 - grad.idx
    const mask = grad.in[a_idx].greaterThan(grad.in[b_idx])
    return mask.mul(grad.grad_in)
  },
  matmul: (grad) => {
    if (grad.idx === 0) {
      const yT = grad.in[1].transpose([1, 0])
      return grad.grad_in.matmul(yT)
    } else if (grad.idx === 1) {
      const xT = grad.in[0].transpose([1, 0])
      return xT.matmul(grad.grad_in)
    }
  }
}

Object.assign(sm.gradient_functions, impls)
