import { FFIType } from 'bun:ffi'

const ffi_tensor = {
  init: {},
  bytesUsed: {
    returns: FFIType.u64
  },
  dtypeFloat16: {
    returns: FFIType.int
  },
  dtypeFloat32: {
    returns: FFIType.int
  },
  dtypeFloat64: {
    returns: FFIType.int
  },
  dtypeBoolInt8: {
    returns: FFIType.int
  },
  dtypeInt16: {
    returns: FFIType.int
  },
  dtypeInt32: {
    returns: FFIType.int
  },
  dtypeInt64: {
    returns: FFIType.int
  },
  dtypeUint8: {
    returns: FFIType.int
  },
  dtypeUint16: {
    returns: FFIType.int
  },
  dtypeUint32: {
    returns: FFIType.int
  },
  dtypeUint64: {
    returns: FFIType.int
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
  dispose: {
    args: [FFIType.ptr]
  },
  tensorFromFloat16Buffer: {
    args: [FFIType.i64, FFIType.ptr],
    returns: FFIType.ptr
  },
  tensorFromFloat32Buffer: {
    args: [FFIType.i64, FFIType.ptr],
    returns: FFIType.ptr
  },
  tensorFromFloat64Buffer: {
    args: [FFIType.i64, FFIType.ptr],
    returns: FFIType.ptr
  },
  tensorFromInt8Buffer: {
    args: [FFIType.i64, FFIType.ptr],
    returns: FFIType.ptr
  },
  tensorFromInt16Buffer: {
    args: [FFIType.i64, FFIType.ptr],
    returns: FFIType.ptr
  },
  tensorFromInt32Buffer: {
    args: [FFIType.i64, FFIType.ptr],
    returns: FFIType.ptr
  },
  tensorFromInt64Buffer: {
    args: [FFIType.i64, FFIType.ptr],
    returns: FFIType.ptr
  },
  tensorFromUint8Buffer: {
    args: [FFIType.i64, FFIType.ptr],
    returns: FFIType.ptr
  },
  tensorFromUint16Buffer: {
    args: [FFIType.i64, FFIType.ptr],
    returns: FFIType.ptr
  },
  tensorFromUint32Buffer: {
    args: [FFIType.i64, FFIType.ptr],
    returns: FFIType.ptr
  },
  tensorFromUint64Buffer: {
    args: [FFIType.i64, FFIType.ptr],
    returns: FFIType.ptr
  },
  load: {
    args: [FFIType.ptr, FFIType.int],
    returns: FFIType.ptr
  },
  _conv2dBackwardData: {
    args: [
      FFIType.ptr,
      FFIType.ptr,
      FFIType.ptr,
      FFIType.ptr,
      FFIType.int,
      FFIType.int,
      FFIType.int,
      FFIType.int,
      FFIType.int,
      FFIType.int,
      FFIType.int
    ],
    returns: FFIType.ptr
  },
  _astype: {
    args: [FFIType.ptr, FFIType.int],
    returns: FFIType.ptr
  },
  _save: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.int]
  },
  _eval: {
    args: [FFIType.ptr]
  },
  _float16Buffer: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _float32Buffer: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _float64Buffer: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _int16Buffer: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _int32Buffer: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _int64Buffer: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _uint8Buffer: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _uint16Buffer: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _uint32Buffer: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _uint64Buffer: {
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
  _pad: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64, FFIType.ptr, FFIType.i64],
    returns: FFIType.ptr
  },
  _copy: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _float16Scalar: {
    args: [FFIType.ptr],
    returns: FFIType.float
  },
  _float32Scalar: {
    args: [FFIType.ptr],
    returns: FFIType.f32
  },
  _float64Scalar: {
    args: [FFIType.ptr],
    returns: FFIType.f64
  },
  _boolInt8Scalar: {
    args: [FFIType.ptr],
    returns: FFIType.i8
  },
  _int16Scalar: {
    args: [FFIType.ptr],
    returns: FFIType.i16
  },
  _int32Scalar: {
    args: [FFIType.ptr],
    returns: FFIType.i32
  },
  _int64Scalar: {
    args: [FFIType.ptr],
    returns: FFIType.i64
  },
  _uint8Scalar: {
    args: [FFIType.ptr],
    returns: FFIType.u8
  },
  _uint16Scalar: {
    args: [FFIType.ptr],
    returns: FFIType.u16
  },
  _uint32Scalar: {
    args: [FFIType.ptr],
    returns: FFIType.u32
  },
  _uint64Scalar: {
    args: [FFIType.ptr],
    returns: FFIType.u64
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
  _dtype: {
    args: [FFIType.ptr],
    returns: FFIType.i32
  },
  _shape: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i32],
    returns: FFIType.i32
  }
}

export { ffi_tensor }
