import {
  FFIType
} from "bun:ffi";

let ffi_tensor = {
  init: {},
  bytesUsed: {
    returns: FFIType.u64,
  },
  createTensor: {
    args: [FFIType.ptr, FFIType.i32],
    returns: FFIType.ptr,
  },
  destroyTensor: {
    args: [FFIType.ptr, FFIType.ptr],
  },
  genTensorDestroyer: {
    returns: FFIType.ptr,
  },
  tensorFromBuffer: {
    args: [FFIType.i32, FFIType.ptr],
    returns: FFIType.ptr,
  },
  buffer: {
    args: [FFIType.ptr],
    returns: FFIType.ptr,
  },
  flatten: {
    args: [FFIType.ptr],
    returns: FFIType.ptr,
  },
  asContiguousTensor: {
    args: [FFIType.ptr],
    returns: FFIType.ptr,
  },
  copy: {
    args: [FFIType.ptr],
    returns: FFIType.ptr,
  },
  scalar: {
    args: [FFIType.ptr],
    returns: FFIType.f32,
  },
  elements: {
    args: [FFIType.ptr],
    returns: FFIType.u64,
  },
  ndim: {
    args: [FFIType.ptr],
    returns: FFIType.i32,
  },
  shape: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i32],
    returns: FFIType.i32,
  },
}

export {
  ffi_tensor
};