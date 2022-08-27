/* GENERATED CODE (gen_binding.py) */
import { FFIType } from 'bun:ffi';
let ffi_tensor_ops = {
  _rand: {
    args: [FFIType.ptr, FFIType.i64],
    returns: FFIType.ptr
  },
  _randn: {
    args: [FFIType.ptr, FFIType.i64],
    returns: FFIType.ptr
  },
  _full: {
    args: [FFIType.ptr, FFIType.i64, FFIType.f32],
    returns: FFIType.ptr
  },
  _identity: {
    args: [FFIType.i64],
    returns: FFIType.ptr
  },
  _arange: {
    args: [FFIType.f32, FFIType.f32, FFIType.f32],
    returns: FFIType.ptr
  },
  _iota: {
    args: [FFIType.ptr, FFIType.i64, FFIType.ptr, FFIType.i64],
    returns: FFIType.ptr
  },
  _reshape: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64],
    returns: FFIType.ptr
  },
  _transpose: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64],
    returns: FFIType.ptr
  },
  _tile: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64],
    returns: FFIType.ptr
  },
  _nonzero: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _negative: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _logicalNot: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _exp: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _log: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _log1p: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _sin: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _cos: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _sqrt: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _tanh: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _floor: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _ceil: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _rint: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _absolute: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _abs: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _sigmoid: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _erf: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _flip: {
    args: [FFIType.ptr, FFIType.u32],
    returns: FFIType.ptr
  },
  _clip: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _roll: {
    args: [FFIType.ptr, FFIType.i32, FFIType.u32],
    returns: FFIType.ptr
  },
  _isnan: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _isinf: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _sign: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _tril: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _triu: {
    args: [FFIType.ptr],
    returns: FFIType.ptr
  },
  _where: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _sort: {
    args: [FFIType.ptr, FFIType.u32],
    returns: FFIType.ptr
  },
  _add: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _sub: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _mul: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _div: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _eq: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _neq: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _lessThan: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _lessThanEqual: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _greaterThan: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _greaterThanEqual: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _logicalOr: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _logicalAnd: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _mod: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _bitwiseAnd: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _bitwiseOr: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _bitwiseXor: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _lShift: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _rShift: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _minimum: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _maximum: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _power: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _matmul: {
    args: [FFIType.ptr, FFIType.ptr],
    returns: FFIType.ptr
  },
  _amin: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64, FFIType.bool],
    returns: FFIType.ptr
  },
  _amax: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64, FFIType.bool],
    returns: FFIType.ptr
  },
  _argmin: {
    args: [FFIType.ptr, FFIType.u32, FFIType.bool],
    returns: FFIType.ptr
  },
  _argmax: {
    args: [FFIType.ptr, FFIType.u32, FFIType.bool],
    returns: FFIType.ptr
  },
  _sum: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64, FFIType.bool],
    returns: FFIType.ptr
  },
  _cumsum: {
    args: [FFIType.ptr, FFIType.u32],
    returns: FFIType.ptr
  },
  _mean: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64, FFIType.bool],
    returns: FFIType.ptr
  },
  _median: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64, FFIType.bool],
    returns: FFIType.ptr
  },
  _var: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64, FFIType.bool, FFIType.bool],
    returns: FFIType.ptr
  },
  _std: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64, FFIType.bool],
    returns: FFIType.ptr
  },
  _norm: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64, FFIType.f64, FFIType.bool],
    returns: FFIType.ptr
  },
  _countNonzero: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64, FFIType.bool],
    returns: FFIType.ptr
  },
  _any: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64, FFIType.bool],
    returns: FFIType.ptr
  },
  _all: {
    args: [FFIType.ptr, FFIType.ptr, FFIType.i64, FFIType.bool],
    returns: FFIType.ptr
  },
};
export { ffi_tensor_ops };
