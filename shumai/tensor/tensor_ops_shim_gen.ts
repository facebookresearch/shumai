/* GENERATED CODE (gen_binding.py) */
import { FFIType } from 'bun:ffi'
import { arrayArg } from '../ffi/ffi_bind_utils'
import { fl } from '../ffi/ffi_flashlight'
import type { Tensor } from './tensor'
export const gen_tensor_op_shim = (_Tensor: new (...args: unknown[]) => Tensor) => {
  return {
    reshape(shape: BigInt64Array | number[]) {
      const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
      const _ptr = fl._reshape(this.ptr, shape_ptr, shape_len)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, shape_ptr, shape_len] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'reshape'
      return t
    },

    transpose(axes: BigInt64Array | number[]) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._transpose(this.ptr, axes_ptr, axes_len)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'transpose'
      return t
    },

    tile(shape: BigInt64Array | number[]) {
      const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
      const _ptr = fl._tile(this.ptr, shape_ptr, shape_len)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, shape_ptr, shape_len] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'tile'
      return t
    },

    nonzero() {
      const _ptr = fl._nonzero(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'nonzero'
      return t
    },

    negative() {
      const _ptr = fl._negative(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'negative'
      return t
    },

    logicalNot() {
      const _ptr = fl._logicalNot(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'logicalNot'
      return t
    },

    exp() {
      const _ptr = fl._exp(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'exp'
      return t
    },

    log() {
      const _ptr = fl._log(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'log'
      return t
    },

    log1p() {
      const _ptr = fl._log1p(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'log1p'
      return t
    },

    sin() {
      const _ptr = fl._sin(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'sin'
      return t
    },

    cos() {
      const _ptr = fl._cos(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'cos'
      return t
    },

    sqrt() {
      const _ptr = fl._sqrt(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'sqrt'
      return t
    },

    tanh() {
      const _ptr = fl._tanh(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'tanh'
      return t
    },

    floor() {
      const _ptr = fl._floor(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'floor'
      return t
    },

    ceil() {
      const _ptr = fl._ceil(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'ceil'
      return t
    },

    rint() {
      const _ptr = fl._rint(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'rint'
      return t
    },

    absolute() {
      const _ptr = fl._absolute(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'absolute'
      return t
    },

    abs() {
      const _ptr = fl._abs(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'abs'
      return t
    },

    sigmoid() {
      const _ptr = fl._sigmoid(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'sigmoid'
      return t
    },

    erf() {
      const _ptr = fl._erf(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'erf'
      return t
    },

    flip(dim: number) {
      const _ptr = fl._flip(this.ptr, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0)
      const requires_grad = this.requires_grad
      const deps = requires_grad
        ? [this, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'flip'
      return t
    },

    clip(low: Tensor, high: Tensor) {
      const _ptr = fl._clip(this.ptr, low.ptr, high.ptr)
      const requires_grad = this.requires_grad || low.requires_grad || high.requires_grad
      const deps = requires_grad ? [this, low, high] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'clip'
      return t
    },

    roll(shift: number, axis: number) {
      const _ptr = fl._roll(
        this.ptr,
        shift | 0,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0
      )
      const requires_grad = this.requires_grad
      const deps = requires_grad
        ? [this, shift | 0, axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'roll'
      return t
    },

    isnan() {
      const _ptr = fl._isnan(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'isnan'
      return t
    },

    isinf() {
      const _ptr = fl._isinf(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'isinf'
      return t
    },

    sign() {
      const _ptr = fl._sign(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'sign'
      return t
    },

    tril() {
      const _ptr = fl._tril(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'tril'
      return t
    },

    triu() {
      const _ptr = fl._triu(this.ptr)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'triu'
      return t
    },

    where(x: Tensor, y: Tensor) {
      const _ptr = fl._where(this.ptr, x.ptr, y.ptr)
      const requires_grad = this.requires_grad || x.requires_grad || y.requires_grad
      const deps = requires_grad ? [this, x, y] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'where'
      return t
    },

    sort(dim: number) {
      const _ptr = fl._sort(this.ptr, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0)
      const requires_grad = this.requires_grad
      const deps = requires_grad
        ? [this, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'sort'
      return t
    },

    add(tensor: Tensor) {
      const _ptr = fl._add(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'add'
      return t
    },

    sub(tensor: Tensor) {
      const _ptr = fl._sub(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'sub'
      return t
    },

    mul(tensor: Tensor) {
      const _ptr = fl._mul(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'mul'
      return t
    },

    div(tensor: Tensor) {
      const _ptr = fl._div(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'div'
      return t
    },

    eq(tensor: Tensor) {
      const _ptr = fl._eq(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'eq'
      return t
    },

    neq(tensor: Tensor) {
      const _ptr = fl._neq(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'neq'
      return t
    },

    lessThan(tensor: Tensor) {
      const _ptr = fl._lessThan(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'lessThan'
      return t
    },

    lessThanEqual(tensor: Tensor) {
      const _ptr = fl._lessThanEqual(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'lessThanEqual'
      return t
    },

    greaterThan(tensor: Tensor) {
      const _ptr = fl._greaterThan(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'greaterThan'
      return t
    },

    greaterThanEqual(tensor: Tensor) {
      const _ptr = fl._greaterThanEqual(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'greaterThanEqual'
      return t
    },

    logicalOr(tensor: Tensor) {
      const _ptr = fl._logicalOr(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'logicalOr'
      return t
    },

    logicalAnd(tensor: Tensor) {
      const _ptr = fl._logicalAnd(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'logicalAnd'
      return t
    },

    mod(tensor: Tensor) {
      const _ptr = fl._mod(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'mod'
      return t
    },

    bitwiseAnd(tensor: Tensor) {
      const _ptr = fl._bitwiseAnd(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'bitwiseAnd'
      return t
    },

    bitwiseOr(tensor: Tensor) {
      const _ptr = fl._bitwiseOr(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'bitwiseOr'
      return t
    },

    bitwiseXor(tensor: Tensor) {
      const _ptr = fl._bitwiseXor(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'bitwiseXor'
      return t
    },

    lShift(tensor: Tensor) {
      const _ptr = fl._lShift(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'lShift'
      return t
    },

    rShift(tensor: Tensor) {
      const _ptr = fl._rShift(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'rShift'
      return t
    },

    minimum(tensor: Tensor) {
      const _ptr = fl._minimum(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'minimum'
      return t
    },

    maximum(tensor: Tensor) {
      const _ptr = fl._maximum(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'maximum'
      return t
    },

    power(tensor: Tensor) {
      const _ptr = fl._power(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'power'
      return t
    },

    matmul(tensor: Tensor) {
      const _ptr = fl._matmul(this.ptr, tensor.ptr)
      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'matmul'
      return t
    },

    amin(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._amin(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'amin'
      return t
    },

    amax(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._amax(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'amax'
      return t
    },

    argmin(axis: number, keep_dims = false) {
      const _ptr = fl._argmin(
        this.ptr,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
        !!keep_dims
      )
      const requires_grad = this.requires_grad
      const deps = requires_grad
        ? [this, axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0, !!keep_dims]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'argmin'
      return t
    },

    argmax(axis: number, keep_dims = false) {
      const _ptr = fl._argmax(
        this.ptr,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0,
        !!keep_dims
      )
      const requires_grad = this.requires_grad
      const deps = requires_grad
        ? [this, axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0, !!keep_dims]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'argmax'
      return t
    },

    sum(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._sum(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'sum'
      return t
    },

    cumsum(axis: number) {
      const _ptr = fl._cumsum(
        this.ptr,
        axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0
      )
      const requires_grad = this.requires_grad
      const deps = requires_grad
        ? [this, axis <= 0 ? 0 : axis >= 0xffffffff ? 0xffffffff : +axis || 0]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'cumsum'
      return t
    },

    mean(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._mean(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'mean'
      return t
    },

    median(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._median(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'median'
      return t
    },

    _var(axes: BigInt64Array | number[] = [], bias = false, keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._var(this.ptr, axes_ptr, axes_len, !!bias, !!keep_dims)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!bias, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'var'
      return t
    },

    std(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._std(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'std'
      return t
    },

    norm(axes: BigInt64Array | number[] = [], p = 2, keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._norm(
        this.ptr,
        axes_ptr,
        axes_len,
        p + 0.00000000000001 - 0.00000000000001,
        !!keep_dims
      )
      const requires_grad = this.requires_grad
      const deps = requires_grad
        ? [this, axes_ptr, axes_len, p + 0.00000000000001 - 0.00000000000001, !!keep_dims]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'norm'
      return t
    },

    countNonzero(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._countNonzero(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'countNonzero'
      return t
    },

    any(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._any(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'any'
      return t
    },

    all(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const _ptr = fl._all(this.ptr, axes_ptr, axes_len, !!keep_dims)
      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      t.op = 'all'
      return t
    }
  }
}
