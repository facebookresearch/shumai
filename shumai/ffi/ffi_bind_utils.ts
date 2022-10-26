import { Tensor } from '@shumai/shumai'
import { ptr } from 'bun:ffi'

function arrayArg(arg: number | number[] | Tensor[] | BigInt64Array) {
  if (typeof arg === 'number') arg = [arg]

  if (arg.length == 0) {
    return [0, 0]
  }

  let outArray: BigInt64Array

  if (arg instanceof Array) {
    const numArray: number[] = []
    for (let i = 0; i < arg.length; ++i) {
      const item = arg[i]
      if (typeof item === 'number') {
        numArray.push(item)
      } else if (item instanceof Tensor) {
        numArray.push(item.ptr)
      } else {
        throw new Error(`Unsupported type at position ${i} of input arg`)
      }
    }
    outArray = new BigInt64Array(numArray.map((x) => BigInt(x)))
  } else {
    outArray = arg
  }

  return [ptr(outArray), outArray.length]
}

export { arrayArg }
