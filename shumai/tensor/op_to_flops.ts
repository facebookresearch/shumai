export function opToFlops(op: string, args: any[]): bigint {
  switch (op) {
    case 'matmul':
      return BigInt(Math.round(Math.pow(args[0].elements, 2.37188)))
    default:
      return BigInt(args.reduce((flops, t) => flops + (t.elements || 0), 0))
  }
}
