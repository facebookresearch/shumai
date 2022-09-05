/* GENERATED CODE (gen_binding.py) */
import { FFIType } from 'bun:ffi'
import { arrayArg } from '../ffi/ffi_bind_utils'
import { fl } from '../ffi/ffi_flashlight'
import { Tensor, wrapFLTensor } from './tensor'

export function rand(shape: number[]) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const t = wrapFLTensor(fl._rand.native, shape_ptr, shape_len)
  t.op = 'rand'
  return t
}

export function randn(shape: number[]) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const t = wrapFLTensor(fl._randn.native, shape_ptr, shape_len)
  t.op = 'randn'
  return t
}

export function full(shape: number[], val: number) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const t = wrapFLTensor(fl._full.native, shape_ptr, shape_len, Math.fround(val))
  t.op = 'full'
  return t
}

export function identity(dim: number) {
  const t = wrapFLTensor(fl._identity.native, dim.constructor === BigInt ? dim : BigInt(dim || 0))
  t.op = 'identity'
  return t
}

export function arange(start: number, end: number, step = 1) {
  const t = wrapFLTensor(fl._arange.native, Math.fround(start), Math.fround(end), Math.fround(step))
  t.op = 'arange'
  return t
}

export function iota(dims: number[], tileDims: number[] = [1]) {
  const [dims_ptr, dims_len] = arrayArg(dims, FFIType.i64)
  const [tileDims_ptr, tileDims_len] = arrayArg(tileDims, FFIType.i64)
  const t = wrapFLTensor(fl._iota.native, dims_ptr, dims_len, tileDims_ptr, tileDims_len)
  t.op = 'iota'
  return t
}

export function reshape(tensor: Tensor, shape: number[]) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const t = wrapFLTensor(fl._reshape.native, tensor, shape_ptr, shape_len)
  t.op = 'reshape'
  return t
}

export function transpose(tensor: Tensor, axes: number[]) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const t = wrapFLTensor(fl._transpose.native, tensor, axes_ptr, axes_len)
  t.op = 'transpose'
  return t
}

export function tile(tensor: Tensor, shape: number[]) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const t = wrapFLTensor(fl._tile.native, tensor, shape_ptr, shape_len)
  t.op = 'tile'
  return t
}

export function nonzero(tensor: Tensor) {
  const t = wrapFLTensor(fl._nonzero.native, tensor)
  t.op = 'nonzero'
  return t
}

export function negative(tensor: Tensor) {
  const t = wrapFLTensor(fl._negative.native, tensor)
  t.op = 'negative'
  return t
}

export function logicalNot(tensor: Tensor) {
  const t = wrapFLTensor(fl._logicalNot.native, tensor)
  t.op = 'logicalNot'
  return t
}

export function exp(tensor: Tensor) {
  const t = wrapFLTensor(fl._exp.native, tensor)
  t.op = 'exp'
  return t
}

export function log(tensor: Tensor) {
  const t = wrapFLTensor(fl._log.native, tensor)
  t.op = 'log'
  return t
}

export function log1p(tensor: Tensor) {
  const t = wrapFLTensor(fl._log1p.native, tensor)
  t.op = 'log1p'
  return t
}

export function sin(tensor: Tensor) {
  const t = wrapFLTensor(fl._sin.native, tensor)
  t.op = 'sin'
  return t
}

export function cos(tensor: Tensor) {
  const t = wrapFLTensor(fl._cos.native, tensor)
  t.op = 'cos'
  return t
}

export function sqrt(tensor: Tensor) {
  const t = wrapFLTensor(fl._sqrt.native, tensor)
  t.op = 'sqrt'
  return t
}

export function tanh(tensor: Tensor) {
  const t = wrapFLTensor(fl._tanh.native, tensor)
  t.op = 'tanh'
  return t
}

export function floor(tensor: Tensor) {
  const t = wrapFLTensor(fl._floor.native, tensor)
  t.op = 'floor'
  return t
}

