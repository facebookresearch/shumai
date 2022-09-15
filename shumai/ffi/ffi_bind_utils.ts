import { ptr, FFIType } from 'bun:ffi'

function arrayArg(arg: number | number[] | BigInt64Array, type: FFIType) {
  if (typeof arg === 'number') arg = [arg]

  if (arg.length == 0) {
    return [0, 0]
  }

  let array: Int32Array | BigInt64Array
  switch (type) {
    case FFIType.i32:
      array = new Int32Array(arg)
      break
    case FFIType.i64:
      array = new BigInt64Array(arg.map((x) => BigInt(x)))
      break
    default:
      throw new Error(`Unsupported type: ${type}`)
  }

  return [ptr(array), array.length]
}

export { arrayArg }
