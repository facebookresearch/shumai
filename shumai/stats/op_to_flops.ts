import type { Tensor } from '../tensor/tensor'

export function opToFlops(op: string, inputs: Tensor[], out: Tensor): number {
  switch (op) {
    case 'matmul':
      return opToFlopsMatmul(inputs, out)
    default:
      return opToFlopsGeneric(inputs, out)
  }
}

function opToFlopsGeneric(inputs: Tensor[], out: Tensor): number {
  // default behavior is to take the maximum size of all tensors and assume flops=max(elements)
  return inputs.reduce((flops: number, t) => Math.max(flops, t.elements || 0), out.elements)
}

function opToFlopsMatmul(inputs: any[], out: Tensor): number {
  const [a] = inputs

  const k = a.shape[a.shape.length - 1]

  return k * out.elements * 2
}
