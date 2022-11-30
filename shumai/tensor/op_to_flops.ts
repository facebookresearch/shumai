import type { Tensor } from './tensor'

export function opToFlops(op: string, args: any[], out: Tensor): number {
  switch (op) {
    case 'matmul':
      return opToFlopsMatmul(args, out)
    default:
      return opToFlopsGeneric(args, out)
  }
}

function opToFlopsGeneric(args: any[], out: Tensor): number {
  // default behavior is to take the maximum size of all tensors and assume flops=max(elements)
  return args.reduce((flops: number, t) => Math.max(flops, t?.elements || 0), out.elements)
}

function opToFlopsMatmul(args: any[], out: Tensor): number {
  const a = args[0] as Tensor

  const k = a.shape[a.shape.length - 1]

  return k * out.elements * 2
}
