import { ptr, FFIType } from 'bun:ffi'
import { Tensor } from '@shumai/shumai'

function arrayArg(arg: number | number[] | BigInt64Array | Array<Tensor>, type: FFIType) {
  if (typeof arg === 'number') arg = [arg]

  if (arg.length == 0) {
    return [0, 0]
  }

  let numArray: number[] | BigInt64Array
  if (arg instanceof Array) {
    numArray = []
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
  } else {
    numArray = arg
  }

  let outArray: Int32Array | BigInt64Array
  switch (type) {
    case FFIType.i32:
      outArray = new Int32Array(numArray)
      break
    case FFIType.i64:
      outArray = new BigInt64Array(numArray.map((x) => BigInt(x)))
      break
    default:
      throw new Error(`Unsupported type: ${type}`)
  }

  return [ptr(outArray), outArray.length]
}

export { arrayArg }
