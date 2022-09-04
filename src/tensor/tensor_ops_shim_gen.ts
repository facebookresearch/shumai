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
      this.cleanUp()
      const t = wrapFunc(fl._reshape.native, this, shape_ptr, shape_len, true)
      t.op = 'reshape'
      return t
    },

    transpose(axes: number[]) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      this.cleanUp()
      const t = wrapFunc(fl._transpose.native, this, axes_ptr, axes_len, true)
      t.op = 'transpose'
      return t
    },

    tile(shape: number[]) {
      const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
      this.cleanUp()
      const t = wrapFunc(fl._tile.native, this, shape_ptr, shape_len, true)
      t.op = 'tile'
      return t
    },

    nonzero() {
      this.cleanUp()
      const t = wrapFunc(fl._nonzero.native, this, true)
      t.op = 'nonzero'
      return t
    },

    negative() {
      this.cleanUp()
      const t = wrapFunc(fl._negative.native, this, true)
      t.op = 'negative'
      return t
    },

    logicalNot() {
      this.cleanUp()
      const t = wrapFunc(fl._logicalNot.native, this, true)
      t.op = 'logicalNot'
      return t
    },

    exp() {
      this.cleanUp()
      const t = wrapFunc(fl._exp.native, this, true)
      t.op = 'exp'
      return t
    },

    log() {
      this.cleanUp()
      const t = wrapFunc(fl._log.native, this, true)
      t.op = 'log'
      return t
    },

    log1p() {
      this.cleanUp()
      const t = wrapFunc(fl._log1p.native, this, true)
      t.op = 'log1p'
      return t
    },

    sin() {
      this.cleanUp()
      const t = wrapFunc(fl._sin.native, this, true)
      t.op = 'sin'
      return t
    },

    cos() {
      this.cleanUp()
      const t = wrapFunc(fl._cos.native, this, true)
      t.op = 'cos'
      return t
    },

    sqrt() {
      this.cleanUp()
      const t = wrapFunc(fl._sqrt.native, this, true)
      t.op = 'sqrt'
      return t
    },

    tanh() {
      this.cleanUp()
      const t = wrapFunc(fl._tanh.native, this, true)
      t.op = 'tanh'
      return t
    },

    floor() {
      this.cleanUp()
      const t = wrapFunc(fl._floor.native, this, true)
      t.op = 'floor'
      return t
    },

    ceil() {
      this.cleanUp()
      const t = wrapFunc(fl._ceil.native, this, true)
      t.op = 'ceil'
      return t
    },

    rint() {
      this.cleanUp()
      const t = wrapFunc(fl._rint.native, this, true)
      t.op = 'rint'
      return t
    },

    absolute() {
      this.cleanUp()
      const t = wrapFunc(fl._absolute.native, this, true)
      t.op = 'absolute'
      return t
    },

    abs() {
      this.cleanUp()
      const t = wrapFunc(fl._abs.native, this, true)
      t.op = 'abs'
      return t
    },

    sigmoid() {
      this.cleanUp()
      const t = wrapFunc(fl._sigmoid.native, this, true)
      t.op = 'sigmoid'
      return t
    },

    erf() {
      this.cleanUp()
      const t = wrapFunc(fl._erf.native, this, true)
      t.op = 'erf'
      return t
    },

    flip(dim: number) {
      this.cleanUp()
      const t = wrapFunc(
        fl._flip.native,
        this,
        dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0,
        true
      )
      t.op = 'flip'
      return t
    },

    clip(low: TensorInterface, high: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._clip.native, this, low, high, true)
      t.op = 'clip'
      return t
    },

    roll(shift: number, axis: number) {
      this.cleanUp()
      const t = wrapFunc(
        fl._roll.native,
        this,
        shift | 0,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
        true
      )
      t.op = 'roll'
      return t
    },

    isnan() {
      this.cleanUp()
      const t = wrapFunc(fl._isnan.native, this, true)
      t.op = 'isnan'
      return t
    },

    isinf() {
      this.cleanUp()
      const t = wrapFunc(fl._isinf.native, this, true)
      t.op = 'isinf'
      return t
    },

    sign() {
      this.cleanUp()
      const t = wrapFunc(fl._sign.native, this, true)
      t.op = 'sign'
      return t
    },

    tril() {
      this.cleanUp()
      const t = wrapFunc(fl._tril.native, this, true)
      t.op = 'tril'
      return t
    },

    triu() {
      this.cleanUp()
      const t = wrapFunc(fl._triu.native, this, true)
      t.op = 'triu'
      return t
    },

    where(x: TensorInterface, y: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._where.native, this, x, y, true)
      t.op = 'where'
      return t
    },

    sort(dim: number) {
      this.cleanUp()
      const t = wrapFunc(
        fl._sort.native,
        this,
        dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0,
        true
      )
      t.op = 'sort'
      return t
    },

    add(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._add.native, this, tensor, true)
      t.op = 'add'
      return t
    },

    sub(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._sub.native, this, tensor, true)
      t.op = 'sub'
      return t
    },

    mul(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._mul.native, this, tensor, true)
      t.op = 'mul'
      return t
    },

    div(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._div.native, this, tensor, true)
      t.op = 'div'
      return t
    },

    eq(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._eq.native, this, tensor, true)
      t.op = 'eq'
      return t
    },

    neq(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._neq.native, this, tensor, true)
      t.op = 'neq'
      return t
    },

    lessThan(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._lessThan.native, this, tensor, true)
      t.op = 'lessThan'
      return t
    },

    lessThanEqual(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._lessThanEqual.native, this, tensor, true)
      t.op = 'lessThanEqual'
      return t
    },

    greaterThan(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._greaterThan.native, this, tensor, true)
      t.op = 'greaterThan'
      return t
    },

    greaterThanEqual(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._greaterThanEqual.native, this, tensor, true)
      t.op = 'greaterThanEqual'
      return t
    },

    logicalOr(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._logicalOr.native, this, tensor, true)
      t.op = 'logicalOr'
      return t
    },

    logicalAnd(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._logicalAnd.native, this, tensor, true)
      t.op = 'logicalAnd'
      return t
    },

    mod(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._mod.native, this, tensor, true)
      t.op = 'mod'
      return t
    },

    bitwiseAnd(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._bitwiseAnd.native, this, tensor, true)
      t.op = 'bitwiseAnd'
      return t
    },

    bitwiseOr(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._bitwiseOr.native, this, tensor, true)
      t.op = 'bitwiseOr'
      return t
    },

    bitwiseXor(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._bitwiseXor.native, this, tensor, true)
      t.op = 'bitwiseXor'
      return t
    },

    lShift(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._lShift.native, this, tensor, true)
      t.op = 'lShift'
      return t
    },

    rShift(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._rShift.native, this, tensor, true)
      t.op = 'rShift'
      return t
    },

    minimum(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._minimum.native, this, tensor, true)
      t.op = 'minimum'
      return t
    },

    maximum(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._maximum.native, this, tensor, true)
      t.op = 'maximum'
      return t
    },

    power(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._power.native, this, tensor, true)
      t.op = 'power'
      return t
    },

    matmul(tensor: TensorInterface) {
      this.cleanUp()
      const t = wrapFunc(fl._matmul.native, this, tensor, true)
      t.op = 'matmul'
      return t
    },

    amin(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      this.cleanUp()
      const t = wrapFunc(fl._amin.native, this, axes_ptr, axes_len, !!keep_dims, true)
      t.op = 'amin'
      return t
    },

    amax(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      this.cleanUp()
      const t = wrapFunc(fl._amax.native, this, axes_ptr, axes_len, !!keep_dims, true)
      t.op = 'amax'
      return t
    },

    argmin(axis: number, keep_dims = false) {
      this.cleanUp()
      const t = wrapFunc(
        fl._argmin.native,
        this,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
        !!keep_dims,
        true
      )
      t.op = 'argmin'
      return t
    },

    argmax(axis: number, keep_dims = false) {
      this.cleanUp()
      const t = wrapFunc(
        fl._argmax.native,
        this,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
        !!keep_dims,
        true
      )
      t.op = 'argmax'
      return t
    },

    sum(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      this.cleanUp()
      const t = wrapFunc(fl._sum.native, this, axes_ptr, axes_len, !!keep_dims, true)
      t.op = 'sum'
      return t
    },

    cumsum(axis: number) {
      this.cleanUp()
      const t = wrapFunc(
        fl._cumsum.native,
        this,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
        true
      )
      t.op = 'cumsum'
      return t
    },

    mean(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      this.cleanUp()
      const t = wrapFunc(fl._mean.native, this, axes_ptr, axes_len, !!keep_dims, true)
      t.op = 'mean'
      return t
    },

    median(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      this.cleanUp()
      const t = wrapFunc(fl._median.native, this, axes_ptr, axes_len, !!keep_dims, true)
      t.op = 'median'
      return t
    },

    _var(axes: number | number[] = [], bias = false, keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      this.cleanUp()
      const t = wrapFunc(fl._var.native, this, axes_ptr, axes_len, !!bias, !!keep_dims, true)
      t.op = 'var'
      return t
    },

    std(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      this.cleanUp()
      const t = wrapFunc(fl._std.native, this, axes_ptr, axes_len, !!keep_dims, true)
      t.op = 'std'
      return t
    },

    norm(axes: number | number[] = [], p = 2, keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      this.cleanUp()
      const t = wrapFunc(
        fl._norm.native,
        this,
        axes_ptr,
        axes_len,
        p + 0.00000000000001 - 0.00000000000001,
        !!keep_dims,
        true
      )
      t.op = 'norm'
      return t
    },

    countNonzero(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      this.cleanUp()
      const t = wrapFunc(fl._countNonzero.native, this, axes_ptr, axes_len, !!keep_dims, true)
      t.op = 'countNonzero'
      return t
    },

    any(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      this.cleanUp()
      const t = wrapFunc(fl._any.native, this, axes_ptr, axes_len, !!keep_dims, true)
      t.op = 'any'
      return t
    },

    all(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      this.cleanUp()
      const t = wrapFunc(fl._all.native, this, axes_ptr, axes_len, !!keep_dims, true)
      t.op = 'all'
      return t
    }
  }
}
