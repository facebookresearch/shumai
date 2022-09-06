/* GENERATED CODE (gen_binding.py) */
import { FFIType } from 'bun:ffi'
import { arrayArg } from '../ffi/ffi_bind_utils'
import { fl } from '../ffi/ffi_flashlight'
import { TensorInterface } from './tensor_interface'
import type { Tensor } from './tensor'
export const gen_tensor_op_shim = (_Tensor: (...args: any[]) => Tensor) => {
  return {
    reshape(shape: number[]) {
      const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
      const _ptr = fl._reshape(this.ptr, shape_ptr, shape_len)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'reshape'
      return t
    },

    transpose(axes: number[]) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._transpose(this.ptr, axes_ptr, axes_len)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'transpose'
      return t
    },

    tile(shape: number[]) {
      const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
      const _ptr = fl._tile(this.ptr, shape_ptr, shape_len)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'tile'
      return t
    },

    nonzero() {
      const _ptr = fl._nonzero(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'nonzero'
      return t
    },

    negative() {
      const _ptr = fl._negative(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'negative'
      return t
    },

    logicalNot() {
      const _ptr = fl._logicalNot(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'logicalNot'
      return t
    },

    exp() {
      const _ptr = fl._exp(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'exp'
      return t
    },

    log() {
      const _ptr = fl._log(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'log'
      return t
    },

    log1p() {
      const _ptr = fl._log1p(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'log1p'
      return t
    },

    sin() {
      const _ptr = fl._sin(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'sin'
      return t
    },

    cos() {
      const _ptr = fl._cos(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'cos'
      return t
    },

    sqrt() {
      const _ptr = fl._sqrt(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'sqrt'
      return t
    },

    tanh() {
      const _ptr = fl._tanh(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'tanh'
      return t
    },

    floor() {
      const _ptr = fl._floor(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'floor'
      return t
    },

    ceil() {
      const _ptr = fl._ceil(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'ceil'
      return t
    },

    rint() {
      const _ptr = fl._rint(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'rint'
      return t
    },

    absolute() {
      const _ptr = fl._absolute(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'absolute'
      return t
    },

    abs() {
      const _ptr = fl._abs(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'abs'
      return t
    },

    sigmoid() {
      const _ptr = fl._sigmoid(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'sigmoid'
      return t
    },

    erf() {
      const _ptr = fl._erf(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'erf'
      return t
    },

    flip(dim: number) {
      const _ptr = fl._flip(this.ptr, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'flip'
      return t
    },

    clip(low: TensorInterface, high: TensorInterface) {
      const _ptr = fl._clip(this.ptr, low.ptr, high.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (low.requires_grad) {
        deps.push(low)
      }
      if (high.requires_grad) {
        deps.push(high)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'clip'
      return t
    },

    roll(shift: number, axis: number) {
      const _ptr = fl._roll(
        this.ptr,
        shift | 0,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0
      )
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'roll'
      return t
    },

    isnan() {
      const _ptr = fl._isnan(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'isnan'
      return t
    },

    isinf() {
      const _ptr = fl._isinf(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'isinf'
      return t
    },

    sign() {
      const _ptr = fl._sign(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'sign'
      return t
    },

    tril() {
      const _ptr = fl._tril(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'tril'
      return t
    },

    triu() {
      const _ptr = fl._triu(this.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'triu'
      return t
    },

    where(x: TensorInterface, y: TensorInterface) {
      const _ptr = fl._where(this.ptr, x.ptr, y.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (x.requires_grad) {
        deps.push(x)
      }
      if (y.requires_grad) {
        deps.push(y)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'where'
      return t
    },

    sort(dim: number) {
      const _ptr = fl._sort(this.ptr, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'sort'
      return t
    },

    add(tensor: TensorInterface) {
      const _ptr = fl._add(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'add'
      return t
    },

    sub(tensor: TensorInterface) {
      const _ptr = fl._sub(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'sub'
      return t
    },

    mul(tensor: TensorInterface) {
      const _ptr = fl._mul(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'mul'
      return t
    },

    div(tensor: TensorInterface) {
      const _ptr = fl._div(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'div'
      return t
    },

    eq(tensor: TensorInterface) {
      const _ptr = fl._eq(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'eq'
      return t
    },

    neq(tensor: TensorInterface) {
      const _ptr = fl._neq(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'neq'
      return t
    },

    lessThan(tensor: TensorInterface) {
      const _ptr = fl._lessThan(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'lessThan'
      return t
    },

    lessThanEqual(tensor: TensorInterface) {
      const _ptr = fl._lessThanEqual(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'lessThanEqual'
      return t
    },

    greaterThan(tensor: TensorInterface) {
      const _ptr = fl._greaterThan(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'greaterThan'
      return t
    },

    greaterThanEqual(tensor: TensorInterface) {
      const _ptr = fl._greaterThanEqual(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'greaterThanEqual'
      return t
    },

    logicalOr(tensor: TensorInterface) {
      const _ptr = fl._logicalOr(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'logicalOr'
      return t
    },

    logicalAnd(tensor: TensorInterface) {
      const _ptr = fl._logicalAnd(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'logicalAnd'
      return t
    },

    mod(tensor: TensorInterface) {
      const _ptr = fl._mod(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'mod'
      return t
    },

    bitwiseAnd(tensor: TensorInterface) {
      const _ptr = fl._bitwiseAnd(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'bitwiseAnd'
      return t
    },

    bitwiseOr(tensor: TensorInterface) {
      const _ptr = fl._bitwiseOr(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'bitwiseOr'
      return t
    },

    bitwiseXor(tensor: TensorInterface) {
      const _ptr = fl._bitwiseXor(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'bitwiseXor'
      return t
    },

    lShift(tensor: TensorInterface) {
      const _ptr = fl._lShift(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'lShift'
      return t
    },

    rShift(tensor: TensorInterface) {
      const _ptr = fl._rShift(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'rShift'
      return t
    },

    minimum(tensor: TensorInterface) {
      const _ptr = fl._minimum(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'minimum'
      return t
    },

    maximum(tensor: TensorInterface) {
      const _ptr = fl._maximum(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'maximum'
      return t
    },

    power(tensor: TensorInterface) {
      const _ptr = fl._power(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'power'
      return t
    },

    matmul(tensor: TensorInterface) {
      const _ptr = fl._matmul(this.ptr, tensor.ptr)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      if (tensor.requires_grad) {
        deps.push(tensor)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'matmul'
      return t
    },

    amin(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._amin(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'amin'
      return t
    },

    amax(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._amax(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'amax'
      return t
    },

    argmin(axis: number, keep_dims = false) {
      const _ptr = fl._argmin(
        this.ptr,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
        !!keep_dims
      )
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'argmin'
      return t
    },

    argmax(axis: number, keep_dims = false) {
      const _ptr = fl._argmax(
        this.ptr,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
        !!keep_dims
      )
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'argmax'
      return t
    },

    sum(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._sum(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'sum'
      return t
    },

    cumsum(axis: number) {
      const _ptr = fl._cumsum(
        this.ptr,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0
      )
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'cumsum'
      return t
    },

    mean(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._mean(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'mean'
      return t
    },

    median(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._median(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'median'
      return t
    },

    _var(axes: number | number[] = [], bias = false, keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._var(this.ptr, axes_ptr, axes_len, !!bias, !!keep_dims)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'var'
      return t
    },

    std(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._std(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'std'
      return t
    },

    norm(axes: number | number[] = [], p = 2, keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._norm(
        this.ptr,
        axes_ptr,
        axes_len,
        p + 0.00000000000001 - 0.00000000000001,
        !!keep_dims
      )
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'norm'
      return t
    },

    countNonzero(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._countNonzero(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'countNonzero'
      return t
    },

    any(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._any(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'any'
      return t
    },

    all(axes: number | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._all(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const deps = []
      if (this.requires_grad) {
        deps.push(this)
      }
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = deps.length > 0
      t.op = 'all'
      return t
    }
  }
}
