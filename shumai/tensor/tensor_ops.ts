import type { Tensor } from './tensor'

export function softmax(tensor: Tensor, axis: number): Tensor {
  const exp = tensor.exp()
  return exp.div(exp.sum([axis], true))
}
