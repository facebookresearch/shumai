import { ptr, FFIType } from 'bun:ffi'

function arrayArg(arg, type) {
  if (arg.length == 0) {
    return [0, 0]
  }
  if (arg.constructor === Number) {
    arg = [arg]
  }
  let array
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
