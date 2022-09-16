import { FFIType } from 'bun:ffi'

const ffi_tensor = {
  init: {},
  bytesUsed: {
    returns: FFIType.u64
  },
  setRowMajor: {},
  setColMajor: {},
  isRowMajor: {
    returns: FFIType.bool
  },
  isColMajor: {
    returns: FFIType.bool
  },
  createTensor: {
    args: [FFIType.ptr, FFIType.i64],
    returns: FFIType.ptr
  },
  destroyTensor: {
    args: [FFIType.ptr, FFIType.ptr]
  },
  genTensorDestroyer: {
    returns: FFIType.ptr
  },
  tensorFromBuffer: {
    args: [FFIType.i64, FFIType.ptr],
    returns: FFIType.ptr
  },
  _eval: {
    args: [FFIType.ptr]
  },
  _buffer: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _index: {
    args: [
      FFIType.ptr,
      FFIType.ptr,
      FFIType.i64,
      FFIType.ptr,
      FFIType.i64,
      FFIType.ptr,
      FFIType.i64
    ],
    returns: FFIType.ptr
  },
  _indexedAssign: {
    args: [
      FFIType.ptr,
      FFIType.ptr,
      FFIType.ptr,
      FFIType.i64,
      FFIType.ptr,
      FFIType.i64,
      FFIType.ptr,
      FFIType.i64
    ],
    returns: FFIType.ptr
  },
  _flatten: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _asContiguousTensor: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _copy: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _scalar: {
    args: [FFIType.ptr],
    returns: FFIType.f32
  },
  _elements: {
    args: [FFIType.ptr],
    returns: FFIType.u64
  },
  _bytes: {
    args: [FFIType.ptr],
    returns: FFIType.u64
  },
  _ndim: {
    args: [FFIType.ptr],
    returns: FFIType.i32
  },
  _shape: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i32],
    returns: FFIType.i32
  }
}

export { ffi_tensor }