export function ceil(tensor: Tensor) {
  const t = wrapFLTensor(fl._ceil.native, tensor)
  t.op = 'ceil'
  return t
}

export function rint(tensor: Tensor) {
  const t = wrapFLTensor(fl._rint.native, tensor)
  t.op = 'rint'
  return t
}

export function absolute(tensor: Tensor) {
  const t = wrapFLTensor(fl._absolute.native, tensor)
  t.op = 'absolute'
  return t
}

export function abs(tensor: Tensor) {
  const t = wrapFLTensor(fl._abs.native, tensor)
  t.op = 'abs'
  return t
}

export function sigmoid(tensor: Tensor) {
  const t = wrapFLTensor(fl._sigmoid.native, tensor)
  t.op = 'sigmoid'
  return t
}

export function erf(tensor: Tensor) {
  const t = wrapFLTensor(fl._erf.native, tensor)
  t.op = 'erf'
  return t
}

export function flip(tensor: Tensor, dim: number) {
  const t = wrapFLTensor(
    fl._flip.native,
    tensor,
    dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0
  )
  t.op = 'flip'
  return t
}

export function clip(tensor: Tensor, low: Tensor, high: Tensor) {
  const t = wrapFLTensor(fl._clip.native, tensor, low, high)
  t.op = 'clip'
  return t
}

export function roll(tensor: Tensor, shift: number, axis: number) {
  const t = wrapFLTensor(
    fl._roll.native,
    tensor,
    shift | 0,
    axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0
  )
  t.op = 'roll'
  return t
}

export function isnan(tensor: Tensor) {
  const t = wrapFLTensor(fl._isnan.native, tensor)
  t.op = 'isnan'
  return t
}

export function isinf(tensor: Tensor) {
  const t = wrapFLTensor(fl._isinf.native, tensor)
  t.op = 'isinf'
  return t
}

export function sign(tensor: Tensor) {
  const t = wrapFLTensor(fl._sign.native, tensor)
  t.op = 'sign'
  return t
}

export function tril(tensor: Tensor) {
  const t = wrapFLTensor(fl._tril.native, tensor)
  t.op = 'tril'
  return t
}

export function triu(tensor: Tensor) {
  const t = wrapFLTensor(fl._triu.native, tensor)
  t.op = 'triu'
  return t
}

export function where(cond: Tensor, x: Tensor, y: Tensor) {
  const t = wrapFLTensor(fl._where.native, cond, x, y)
  t.op = 'where'
  return t
}

export function sort(tensor: Tensor, dim: number) {
  const t = wrapFLTensor(
    fl._sort.native,
    tensor,
    dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0
  )
  t.op = 'sort'
  return t
}

export function add(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._add.native, tensor, other)
  t.op = 'add'
  return t
}

export function sub(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._sub.native, tensor, other)
  t.op = 'sub'
  return t
}

export function mul(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._mul.native, tensor, other)
  t.op = 'mul'
  return t
}

export function div(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._div.native, tensor, other)
  t.op = 'div'
  return t
}

export function eq(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._eq.native, tensor, other)
  t.op = 'eq'
  return t
}

export function neq(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._neq.native, tensor, other)
  t.op = 'neq'
  return t
}

export function lessThan(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._lessThan.native, tensor, other)
  t.op = 'lessThan'
  return t
}

export function lessThanEqual(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._lessThanEqual.native, tensor, other)
  t.op = 'lessThanEqual'
  return t
}

export function greaterThan(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._greaterThan.native, tensor, other)
  t.op = 'greaterThan'
  return t
}

export function greaterThanEqual(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._greaterThanEqual.native, tensor, other)
  t.op = 'greaterThanEqual'
  return t
}

export function logicalOr(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._logicalOr.native, tensor, other)
  t.op = 'logicalOr'
  return t
}

export function logicalAnd(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._logicalAnd.native, tensor, other)
  t.op = 'logicalAnd'
  return t
}

