import type { Tensor } from './tensor'
import { full } from './tensor_ops_gen'

export * from './tensor_ops_gen'

export function scalar(s: number): Tensor {
  return full([], s)
}

export function softmax(tensor: Tensor, axis: number): Tensor {
  const exp = tensor.exp()
  return exp.div(exp.sum([axis], true))
}

export function relu(tensor: Tensor): Tensor {
  return tensor.maximum(scalar(0))
}

export function leakyRelu(tensor: Tensor, negative_slope: number): Tensor {
  const rhs = tensor.maximum(scalar(0))
  const lhs = scalar(negative_slope).mul(tensor.minimum(scalar(0)))
  return rhs.add(lhs)
}
