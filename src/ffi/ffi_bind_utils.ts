import { ptr, FFIType } from 'bun:ffi'

function arrayArg(arg: number | number[], type: FFIType) {
  if (typeof arg === 'number') arg = [arg]

  if (arg.length == 0) {
    return [0, 0]
  }

  let array: Int32Array | BigInt64Array
  if (type === FFIType.i32) {
    array = new Int32Array(arg)
  } else if (type === FFIType.i64) {
    array = new BigInt64Array(arg.map((x) => BigInt(x)))
  } else {
    throw 'unhandled type for array argument'
  }
  return [ptr(array), array.length]
}

export { arrayArg }
