import * as base from './tensor'
import * as ops from './tensor_ops_gen'
const sm = { ...base, ...ops }

const impls = {
  add: (grad) => {
    return grad.grad_in
  },
  sub: (grad) => {
    if (grad.idx) {
      return grad.grad_in.negative()
    }
    return grad.grad_in
  },
  mul: (grad) => {
    return grad.in[1 - grad.idx].mul(grad.grad_in)
  },
  div: (grad) => {
    const recip = sm.scalar(1).div(grad.in[1])
    const go = grad.grad_in.mul(recip)
    if (grad.idx === 0) {
      return go
    } else if (grad.idx === 1) {
      return go.negate().mul(recip)
    }
  },
  sum: (grad) => {
    return grad.grad_in.tile(grad.in[0].shape)
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
