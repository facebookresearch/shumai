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
      t.grad_fn = null
      return t
    },

    transpose(axes: number[]) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._transpose.native, this, axes_ptr, axes_len)
      t.op = 'transpose'
      t.grad_fn = null
      return t
    },

    tile(shape: number[]) {
      const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
      const t = wrapFunc(fl._tile.native, this, shape_ptr, shape_len)
      t.op = 'tile'
      t.grad_fn = null
      return t
    },

    nonzero() {
      const t = wrapFunc(fl._nonzero.native, this)
      t.op = 'nonzero'
      t.grad_fn = null
      return t
    },

    negative() {
      const t = wrapFunc(fl._negative.native, this)
      t.op = 'negative'
      t.grad_fn = null
      return t
    },

    logicalNot() {
      const t = wrapFunc(fl._logicalNot.native, this)
      t.op = 'logicalNot'
      t.grad_fn = null
      return t
    },

    exp() {
      const t = wrapFunc(fl._exp.native, this)
      t.op = 'exp'
      t.grad_fn = null
      return t
    },

    log() {
      const t = wrapFunc(fl._log.native, this)
      t.op = 'log'
      t.grad_fn = null
      return t
    },

    log1p() {
      const t = wrapFunc(fl._log1p.native, this)
      t.op = 'log1p'
      t.grad_fn = null
      return t
    },

    sin() {
      const t = wrapFunc(fl._sin.native, this)
      t.op = 'sin'
      t.grad_fn = null
      return t
    },

    cos() {
      const t = wrapFunc(fl._cos.native, this)
      t.op = 'cos'
      t.grad_fn = null
      return t
    },

    sqrt() {
      const t = wrapFunc(fl._sqrt.native, this)
      t.op = 'sqrt'
      t.grad_fn = null
      return t
    },

    tanh() {
      const t = wrapFunc(fl._tanh.native, this)
      t.op = 'tanh'
      t.grad_fn = null
      return t
    },

    floor() {
      const t = wrapFunc(fl._floor.native, this)
      t.op = 'floor'
      t.grad_fn = null
      return t
    },

    ceil() {
      const t = wrapFunc(fl._ceil.native, this)
      t.op = 'ceil'
      t.grad_fn = null
      return t
    },

    rint() {
      const t = wrapFunc(fl._rint.native, this)
      t.op = 'rint'
      t.grad_fn = null
      return t
    },

    absolute() {
      const t = wrapFunc(fl._absolute.native, this)
      t.op = 'absolute'
      t.grad_fn = null
      return t
    },

    abs() {
      const t = wrapFunc(fl._abs.native, this)
      t.op = 'abs'
      t.grad_fn = null
      return t
    },

    sigmoid() {
      const t = wrapFunc(fl._sigmoid.native, this)
      t.op = 'sigmoid'
      t.grad_fn = null
      return t
    },

    erf() {
      const t = wrapFunc(fl._erf.native, this)
      t.op = 'erf'
      t.grad_fn = null
      return t
    },

    flip(dim: number) {
      const t = wrapFunc(
        fl._flip.native,
        this,
        dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0
      )
      t.op = 'flip'
      t.grad_fn = null
      return t
    },

    clip(low: TensorInterface, high: TensorInterface) {
      const t = wrapFunc(fl._clip.native, this, low, high)
      t.op = 'clip'
      t.grad_fn = null
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
      t.grad_fn = null
      return t
    },

    isnan() {
      const t = wrapFunc(fl._isnan.native, this)
      t.op = 'isnan'
      t.grad_fn = null
      return t
    },

    isinf() {
      const t = wrapFunc(fl._isinf.native, this)
      t.op = 'isinf'
      t.grad_fn = null
      return t
    },

    sign() {
      const t = wrapFunc(fl._sign.native, this)
      t.op = 'sign'
      t.grad_fn = null
      return t
    },

    tril() {
      const t = wrapFunc(fl._tril.native, this)
      t.op = 'tril'
      t.grad_fn = null
      return t
    },

    triu() {
      const t = wrapFunc(fl._triu.native, this)
      t.op = 'triu'
      t.grad_fn = null
      return t
    },

    where(x: TensorInterface, y: TensorInterface) {
      const t = wrapFunc(fl._where.native, this, x, y)
      t.op = 'where'
      t.grad_fn = null
      return t
    },

    sort(dim: number) {
      const t = wrapFunc(
        fl._sort.native,
        this,
        dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0
      )
      t.op = 'sort'
      t.grad_fn = null
      return t
    },

    add(tensor: TensorInterface) {
      const t = wrapFunc(fl._add.native, this, tensor)
      t.op = 'add'
      t.grad_fn = (grad) => {
        return grad.grad_in
      }
      return t
    },

    sub(tensor: TensorInterface) {
      const t = wrapFunc(fl._sub.native, this, tensor)
      t.op = 'sub'
      t.grad_fn = (grad) => {
        if (grad.idx) {
          return grad.grad_in.negative()
        }
        return grad.grad_in
      }
      return t
    },

    mul(tensor: TensorInterface) {
      const t = wrapFunc(fl._mul.native, this, tensor)
      t.op = 'mul'
      t.grad_fn = (grad) => {
        return grad.in[1 - grad.idx].mul(grad.grad_in)
      }
      return t
    },

    div(tensor: TensorInterface) {
      const t = wrapFunc(fl._div.native, this, tensor)
      t.op = 'div'
      t.grad_fn = (grad) => {
        const T = grad.in[0].constructor
        const one = new T(new Float32Array([1]))
        const recip = one.div(grad.in[1])
        const go = grad.grad_in.mul(recip)
        if (grad.idx === 0) {
          return go
        } else if (grad.idx === 1) {
          return go.negate().mul(recip)
        }
      }
      return t
    },

    eq(tensor: TensorInterface) {
      const t = wrapFunc(fl._eq.native, this, tensor)
      t.op = 'eq'
      t.grad_fn = null
      return t
    },

    neq(tensor: TensorInterface) {
      const t = wrapFunc(fl._neq.native, this, tensor)
      t.op = 'neq'
      t.grad_fn = null
      return t
    },

    lessThan(tensor: TensorInterface) {
      const t = wrapFunc(fl._lessThan.native, this, tensor)
      t.op = 'lessThan'
      t.grad_fn = null
      return t
    },

    lessThanEqual(tensor: TensorInterface) {
      const t = wrapFunc(fl._lessThanEqual.native, this, tensor)
      t.op = 'lessThanEqual'
      t.grad_fn = null
      return t
    },

    greaterThan(tensor: TensorInterface) {
      const t = wrapFunc(fl._greaterThan.native, this, tensor)
      t.op = 'greaterThan'
      t.grad_fn = null
      return t
    },

    greaterThanEqual(tensor: TensorInterface) {
      const t = wrapFunc(fl._greaterThanEqual.native, this, tensor)
      t.op = 'greaterThanEqual'
      t.grad_fn = null
      return t
    },

    logicalOr(tensor: TensorInterface) {
      const t = wrapFunc(fl._logicalOr.native, this, tensor)
      t.op = 'logicalOr'
      t.grad_fn = null
      return t
    },

    logicalAnd(tensor: TensorInterface) {
      const t = wrapFunc(fl._logicalAnd.native, this, tensor)
      t.op = 'logicalAnd'
      t.grad_fn = null
      return t
    },

    mod(tensor: TensorInterface) {
      const t = wrapFunc(fl._mod.native, this, tensor)
      t.op = 'mod'
      t.grad_fn = null
      return t
    },

    bitwiseAnd(tensor: TensorInterface) {
      const t = wrapFunc(fl._bitwiseAnd.native, this, tensor)
      t.op = 'bitwiseAnd'
      t.grad_fn = null
      return t
    },

    bitwiseOr(tensor: TensorInterface) {
      const t = wrapFunc(fl._bitwiseOr.native, this, tensor)
      t.op = 'bitwiseOr'
      t.grad_fn = null
      return t
    },

    bitwiseXor(tensor: TensorInterface) {
      const t = wrapFunc(fl._bitwiseXor.native, this, tensor)
      t.op = 'bitwiseXor'
      t.grad_fn = null
      return t
    },

    lShift(tensor: TensorInterface) {
      const t = wrapFunc(fl._lShift.native, this, tensor)
      t.op = 'lShift'
      t.grad_fn = null
      return t
    },

    rShift(tensor: TensorInterface) {
      const t = wrapFunc(fl._rShift.native, this, tensor)
      t.op = 'rShift'
      t.grad_fn = null
      return t
    },

    minimum(tensor: TensorInterface) {
      const t = wrapFunc(fl._minimum.native, this, tensor)
      t.op = 'minimum'
      t.grad_fn = null
      return t
    },

    maximum(tensor: TensorInterface) {
      const t = wrapFunc(fl._maximum.native, this, tensor)
      t.op = 'maximum'
      t.grad_fn = (grad) => {
        const a_idx = grad.idx
        const b_idx = 1 - grad.idx
        const mask = grad.in[a_idx].greaterThan(grad.in[b_idx])
        return mask.mul(grad.grad_in)
      }
      return t
    },

    power(tensor: TensorInterface) {
      const t = wrapFunc(fl._power.native, this, tensor)
      t.op = 'power'
      t.grad_fn = null
      return t
    },

    matmul(tensor: TensorInterface) {
      const t = wrapFunc(fl._matmul.native, this, tensor)
      t.op = 'matmul'
      t.grad_fn = (grad) => {
        if (grad.idx === 0) {
          const yT = grad.in[1].transpose([1, 0])
          return grad.grad_in.matmul(yT)
        } else if (grad.idx === 1) {
          const xT = grad.in[0].transpose([1, 0])
          return xT.matmul(grad.grad_in)
        }
      }
      return t
    },

    amin(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._amin.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'amin'
      t.grad_fn = null
      return t
    },

    amax(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._amax.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'amax'
      t.grad_fn = null
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
      t.grad_fn = null
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
      t.grad_fn = null
      return t
    },

    sum(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._sum.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'sum'
      t.grad_fn = (grad) => {
        return grad.grad_in.tile(grad.in[0].shape)
      }
      return t
    },

    cumsum(axis: number) {
      const t = wrapFunc(
        fl._cumsum.native,
        this,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0
      )
      t.op = 'cumsum'
      t.grad_fn = null
      return t
    },

    mean(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._mean.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'mean'
      t.grad_fn = (grad) => {
        const T = grad.in[0].constructor
        const num = new T(new Float32Array([grad.in[0].elements]))
        return grad.grad_in.tile(grad.in[0].shape).div(num)
      }
      return t
    },

    median(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._median.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'median'
      t.grad_fn = null
      return t
    },

    _var(axes: number[] = [], bias = false, keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._var.native, this, axes_ptr, axes_len, !!bias, !!keep_dims)
      t.op = 'var'
      t.grad_fn = null
      return t
    },

    std(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._std.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'std'
      t.grad_fn = null
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
      t.grad_fn = null
      return t
    },

    countNonzero(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._countNonzero.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'countNonzero'
      t.grad_fn = null
      return t
    },

    any(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._any.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'any'
      t.grad_fn = null
      return t
    },

    all(axes: number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const t = wrapFunc(fl._all.native, this, axes_ptr, axes_len, !!keep_dims)
      t.op = 'all'
      t.grad_fn = null
      return t
    }
  }
}
