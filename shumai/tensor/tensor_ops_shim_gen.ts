/* GENERATED CODE (gen_binding.py) */
import { FFIType } from 'bun:ffi'
import { arrayArg } from '../ffi/ffi_bind_utils'
import { fl } from '../ffi/ffi_flashlight'
import { getStack, collectStats } from './stats'
import type { Tensor } from './tensor'

export const gen_tensor_op_shim = (_Tensor: new (...args: unknown[]) => Tensor) => {
  return {
    reshape(shape: BigInt64Array | number[]) {
      const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._reshape(this.ptr, shape_ptr, shape_len)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, shape_ptr, shape_len] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'reshape'
      return t
    },

    transpose(axes: BigInt64Array | number[]) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._transpose(this.ptr, axes_ptr, axes_len)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'transpose'
      return t
    },

    tile(shape: BigInt64Array | number[]) {
      const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._tile(this.ptr, shape_ptr, shape_len)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, shape_ptr, shape_len] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'tile'
      return t
    },

    nonzero() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._nonzero(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'nonzero'
      return t
    },

    negative() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._negative(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'negative'
      return t
    },

    logicalNot() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._logicalNot(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'logicalNot'
      return t
    },

    exp() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._exp(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'exp'
      return t
    },

    log() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._log(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'log'
      return t
    },

    log1p() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._log1p(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'log1p'
      return t
    },

    sin() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._sin(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'sin'
      return t
    },

    cos() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._cos(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'cos'
      return t
    },

    sqrt() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._sqrt(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'sqrt'
      return t
    },

    tanh() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._tanh(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'tanh'
      return t
    },

    floor() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._floor(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'floor'
      return t
    },

    ceil() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._ceil(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'ceil'
      return t
    },

    rint() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._rint(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'rint'
      return t
    },

    absolute() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._absolute(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'absolute'
      return t
    },

    abs() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._abs(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'abs'
      return t
    },

    sigmoid() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._sigmoid(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'sigmoid'
      return t
    },

    erf() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._erf(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'erf'
      return t
    },

    flip(dim: number) {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._flip(this.ptr, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad
        ? [this, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'flip'
      return t
    },

    clip(low: Tensor, high: Tensor) {
      const requires_stats = this.requires_stats || low.requires_stats || high.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, low, high])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._clip(this.ptr, low.ptr, high.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || low.requires_grad || high.requires_grad
      const deps = requires_grad ? [this, low, high] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'clip'
      return t
    },

    roll(shift: number, axis: number) {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._roll(this.ptr, shift | 0, axis | 0)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, shift | 0, axis | 0] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'roll'
      return t
    },

    isnan() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._isnan(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'isnan'
      return t
    },

    isinf() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._isinf(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'isinf'
      return t
    },

    sign() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._sign(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'sign'
      return t
    },

    tril() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._tril(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'tril'
      return t
    },

    triu() {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._triu(this.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'triu'
      return t
    },

    where(x: Tensor, y: Tensor) {
      const requires_stats = this.requires_stats || x.requires_stats || y.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, x, y])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._where(this.ptr, x.ptr, y.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || x.requires_grad || y.requires_grad
      const deps = requires_grad ? [this, x, y] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'where'
      return t
    },

    sort(dim: number) {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._sort(this.ptr, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad
        ? [this, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'sort'
      return t
    },

    add(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._add(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'add'
      return t
    },

    sub(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._sub(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'sub'
      return t
    },

    mul(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._mul(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'mul'
      return t
    },

    div(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._div(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'div'
      return t
    },

    eq(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._eq(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'eq'
      return t
    },

    neq(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._neq(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'neq'
      return t
    },

    lessThan(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._lessThan(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'lessThan'
      return t
    },

    lessThanEqual(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._lessThanEqual(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'lessThanEqual'
      return t
    },

    greaterThan(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._greaterThan(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'greaterThan'
      return t
    },

    greaterThanEqual(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._greaterThanEqual(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'greaterThanEqual'
      return t
    },

    logicalOr(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._logicalOr(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'logicalOr'
      return t
    },

    logicalAnd(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._logicalAnd(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'logicalAnd'
      return t
    },

    mod(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._mod(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'mod'
      return t
    },

    bitwiseAnd(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._bitwiseAnd(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'bitwiseAnd'
      return t
    },

    bitwiseOr(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._bitwiseOr(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'bitwiseOr'
      return t
    },

    bitwiseXor(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._bitwiseXor(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'bitwiseXor'
      return t
    },

    lShift(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._lShift(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'lShift'
      return t
    },

    rShift(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._rShift(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'rShift'
      return t
    },

    minimum(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._minimum(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'minimum'
      return t
    },

    maximum(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._maximum(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'maximum'
      return t
    },

    power(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._power(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'power'
      return t
    },

    matmul(tensor: Tensor) {
      const requires_stats = this.requires_stats || tensor.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this, tensor])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._matmul(this.ptr, tensor.ptr)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad || tensor.requires_grad
      const deps = requires_grad ? [this, tensor] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'matmul'
      return t
    },

    amin(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._amin(this.ptr, axes_ptr, axes_len, !!keep_dims)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'amin'
      return t
    },

    amax(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._amax(this.ptr, axes_ptr, axes_len, !!keep_dims)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'amax'
      return t
    },

    argmin(axis: number, keep_dims = false) {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._argmin(this.ptr, axis | 0, !!keep_dims)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axis | 0, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'argmin'
      return t
    },

    argmax(axis: number, keep_dims = false) {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._argmax(this.ptr, axis | 0, !!keep_dims)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axis | 0, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'argmax'
      return t
    },

    sum(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._sum(this.ptr, axes_ptr, axes_len, !!keep_dims)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'sum'
      return t
    },

    cumsum(axis: number) {
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._cumsum(this.ptr, axis | 0)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axis | 0] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'cumsum'
      return t
    },

    mean(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._mean(this.ptr, axes_ptr, axes_len, !!keep_dims)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'mean'
      return t
    },

    median(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._median(this.ptr, axes_ptr, axes_len, !!keep_dims)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'median'
      return t
    },

    _var(axes: BigInt64Array | number[] = [], bias = false, keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._var(this.ptr, axes_ptr, axes_len, !!bias, !!keep_dims)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!bias, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'var'
      return t
    },

    std(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._std(this.ptr, axes_ptr, axes_len, !!keep_dims)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'std'
      return t
    },

    norm(axes: BigInt64Array | number[] = [], p = 2, keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._norm(
        this.ptr,
        axes_ptr,
        axes_len,
        p + 0.00000000000001 - 0.00000000000001,
        !!keep_dims
      )

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad
        ? [this, axes_ptr, axes_len, p + 0.00000000000001 - 0.00000000000001, !!keep_dims]
        : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'norm'
      return t
    },

    countNonzero(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._countNonzero(this.ptr, axes_ptr, axes_len, !!keep_dims)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'countNonzero'
      return t
    },

    any(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._any(this.ptr, axes_ptr, axes_len, !!keep_dims)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'any'
      return t
    },

    all(axes: BigInt64Array | number[] = [], keep_dims = false) {
      const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
      const requires_stats = this.requires_stats

      let stats = null
      let recorded_stat = null
      if (requires_stats) {
        stats = collectStats([this])
      }
      if (requires_stats) {
        recorded_stat = [performance.now(), fl.bytesUsed()]
      }

      const _ptr = fl._all(this.ptr, axes_ptr, axes_len, !!keep_dims)

      if (requires_stats) {
        const [t0, b0] = recorded_stat
        const dt = performance.now() - t0
        const db = fl.bytesUsed() - b0
        const s = getStack().slice(1)[0]
        if (s in stats) {
          stats[s].time += dt
          stats[s].bytes += db
        } else {
          stats[s] = { time: dt, bytes: db }
        }
      }

      const requires_grad = this.requires_grad
      const deps = requires_grad ? [this, axes_ptr, axes_len, !!keep_dims] : []
      const t = new _Tensor({ _ptr: _ptr, _deps: deps })
      t.requires_grad = requires_grad
      if (requires_stats) {
        t.requires_stats = true
        t.stats = stats
      }
      t.op = 'all'
      return t
    }
  }
}
