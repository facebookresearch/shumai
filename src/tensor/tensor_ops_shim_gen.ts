/* GENERATED CODE (gen_binding.py) */
import { FFIType } from 'bun:ffi'
import { arrayArg } from '../ffi/ffi_bind_utils'
import { fl } from '../ffi/ffi_flashlight'
import { TensorInterface } from './tensor_interface'
import type { Tensor } from './tensor'
export const gen_tensor_op_shim = (
  wrapFunc: (closure: CallableFunction, ...args: any[]) => Tensor
) => {
  return {
    reshape(shape: number[]) {
      const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
      const t = wrapFunc(fl._reshape.native, this, shape_ptr, shape_len)
      t.op = 'reshape'
      return t
    },

    transpose(axes: number[]) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._transpose.native, this, axes_ptr, axes_len)
      t.op = 'transpose'
      return t
    },

    tile(shape: number[]) {
      const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
      const t = wrapFunc(fl._tile.native, this, shape_ptr, shape_len)
      t.op = 'tile'
      return t
    },

    nonzero() {
      const t = wrapFunc(fl._nonzero.native, this)
      t.op = 'nonzero'
      return t
    },

    negative() {
      const t = wrapFunc(fl._negative.native, this)
      t.op = 'negative'
      return t
    },

    logicalNot() {
      const t = wrapFunc(fl._logicalNot.native, this)
      t.op = 'logicalNot'
      return t
    },

    exp() {
      const t = wrapFunc(fl._exp.native, this)
      t.op = 'exp'
      return t
    },

    log() {
      const t = wrapFunc(fl._log.native, this)
      t.op = 'log'
      return t
    },

    log1p() {
      const t = wrapFunc(fl._log1p.native, this)
      t.op = 'log1p'
      return t
    },

    sin() {
      const t = wrapFunc(fl._sin.native, this)
      t.op = 'sin'
      return t
    },

    cos() {
      const t = wrapFunc(fl._cos.native, this)
      t.op = 'cos'
      return t
    },

    sqrt() {
      const t = wrapFunc(fl._sqrt.native, this)
      t.op = 'sqrt'
      return t
    },

    tanh() {
      const t = wrapFunc(fl._tanh.native, this)
      t.op = 'tanh'
      return t
    },

    floor() {
      const t = wrapFunc(fl._floor.native, this)
      t.op = 'floor'
      return t
    },

    ceil() {
      const t = wrapFunc(fl._ceil.native, this)
      t.op = 'ceil'
      return t
    },

    rint() {
      const t = wrapFunc(fl._rint.native, this)
      t.op = 'rint'
      return t
    },

    absolute() {
      const t = wrapFunc(fl._absolute.native, this)
      t.op = 'absolute'
      return t
    },

    abs() {
      const t = wrapFunc(fl._abs.native, this)
      t.op = 'abs'
      return t
    },

    sigmoid() {
      const t = wrapFunc(fl._sigmoid.native, this)
      t.op = 'sigmoid'
      return t
    },

    erf() {
      const t = wrapFunc(fl._erf.native, this)
      t.op = 'erf'
      return t
    },

    flip(dim: number) {
      const t = wrapFunc(
        fl._flip.native,
        this,
        dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0
      )
      t.op = 'flip'
      return t
    },

    clip(low: TensorInterface, high: TensorInterface) {
      const t = wrapFunc(fl._clip.native, this, low, high)
      t.op = 'clip'
      return t
    },

    roll(shift: number, axis: number) {
      const t = wrapFunc(
        fl._roll.native,
        this,
        shift | 0,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0
      )
      t.op = 'roll'
      return t
    },

    isnan() {
      const t = wrapFunc(fl._isnan.native, this)
      t.op = 'isnan'
      return t
    },

    isinf() {
      const t = wrapFunc(fl._isinf.native, this)
      t.op = 'isinf'
      return t
    },

    sign() {
      const t = wrapFunc(fl._sign.native, this)
      t.op = 'sign'
      return t
    },

    tril() {
      const t = wrapFunc(fl._tril.native, this)
      t.op = 'tril'
      return t
    },

    triu() {
      const t = wrapFunc(fl._triu.native, this)
      t.op = 'triu'
      return t
    },

    where(x: TensorInterface, y: TensorInterface) {
      const t = wrapFunc(fl._where.native, this, x, y)
      t.op = 'where'
      return t
    },

    sort(dim: number) {
      const t = wrapFunc(
        fl._sort.native,
        this,
        dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0
      )
      t.op = 'sort'
      return t
    },

    add(tensor: TensorInterface) {
      const t = wrapFunc(fl._add.native, this, tensor)
      t.op = 'add'
      return t
    },

    sub(tensor: TensorInterface) {
      const t = wrapFunc(fl._sub.native, this, tensor)
      t.op = 'sub'
      return t
    },

    mul(tensor: TensorInterface) {
      const t = wrapFunc(fl._mul.native, this, tensor)
      t.op = 'mul'
      return t
    },

    div(tensor: TensorInterface) {
      const t = wrapFunc(fl._div.native, this, tensor)
      t.op = 'div'
      return t
    },

    eq(tensor: TensorInterface) {
      const t = wrapFunc(fl._eq.native, this, tensor)
      t.op = 'eq'
      return t
    },

    neq(tensor: TensorInterface) {
      const t = wrapFunc(fl._neq.native, this, tensor)
      t.op = 'neq'
      return t
    },

    lessThan(tensor: TensorInterface) {
      const t = wrapFunc(fl._lessThan.native, this, tensor)
      t.op = 'lessThan'
      return t
    },

    lessThanEqual(tensor: TensorInterface) {
      const t = wrapFunc(fl._lessThanEqual.native, this, tensor)
      t.op = 'lessThanEqual'
      return t
    },

    greaterThan(tensor: TensorInterface) {
      const t = wrapFunc(fl._greaterThan.native, this, tensor)
      t.op = 'greaterThan'
      return t
    },

    greaterThanEqual(tensor: TensorInterface) {
      const t = wrapFunc(fl._greaterThanEqual.native, this, tensor)
      t.op = 'greaterThanEqual'
      return t
    },

    logicalOr(tensor: TensorInterface) {
      const t = wrapFunc(fl._logicalOr.native, this, tensor)
      t.op = 'logicalOr'
      return t
    },

    logicalAnd(tensor: TensorInterface) {
      const t = wrapFunc(fl._logicalAnd.native, this, tensor)
      t.op = 'logicalAnd'
      return t
    },

    mod(tensor: TensorInterface) {
      const t = wrapFunc(fl._mod.native, this, tensor)
      t.op = 'mod'
      return t
    },

    bitwiseAnd(tensor: TensorInterface) {
      const t = wrapFunc(fl._bitwiseAnd.native, this, tensor)
      t.op = 'bitwiseAnd'
      return t
    },

    bitwiseOr(tensor: TensorInterface) {
      const t = wrapFunc(fl._bitwiseOr.native, this, tensor)
      t.op = 'bitwiseOr'
      return t
    },

    bitwiseXor(tensor: TensorInterface) {
      const t = wrapFunc(fl._bitwiseXor.native, this, tensor)
      t.op = 'bitwiseXor'
      return t
    },

    lShift(tensor: TensorInterface) {
      const t = wrapFunc(fl._lShift.native, this, tensor)
      t.op = 'lShift'
      return t
    },

    rShift(tensor: TensorInterface) {
      const t = wrapFunc(fl._rShift.native, this, tensor)
      t.op = 'rShift'
      return t
    },

    minimum(tensor: TensorInterface) {
      const t = wrapFunc(fl._minimum.native, this, tensor)
      t.op = 'minimum'
      return t
    },

    maximum(tensor: TensorInterface) {
      const t = wrapFunc(fl._maximum.native, this, tensor)
      t.op = 'maximum'
      return t
    },

    power(tensor: TensorInterface) {
      const t = wrapFunc(fl._power.native, this, tensor)
      t.op = 'power'
      return t
    },

    matmul(tensor: TensorInterface) {
      const t = wrapFunc(fl._matmul.native, this, tensor)
      t.op = 'matmul'
      return t
    },

    amin(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._amin.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'amin'
      return t
    },

    amax(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._amax.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'amax'
      return t
    },

    argmin(axis: number, keep_dims = false) {
      const t = wrapFunc(
        fl._argmin.native,
        this,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
        !!keep_dims
      )
      t.op = 'argmin'
      return t
    },

    argmax(axis: number, keep_dims = false) {
      const t = wrapFunc(
        fl._argmax.native,
        this,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
        !!keep_dims
      )
      t.op = 'argmax'
      return t
    },

    sum(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._sum.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'sum'
      return t
    },

    cumsum(axis: number) {
      const t = wrapFunc(
        fl._cumsum.native,
        this,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0
      )
      t.op = 'cumsum'
      return t
    },

    mean(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._mean.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'mean'
      return t
    },

    median(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._median.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'median'
      return t
    },

    _var(axes: number[] = [], bias = false, keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._var.native, this, axes_ptr, axes_len, !!bias, !!keep_dims)
      t.op = 'var'
      return t
    },

    std(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._std.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'std'
      return t
    },

    norm(axes: number[] = [], p = 2, keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(
        fl._norm.native,
        this,
        axes_ptr,
        axes_len,
        p + 0.00000000000001 - 0.00000000000001,
        !!keep_dims
      )
      t.op = 'norm'
      return t
    },

    countNonzero(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._countNonzero.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'countNonzero'
      return t
    },

    any(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._any.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'any'
      return t
    },

    all(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._all.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'all'
      return t
    }
  }
}