export function mod(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._mod.native, tensor, other)
  t.op = 'mod'
  return t
}

export function bitwiseAnd(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._bitwiseAnd.native, tensor, other)
  t.op = 'bitwiseAnd'
  return t
}

export function bitwiseOr(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._bitwiseOr.native, tensor, other)
  t.op = 'bitwiseOr'
  return t
}

export function bitwiseXor(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._bitwiseXor.native, tensor, other)
  t.op = 'bitwiseXor'
  return t
}

export function lShift(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._lShift.native, tensor, other)
  t.op = 'lShift'
  return t
}

export function rShift(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._rShift.native, tensor, other)
  t.op = 'rShift'
  return t
}

export function minimum(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._minimum.native, tensor, other)
  t.op = 'minimum'
  return t
}

export function maximum(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._maximum.native, tensor, other)
  t.op = 'maximum'
  return t
}

export function power(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._power.native, tensor, other)
  t.op = 'power'
  return t
}

export function matmul(tensor: Tensor, other: Tensor) {
  const t = wrapFLTensor(fl._matmul.native, tensor, other)
  t.op = 'matmul'
  return t
}

export function amin(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const t = wrapFLTensor(fl._amin.native, tensor, axes_ptr, axes_len, !!keep_dims)
  t.op = 'amin'
  return t
}

export function amax(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const t = wrapFLTensor(fl._amax.native, tensor, axes_ptr, axes_len, !!keep_dims)
  t.op = 'amax'
  return t
}

export function argmin(tensor: Tensor, axis: number, keep_dims = false) {
  const t = wrapFLTensor(
    fl._argmin.native,
    tensor,
    axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
    !!keep_dims
  )
  t.op = 'argmin'
  return t
}

export function argmax(tensor: Tensor, axis: number, keep_dims = false) {
  const t = wrapFLTensor(
    fl._argmax.native,
    tensor,
    axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
    !!keep_dims
  )
  t.op = 'argmax'
  return t
}

export function sum(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const t = wrapFLTensor(fl._sum.native, tensor, axes_ptr, axes_len, !!keep_dims)
  t.op = 'sum'
  return t
}

export function cumsum(tensor: Tensor, axis: number) {
  const t = wrapFLTensor(
    fl._cumsum.native,
    tensor,
    axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0
  )
  t.op = 'cumsum'
  return t
}

export function mean(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const t = wrapFLTensor(fl._mean.native, tensor, axes_ptr, axes_len, !!keep_dims)
  t.op = 'mean'
  return t
}

export function median(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const t = wrapFLTensor(fl._median.native, tensor, axes_ptr, axes_len, !!keep_dims)
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
  const t = wrapFLTensor(fl._var.native, tensor, axes_ptr, axes_len, !!bias, !!keep_dims)
  t.op = 'var'
  return t
}

export function std(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const t = wrapFLTensor(fl._std.native, tensor, axes_ptr, axes_len, !!keep_dims)
  t.op = 'std'
  return t
}

export function norm(tensor: Tensor, axes: number | number[] = [], p = 2, keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const t = wrapFLTensor(
    fl._norm.native,
    tensor,
    axes_ptr,
    axes_len,
    p + 0.00000000000001 - 0.00000000000001,
    !!keep_dims
  )
  t.op = 'norm'
  return t
}

export function countNonzero(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const t = wrapFLTensor(fl._countNonzero.native, tensor, axes_ptr, axes_len, !!keep_dims)
  t.op = 'countNonzero'
  return t
}

export function any(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const t = wrapFLTensor(fl._any.native, tensor, axes_ptr, axes_len, !!keep_dims)
  t.op = 'any'
  return t
}

export function all(tensor: Tensor, axes: number | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const t = wrapFLTensor(fl._all.native, tensor, axes_ptr, axes_len, !!keep_dims)
  t.op = 'all'
  return t
}
