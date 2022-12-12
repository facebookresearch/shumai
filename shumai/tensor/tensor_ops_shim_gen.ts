/* GENERATED CODE (gen_binding.py) */
import { arrayArg } from '../ffi/ffi_bind_utils'
import { fl } from '../ffi/ffi_flashlight'
import { stats } from '../stats'
import type { Tensor } from './tensor'

export const gen_tensor_op_shim = (_Tensor: new (...args: unknown[]) => Tensor) => {
  return {
    reshape(shape: BigInt64Array | number[]) {
      const [shape_ptr, shape_len] = arrayArg(shape)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('reshape')

      const _ptr = fl._reshape.native(this.ptr, shape_ptr, shape_len)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `reshape` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, shape] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'reshape'
      return t
    },

    transpose(axes: BigInt64Array | number[]) {
      const [axes_ptr, axes_len] = arrayArg(axes)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('transpose')

      const _ptr = fl._transpose.native(this.ptr, axes_ptr, axes_len)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `transpose` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'transpose'
      return t
    },

    tile(shape: BigInt64Array | number[]) {
      const [shape_ptr, shape_len] = arrayArg(shape)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('tile')

      const _ptr = fl._tile.native(this.ptr, shape_ptr, shape_len)
      if (!_ptr)
        throw new Error('Tensor returned from `tile` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, shape] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'tile'
      return t
    },

    nonzero() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('nonzero')

      const _ptr = fl._nonzero.native(this.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `nonzero` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'nonzero'
      return t
    },

    negative() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('negative')

      const _ptr = fl._negative.native(this.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `negative` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'negative'
      return t
    },

    negate() {
      return this.negative()
    },

    logicalNot() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('logicalNot')

      const _ptr = fl._logicalNot.native(this.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `logicalNot` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'logicalNot'
      return t
    },

    exp() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('exp')

      const _ptr = fl._exp.native(this.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `exp` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'exp'
      return t
    },

    log() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('log')

      const _ptr = fl._log.native(this.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `log` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'log'
      return t
    },

    log1p() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('log1p')

      const _ptr = fl._log1p.native(this.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `log1p` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'log1p'
      return t
    },

    sin() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('sin')

      const _ptr = fl._sin.native(this.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `sin` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'sin'
      return t
    },

    cos() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('cos')

      const _ptr = fl._cos.native(this.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `cos` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'cos'
      return t
    },

    sqrt() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('sqrt')

      const _ptr = fl._sqrt.native(this.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `sqrt` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'sqrt'
      return t
    },

    tanh() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('tanh')

      const _ptr = fl._tanh.native(this.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `tanh` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'tanh'
      return t
    },

    floor() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('floor')

      const _ptr = fl._floor.native(this.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `floor` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'floor'
      return t
    },

    ceil() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('ceil')

      const _ptr = fl._ceil.native(this.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `ceil` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'ceil'
      return t
    },

    rint() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('rint')

      const _ptr = fl._rint.native(this.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `rint` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'rint'
      return t
    },

    absolute() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('absolute')

      const _ptr = fl._absolute.native(this.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `absolute` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'absolute'
      return t
    },

    abs() {
      return this.absolute()
    },

    sigmoid() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('sigmoid')

      const _ptr = fl._sigmoid.native(this.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `sigmoid` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'sigmoid'
      return t
    },

    erf() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('erf')

      const _ptr = fl._erf.native(this.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `erf` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'erf'
      return t
    },

    flip(dim: number) {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('flip')

      const _ptr = fl._flip.native(
        this.ptr,
        dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0
      )
      if (!_ptr)
        throw new Error('Tensor returned from `flip` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad
        ? [this, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'flip'
      return t
    },

    clip(low: Tensor, high: Tensor) {
      const i = [this, low, high]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('clip')

      const _ptr = fl._clip.native(this.ptr, low.ptr, high.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `clip` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || low.requires_grad || high.requires_grad
      const deps = requires_grad ? [this, low, high] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || low.provenance || high.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'clip'
      return t
    },

    roll(shift: number, axis: number) {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('roll')

      const _ptr = fl._roll.native(this.ptr, shift | 0, axis | 0)
      if (!_ptr)
        throw new Error('Tensor returned from `roll` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, shift | 0, axis | 0] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'roll'
      return t
    },

    isnan() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('isnan')

      const _ptr = fl._isnan.native(this.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `isnan` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'isnan'
      return t
    },

    isinf() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('isinf')

      const _ptr = fl._isinf.native(this.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `isinf` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'isinf'
      return t
    },

    sign() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('sign')

      const _ptr = fl._sign.native(this.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `sign` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'sign'
      return t
    },

    tril() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('tril')

      const _ptr = fl._tril.native(this.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `tril` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'tril'
      return t
    },

    triu() {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('triu')

      const _ptr = fl._triu.native(this.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `triu` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'triu'
      return t
    },

    where(x: Tensor, y: Tensor) {
      const i = [this, x, y]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('where')

      const _ptr = fl._where.native(this.ptr, x.ptr, y.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `where` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || x.requires_grad || y.requires_grad
      const deps = requires_grad ? [this, x, y] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || x.provenance || y.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'where'
      return t
    },

    sort(dim: number) {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('sort')

      const _ptr = fl._sort.native(
        this.ptr,
        dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0
      )
      if (!_ptr)
        throw new Error('Tensor returned from `sort` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad
        ? [this, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'sort'
      return t
    },

    add(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('add')

      const _ptr = fl._add.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `add` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'add'
      return t
    },

    sub(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('sub')

      const _ptr = fl._sub.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `sub` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'sub'
      return t
    },

    mul(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('mul')

      const _ptr = fl._mul.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `mul` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'mul'
      return t
    },

    div(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('div')

      const _ptr = fl._div.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `div` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'div'
      return t
    },

    eq(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('eq')

      const _ptr = fl._eq.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `eq` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'eq'
      return t
    },

    neq(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('neq')

      const _ptr = fl._neq.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `neq` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'neq'
      return t
    },

    lessThan(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('lessThan')

      const _ptr = fl._lessThan.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `lessThan` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'lessThan'
      return t
    },

    lt(tensor: Tensor) {
      return this.lessThan(tensor)
    },

    lessThanEqual(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('lessThanEqual')

      const _ptr = fl._lessThanEqual.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `lessThanEqual` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'lessThanEqual'
      return t
    },

    lte(tensor: Tensor) {
      return this.lessThanEqual(tensor)
    },

    greaterThan(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('greaterThan')

      const _ptr = fl._greaterThan.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `greaterThan` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'greaterThan'
      return t
    },

    gt(tensor: Tensor) {
      return this.greaterThan(tensor)
    },

    greaterThanEqual(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('greaterThanEqual')

      const _ptr = fl._greaterThanEqual.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `greaterThanEqual` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'greaterThanEqual'
      return t
    },

    gte(tensor: Tensor) {
      return this.greaterThanEqual(tensor)
    },

    logicalOr(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('logicalOr')

      const _ptr = fl._logicalOr.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `logicalOr` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'logicalOr'
      return t
    },

    logicalAnd(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('logicalAnd')

      const _ptr = fl._logicalAnd.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `logicalAnd` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'logicalAnd'
      return t
    },

    mod(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('mod')

      const _ptr = fl._mod.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error('Tensor returned from `mod` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'mod'
      return t
    },

    bitwiseAnd(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('bitwiseAnd')

      const _ptr = fl._bitwiseAnd.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `bitwiseAnd` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'bitwiseAnd'
      return t
    },

    bitwiseOr(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('bitwiseOr')

      const _ptr = fl._bitwiseOr.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `bitwiseOr` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'bitwiseOr'
      return t
    },

    bitwiseXor(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('bitwiseXor')

      const _ptr = fl._bitwiseXor.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `bitwiseXor` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'bitwiseXor'
      return t
    },

    lShift(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('lShift')

      const _ptr = fl._lShift.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `lShift` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'lShift'
      return t
    },

    rShift(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('rShift')

      const _ptr = fl._rShift.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `rShift` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'rShift'
      return t
    },

    minimum(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('minimum')

      const _ptr = fl._minimum.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `minimum` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'minimum'
      return t
    },

    maximum(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('maximum')

      const _ptr = fl._maximum.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `maximum` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'maximum'
      return t
    },

    power(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('power')

      const _ptr = fl._power.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `power` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'power'
      return t
    },

    pow(tensor: Tensor) {
      return this.power(tensor)
    },

    matmul(tensor: Tensor) {
      const i = [this, tensor]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('matmul')

      const _ptr = fl._matmul.native(this.ptr, tensor.ptr)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `matmul` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || tensor.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'matmul'
      return t
    },

    mm(tensor: Tensor) {
      return this.matmul(tensor)
    },

    conv2d(weights: Tensor, sx = 1, sy = 1, px = 0, py = 0, dx = 1, dy = 1, groups = 1) {
      const i = [this, weights]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('conv2d')

      const _ptr = fl._conv2d.native(
        this.ptr,
        weights.ptr,
        sx | 0,
        sy | 0,
        px | 0,
        py | 0,
        dx | 0,
        dy | 0,
        groups | 0
      )
      if (!_ptr)
        throw new Error(
          'Tensor returned from `conv2d` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad || weights.requires_grad
      const deps = requires_grad
        ? [this, weights, sx | 0, sy | 0, px | 0, py | 0, dx | 0, dy | 0, groups | 0]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance || weights.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'conv2d'
      return t
    },

    amin(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('amin')

      const _ptr = fl._amin.native(this.ptr, axes_ptr, axes_len, !!keep_dims)
      if (!_ptr)
        throw new Error('Tensor returned from `amin` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'amin'
      return t
    },

    amax(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('amax')

      const _ptr = fl._amax.native(this.ptr, axes_ptr, axes_len, !!keep_dims)
      if (!_ptr)
        throw new Error('Tensor returned from `amax` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'amax'
      return t
    },

    argmin(axis: number, keep_dims = false) {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('argmin')

      const _ptr = fl._argmin.native(this.ptr, axis | 0, !!keep_dims)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `argmin` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axis | 0, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'argmin'
      return t
    },

    argmax(axis: number, keep_dims = false) {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('argmax')

      const _ptr = fl._argmax.native(this.ptr, axis | 0, !!keep_dims)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `argmax` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axis | 0, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'argmax'
      return t
    },

    sum(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('sum')

      const _ptr = fl._sum.native(this.ptr, axes_ptr, axes_len, !!keep_dims)
      if (!_ptr)
        throw new Error('Tensor returned from `sum` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'sum'
      return t
    },

    cumsum(axis: number) {
      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('cumsum')

      const _ptr = fl._cumsum.native(this.ptr, axis | 0)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `cumsum` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axis | 0] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'cumsum'
      return t
    },

    mean(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('mean')

      const _ptr = fl._mean.native(this.ptr, axes_ptr, axes_len, !!keep_dims)
      if (!_ptr)
        throw new Error('Tensor returned from `mean` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'mean'
      return t
    },

    median(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('median')

      const _ptr = fl._median.native(this.ptr, axes_ptr, axes_len, !!keep_dims)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `median` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'median'
      return t
    },

    _var(axes: BigInt64Array | number[] = [], bias = false, keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('var')

      const _ptr = fl._var.native(this.ptr, axes_ptr, axes_len, !!bias, !!keep_dims)
      if (!_ptr)
        throw new Error('Tensor returned from `_var` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes, !!bias, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'var'
      return t
    },

    variance(axes: BigInt64Array | number[] = [], bias = false, keep_dims = false) {
      return this._var(axes, bias, keep_dims)
    },

    std(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('std')

      const _ptr = fl._std.native(this.ptr, axes_ptr, axes_len, !!keep_dims)
      if (!_ptr)
        throw new Error('Tensor returned from `std` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'std'
      return t
    },

    norm(axes: BigInt64Array | number[] = [], p = 2, keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('norm')

      const _ptr = fl._norm.native(
        this.ptr,
        axes_ptr,
        axes_len,
        p + 0.00000000000001 - 0.00000000000001,
        !!keep_dims
      )
      if (!_ptr)
        throw new Error('Tensor returned from `norm` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad
        ? [this, axes, p + 0.00000000000001 - 0.00000000000001, !!keep_dims]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'norm'
      return t
    },

    normalize(axes: BigInt64Array | number[] = [], p = 2, keep_dims = false) {
      return this.norm(axes, p, keep_dims)
    },

    countNonzero(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('countNonzero')

      const _ptr = fl._countNonzero.native(this.ptr, axes_ptr, axes_len, !!keep_dims)
      if (!_ptr)
        throw new Error(
          'Tensor returned from `countNonzero` is null; native code likely threw an error...'
        )

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'countNonzero'
      return t
    },

    any(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('any')

      const _ptr = fl._any.native(this.ptr, axes_ptr, axes_len, !!keep_dims)
      if (!_ptr)
        throw new Error('Tensor returned from `any` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'any'
      return t
    },

    all(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes)

      const i = [this]
      const ts = i.reduce((s, t) => s || t.stats, void 0)
      const s = ts || stats
      const trace = s.enabled && s.startTrace('all')

      const _ptr = fl._all.native(this.ptr, axes_ptr, axes_len, !!keep_dims)
      if (!_ptr)
        throw new Error('Tensor returned from `all` is null; native code likely threw an error...')

      trace && s.stopTrace(trace)

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.stats = ts
      t.provenance = this.provenance
      t.requires_grad = requires_grad

      trace && s.logTrace(trace, i, t)

      t.op = 'all'
      return t
    }
  }
}
