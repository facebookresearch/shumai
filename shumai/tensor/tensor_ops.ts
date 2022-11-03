import type { Tensor } from './tensor'
import { _var, full, sigmoid } from './tensor_ops_gen'

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

export function leakyRelu(tensor: Tensor, negative_slope = 1e-3): Tensor {
  const rhs = tensor.maximum(scalar(0))
  const lhs = scalar(negative_slope).mul(tensor.minimum(scalar(0)))
  return rhs.add(lhs)
}

export function swish(tensor: Tensor, beta = 1e-3): Tensor {
  return tensor.mul(sigmoid(scalar(beta).mul(tensor)))
}

export function elu(tensor: Tensor, alpha = 1): Tensor {
  const mask = tensor.gte(scalar(0))
  const notMask = mask.logicalNot()
  return mask.mul(tensor).add(notMask.mul(scalar(alpha)).mul(tensor.exp().sub(scalar(1))))
}

export function thresholdRelu(tensor: Tensor, threshold = 1): Tensor {
  const mask = tensor.gte(scalar(threshold))
  return tensor.mul(mask)
}

export function clamp(tensor: Tensor, low: number, high: number): Tensor {
  return tensor.clip(full(tensor.shape, low), full(tensor.shape, high))
}

export function relu6(tensor: Tensor): Tensor {
  return clamp(tensor, 0.0, 6.0)
}

export function hardTanh(tensor: Tensor): Tensor {
  return clamp(tensor, -1.0, 1.0)
}
