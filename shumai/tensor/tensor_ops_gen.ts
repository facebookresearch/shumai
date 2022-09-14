/* GENERATED CODE (gen_binding.py) */
import { FFIType } from 'bun:ffi'
import { arrayArg } from '../ffi/ffi_bind_utils'
import { fl } from '../ffi/ffi_flashlight'
import { Tensor } from './tensor'

export function rand(shape: BigInt64Array | number[]) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const _ptr = fl._rand(shape_ptr, shape_len)
  const requires_grad = false
  const deps = requires_grad ? [shape_ptr, shape_len] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'rand'
  return t
}

export function randn(shape: BigInt64Array | number[]) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const _ptr = fl._randn(shape_ptr, shape_len)
  const requires_grad = false
  const deps = requires_grad ? [shape_ptr, shape_len] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'randn'
  return t
}

export function full(shape: BigInt64Array | number[], val: number) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const _ptr = fl._full(shape_ptr, shape_len, Math.fround(val))
  const requires_grad = false
  const deps = requires_grad ? [shape_ptr, shape_len, Math.fround(val)] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'full'
  return t
}

export function identity(dim: number) {
  const _ptr = fl._identity(dim.constructor === BigInt ? dim : BigInt(dim || 0))
  const requires_grad = false
  const deps = requires_grad ? [dim.constructor === BigInt ? dim : BigInt(dim || 0)] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'identity'
  return t
}

export function arange(start: number, end: number, step = 1) {
  const _ptr = fl._arange(Math.fround(start), Math.fround(end), Math.fround(step))
  const requires_grad = false
  const deps = requires_grad ? [Math.fround(start), Math.fround(end), Math.fround(step)] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'arange'
  return t
}

export function iota(dims: BigInt64Array | number[], tileDims: BigInt64Array | number[] = [1]) {
  const [dims_ptr, dims_len] = arrayArg(dims, FFIType.i64)
  const [tileDims_ptr, tileDims_len] = arrayArg(tileDims, FFIType.i64)
  const _ptr = fl._iota(dims_ptr, dims_len, tileDims_ptr, tileDims_len)
  const requires_grad = false
  const deps = requires_grad ? [dims_ptr, dims_len, tileDims_ptr, tileDims_len] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'iota'
  return t
}

export function reshape(tensor: Tensor, shape: BigInt64Array | number[]) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const _ptr = fl._reshape(tensor.ptr, shape_ptr, shape_len)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, shape_ptr, shape_len] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'reshape'
  return t
}

export function transpose(tensor: Tensor, axes: BigInt64Array | number[]) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const _ptr = fl._transpose(tensor.ptr, axes_ptr, axes_len)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'transpose'
  return t
}

export function tile(tensor: Tensor, shape: BigInt64Array | number[]) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const _ptr = fl._tile(tensor.ptr, shape_ptr, shape_len)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, shape_ptr, shape_len] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'tile'
  return t
}

export function nonzero(tensor: Tensor) {
  const _ptr = fl._nonzero(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'nonzero'
  return t
}

export function negative(tensor: Tensor) {
  const _ptr = fl._negative(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'negative'
  return t
}

export function logicalNot(tensor: Tensor) {
  const _ptr = fl._logicalNot(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'logicalNot'
  return t
}

export function exp(tensor: Tensor) {
  const _ptr = fl._exp(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'exp'
  return t
}

export function log(tensor: Tensor) {
  const _ptr = fl._log(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'log'
  return t
}

export function log1p(tensor: Tensor) {
  const _ptr = fl._log1p(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'log1p'
  return t
}

export function sin(tensor: Tensor) {
  const _ptr = fl._sin(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'sin'
  return t
}

export function cos(tensor: Tensor) {
  const _ptr = fl._cos(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'cos'
  return t
}

export function sqrt(tensor: Tensor) {
  const _ptr = fl._sqrt(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'sqrt'
  return t
}

export function tanh(tensor: Tensor) {
  const _ptr = fl._tanh(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'tanh'
  return t
}

export function floor(tensor: Tensor) {
  const _ptr = fl._floor(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'floor'
  return t
}

export function ceil(tensor: Tensor) {
  const _ptr = fl._ceil(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'ceil'
  return t
}

export function rint(tensor: Tensor) {
  const _ptr = fl._rint(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'rint'
  return t
}

export function absolute(tensor: Tensor) {
  const _ptr = fl._absolute(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'absolute'
  return t
}

export function abs(tensor: Tensor) {
  const _ptr = fl._abs(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'abs'
  return t
}

export function sigmoid(tensor: Tensor) {
  const _ptr = fl._sigmoid(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'sigmoid'
  return t
}

export function erf(tensor: Tensor) {
  const _ptr = fl._erf(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'erf'
  return t
}

export function flip(tensor: Tensor, dim: number) {
  const _ptr = fl._flip(tensor.ptr, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad
    ? [tensor, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0]
    : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'flip'
  return t
}

export function clip(tensor: Tensor, low: Tensor, high: Tensor) {
  const _ptr = fl._clip(tensor.ptr, low.ptr, high.ptr)
  const requires_grad = tensor.requires_grad || low.requires_grad || high.requires_grad
  const deps = requires_grad ? [tensor, low, high] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'clip'
  return t
}

export function roll(tensor: Tensor, shift: number, axis: number) {
  const _ptr = fl._roll(
    tensor.ptr,
    shift | 0,
    axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0
  )
  const requires_grad = tensor.requires_grad
  const deps = requires_grad
    ? [tensor, shift | 0, axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0]
    : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'roll'
  return t
}

export function isnan(tensor: Tensor) {
  const _ptr = fl._isnan(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'isnan'
  return t
}

export function isinf(tensor: Tensor) {
  const _ptr = fl._isinf(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'isinf'
  return t
}

export function sign(tensor: Tensor) {
  const _ptr = fl._sign(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'sign'
  return t
}

export function tril(tensor: Tensor) {
  const _ptr = fl._tril(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'tril'
  return t
}

export function triu(tensor: Tensor) {
  const _ptr = fl._triu(tensor.ptr)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'triu'
  return t
}

export function where(cond: Tensor, x: Tensor, y: Tensor) {
  const _ptr = fl._where(cond.ptr, x.ptr, y.ptr)
  const requires_grad = cond.requires_grad || x.requires_grad || y.requires_grad
  const deps = requires_grad ? [cond, x, y] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'where'
  return t
}

export function sort(tensor: Tensor, dim: number) {
  const _ptr = fl._sort(tensor.ptr, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad
    ? [tensor, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0]
    : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'sort'
  return t
}

export function add(tensor: Tensor, other: Tensor) {
  const _ptr = fl._add(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'add'
  return t
}

export function sub(tensor: Tensor, other: Tensor) {
  const _ptr = fl._sub(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'sub'
  return t
}

export function mul(tensor: Tensor, other: Tensor) {
  const _ptr = fl._mul(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'mul'
  return t
}

export function div(tensor: Tensor, other: Tensor) {
  const _ptr = fl._div(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'div'
  return t
}

export function eq(tensor: Tensor, other: Tensor) {
  const _ptr = fl._eq(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'eq'
  return t
}

export function neq(tensor: Tensor, other: Tensor) {
  const _ptr = fl._neq(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'neq'
  return t
}

export function lessThan(tensor: Tensor, other: Tensor) {
  const _ptr = fl._lessThan(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'lessThan'
  return t
}

export function lessThanEqual(tensor: Tensor, other: Tensor) {
  const _ptr = fl._lessThanEqual(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'lessThanEqual'
  return t
}

export function greaterThan(tensor: Tensor, other: Tensor) {
  const _ptr = fl._greaterThan(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'greaterThan'
  return t
}

export function greaterThanEqual(tensor: Tensor, other: Tensor) {
  const _ptr = fl._greaterThanEqual(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'greaterThanEqual'
  return t
}

export function logicalOr(tensor: Tensor, other: Tensor) {
  const _ptr = fl._logicalOr(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'logicalOr'
  return t
}

export function logicalAnd(tensor: Tensor, other: Tensor) {
  const _ptr = fl._logicalAnd(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'logicalAnd'
  return t
}

export function mod(tensor: Tensor, other: Tensor) {
  const _ptr = fl._mod(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'mod'
  return t
}

export function bitwiseAnd(tensor: Tensor, other: Tensor) {
  const _ptr = fl._bitwiseAnd(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'bitwiseAnd'
  return t
}

export function bitwiseOr(tensor: Tensor, other: Tensor) {
  const _ptr = fl._bitwiseOr(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'bitwiseOr'
  return t
}

export function bitwiseXor(tensor: Tensor, other: Tensor) {
  const _ptr = fl._bitwiseXor(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'bitwiseXor'
  return t
}

export function lShift(tensor: Tensor, other: Tensor) {
  const _ptr = fl._lShift(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'lShift'
  return t
}

export function rShift(tensor: Tensor, other: Tensor) {
  const _ptr = fl._rShift(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'rShift'
  return t
}

export function minimum(tensor: Tensor, other: Tensor) {
  const _ptr = fl._minimum(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'minimum'
  return t
}

export function maximum(tensor: Tensor, other: Tensor) {
  const _ptr = fl._maximum(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'maximum'
  return t
}

export function power(tensor: Tensor, other: Tensor) {
  const _ptr = fl._power(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'power'
  return t
}

export function matmul(tensor: Tensor, other: Tensor) {
  const _ptr = fl._matmul(tensor.ptr, other.ptr)
  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'matmul'
  return t
}

export function amin(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const _ptr = fl._amin(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'amin'
  return t
}

export function amax(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const _ptr = fl._amax(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'amax'
  return t
}

export function argmin(tensor: Tensor, axis: number, keep_dims = false) {
  const _ptr = fl._argmin(
    tensor.ptr,
    axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
    !!keep_dims
  )
  const requires_grad = tensor.requires_grad
  const deps = requires_grad
    ? [tensor, axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0, !!keep_dims]
    : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'argmin'
  return t
}

export function argmax(tensor: Tensor, axis: number, keep_dims = false) {
  const _ptr = fl._argmax(
    tensor.ptr,
    axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
    !!keep_dims
  )
  const requires_grad = tensor.requires_grad
  const deps = requires_grad
    ? [tensor, axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0, !!keep_dims]
    : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'argmax'
  return t
}

export function sum(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const _ptr = fl._sum(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'sum'
  return t
}

export function cumsum(tensor: Tensor, axis: number) {
  const _ptr = fl._cumsum(tensor.ptr, axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad
    ? [tensor, axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0]
    : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'cumsum'
  return t
}

export function mean(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const _ptr = fl._mean(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'mean'
  return t
}

export function median(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const _ptr = fl._median(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'median'
  return t
}

export function _var(
  tensor: Tensor,
  axes: number | number[] = [],
  bias = false,
  keep_dims = false
) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const _ptr = fl._var(tensor.ptr, axes_ptr, axes_len, !!bias, !!keep_dims)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!bias, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'var'
  return t
}

export function std(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const _ptr = fl._std(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'std'
  return t
}

export function norm(tensor: Tensor, axes: number | number[] = [], p = 2, keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const _ptr = fl._norm(
    tensor.ptr,
    axes_ptr,
    axes_len,
    p + 0.00000000000001 - 0.00000000000001,
    !!keep_dims
  )
  const requires_grad = tensor.requires_grad
  const deps = requires_grad
    ? [tensor, axes_ptr, axes_len, p + 0.00000000000001 - 0.00000000000001, !!keep_dims]
    : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'norm'
  return t
}

export function countNonzero(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const _ptr = fl._countNonzero(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'countNonzero'
  return t
}

export function any(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const _ptr = fl._any(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'any'
  return t
}

export function all(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const _ptr = fl._all(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.requires_grad = requires_grad
  t.op = 'all'
  return t
}
