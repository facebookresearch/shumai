/* GENERATED CODE (gen_binding.py) */
import { FFIType } from 'bun:ffi'
import { arrayArg } from '../ffi/ffi_bind_utils'
import { fl } from '../ffi/ffi_flashlight'
import { getStack, collectStats } from './stats'
import { Tensor } from './tensor'

/**
 *
 *   Generate a uniform distribution.
 *
 *   @remarks
 *   For a normal (Gaussian) distribution, see {@link randn}.
 *
 *   @example
 *   ```javascript
 *   // 128x8 uniformly random tensor
 *   const t = sm.rand([128, 8])
 *   ```
 *
 *   @param shape - The shape of the output {@link Tensor}
 *
 *   @returns A new {@link Tensor} of uniformly random values
 */ export function rand(shape: BigInt64Array | number[]) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const requires_stats = false

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._rand(shape_ptr, shape_len)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = false
  const deps = requires_grad ? [shape_ptr, shape_len] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'rand'
  return t
}

/**
 *
 *   Generate a normal (Gaussian) distribution.
 *
 *   @remarks
 *   For a uniform distribution, see {@link rand}.
 *
 *   @example
 *   ```javascript
 *   // 128x8 gaussian tensor
 *   const t = sm.randn([128, 8])
 *   ```
 *
 *   @param shape - The shape of the output {@link Tensor}
 *
 *   @returns A new {@link Tensor} of random values sampled from a Gaussian distribution
 */ export function randn(shape: BigInt64Array | number[]) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const requires_stats = false

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._randn(shape_ptr, shape_len)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = false
  const deps = requires_grad ? [shape_ptr, shape_len] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'randn'
  return t
}

/**
 *
 *   Create a {@link Tensor} filled with a single value.
 *
 *   @example
 *   ```javascript
 *   // 128x8 tensor of all 1s
 *   const t = sm.full([128, 8], 1)
 *   ```
 *
 *   @param shape - The shape of the output {@link Tensor}
 *   @param val - The value used to fill the output
 *
 *   @returns A new {@link Tensor} of a single user specified value.
 */ export function full(shape: BigInt64Array | number[], val: number) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const requires_stats = false

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._full(shape_ptr, shape_len, Math.fround(val))

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = false
  const deps = requires_grad ? [shape_ptr, shape_len, Math.fround(val)] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'full'
  return t
}

/**
 *
 *   Create a square 2D identity {@link Tensor}.
 *
 *   @remarks
 *   This is similar to the `eye` API of other tensor frameworks.
 *
 *   @example
 *   ```javascript
 *   // 128x128 identity tensor
 *   const t = sm.identity(128)
 *   ```
 *
 *   @param dim - The dimension of the output {@link Tensor}
 *
 *   @returns A new identity {@link Tensor}.
 */ export function identity(dim: number) {
  const requires_stats = false

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._identity(dim.constructor === BigInt ? dim : BigInt(dim || 0))

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = false
  const deps = requires_grad ? [dim.constructor === BigInt ? dim : BigInt(dim || 0)] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'identity'
  return t
}

/**
 *
 *   Create a {@link Tensor} of evenly-spaced values in a given interval.
 *
 *   @example
 *   ```javascript
 *   // create a tensor of even values starting with 0: `[0,2,4,8]`
 *   const t = sm.arange(0, 10, 2)
 *   ```
 *
 *   @param start - The start of the interval (inclusive)
 *   @param end - The end of the interval (exclusive)
 *   @param step - An optional argument to stride the interval
 *
 *   @returns A new 1D {@link Tensor} containing the user defined interval.
 */ export function arange(start: number, end: number, step = 1) {
  const requires_stats = false

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._arange(Math.fround(start), Math.fround(end), Math.fround(step))

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = false
  const deps = requires_grad ? [Math.fround(start), Math.fround(end), Math.fround(step)] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'arange'
  return t
}

/**
 *
 *   Tile a {@link Tensor} of N-dimensionally shaped ranges.
 *
 *   @example
 *   ```javascript
 *   const t0 = sm.iota([2, 2], [2])
 *   // same as
 *   const t1 = sm.arange(0, 4).reshape([2, 2]).tile([2])
 *   ```
 *
 *   @param dims - The dimension of the intermediate (untiled tensor). This shape determines the range of the values within the output.
 *   @param tileDims - How to tile the intermediate tensor.
 *   @returns A new {@link Tensor}
 */ export function iota(dims: BigInt64Array | number[], tileDims: BigInt64Array | number[] = [1]) {
  const [dims_ptr, dims_len] = arrayArg(dims, FFIType.i64)
  const [tileDims_ptr, tileDims_len] = arrayArg(tileDims, FFIType.i64)
  const requires_stats = false

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._iota(dims_ptr, dims_len, tileDims_ptr, tileDims_len)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = false
  const deps = requires_grad ? [dims_ptr, dims_len, tileDims_ptr, tileDims_len] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'iota'
  return t
}

/**
 *
 *   Reshape a {@link Tensor} without modifying the underlying data. There is a method version of this static function: {@link Tensor.reshape | Tensor.reshape }.
 *
 *   @remarks
 *   The resultant shape must contain the same number of elements as the base Tensor.
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([64])
 *
 *   // equivalent calls
 *   const a = t.reshape([8, 8])
 *   const b = sm.reshape(t, [8, 8])
 *   ```
 *
 *
 *   @param tensor - {@link Tensor} to reshape
 *   @param shape - The shape of the output {@link Tensor}
 */ export function reshape(tensor: Tensor, shape: BigInt64Array | number[]) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._reshape(tensor.ptr, shape_ptr, shape_len)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, shape_ptr, shape_len] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'reshape'
  return t
}

/**
 *
 *   Re-arrange the layout of the values within a {@link Tensor}. There is a method version of this static function: {@link Tensor.transpose | Tensor.transpose }.
 *
 *   @remarks
 *   The total number of elements of the tensor does not change.
 *
 *   @example
 *   ```javascript
 *   const t = sm.rand([128, 8])
 *
 *   // equivalent calls
 *   const a = t.transpose([1, 0])
 *   a.shape // [8, 128]
 *   const b = sm.transpose(t, [1, 0])
 *   b.shape // [8, 128]
 *   ```
 *
 *   @param tensor - {@link Tensor} to transpose
 *   @param axes - The new order of the indices of the current axes after tranposing
 *   @returns A new {@link Tensor}
 */ export function transpose(tensor: Tensor, axes: BigInt64Array | number[]) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._transpose(tensor.ptr, axes_ptr, axes_len)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'transpose'
  return t
}

/**
 *
 *   Replicate a {@link Tensor} about its axes. There is a method version of this static function: {@link Tensor.tile | Tensor.tile }.
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.identity(4)
 *
 *   // equivalent calls
 *   const a = sm.tile(t, [2, 2])
 *   a.shape // [8, 8]
 *   const b = t.tile([2, 2])
 *   b.shape // [8, 8]
 *
 *   // tiling by 1 on all dims does nothing
 *   const no_op = t.tile([1, 1])
 *   ```
 *
 *   @param tensor - {@link Tensor} to tile
 *   @param shape - A shape describing the number of iterations to tile each axis.
 *   @returns A new {@link Tensor}
 */ export function tile(tensor: Tensor, shape: BigInt64Array | number[]) {
  const [shape_ptr, shape_len] = arrayArg(shape, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._tile(tensor.ptr, shape_ptr, shape_len)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, shape_ptr, shape_len] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'tile'
  return t
}

/**
 *
 *   Determine the indices of elements that are non-zero. There is a method version of this static function: {@link Tensor.nonzero | Tensor.nonzero }.
 *
 *   @remarks
 *
 *   Indices correspond to a flattened version of the input tensor.
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([100])
 *
 *   // equivalent calls
 *   const a = t.nonzero()
 *   const b = sm.nonzero(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will be used to find indices
 *   @returns - A new {@link Tensor} composed of the flattened indices of the non-zero elements in the input
 */ export function nonzero(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._nonzero(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'nonzero'
  return t
}

/**
 *
 *   Negate a tensor. There is a method version of this static function: {@link Tensor.negative | Tensor.negative }.
 *
 *   $$-x : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([100])
 *
 *   // equivalent calls
 *   const a = t.negative()
 *   const b = sm.negative(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will be negated
 *   @returns - A new {@link Tensor}
 */ export function negative(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._negative(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'negative'
  return t
}

/**
 *
 *   Take the logical `not` of every element in a tensor. There is a method version of this static function: {@link Tensor.logicalNot | Tensor.logicalNot }.
 *
 *   $$\neg x : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.rand([100]).greaterThan(sm.scalar(0.5))
 *
 *   // equivalent calls
 *   const a = t.logicalNot()
 *   const b = sm.logicalNot(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will be logically inverted
 *   @returns - A new {@link Tensor}
 */ export function logicalNot(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._logicalNot(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'logicalNot'
  return t
}

/**
 *
 *   Compute the exponential of each element in a tensor. There is a method version of this static function: {@link Tensor.exp | Tensor.exp }.
 *
 *   $$e^x : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([100])
 *
 *   // equivalent calls
 *   const a = t.exp()
 *   const b = sm.exp(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will be exponentiated
 *   @returns - A new {@link Tensor}
 */ export function exp(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._exp(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'exp'
  return t
}

/**
 *
 *   Compute the natural logarithm of each element in a tensor. There is a method version of this static function: {@link Tensor.log | Tensor.log }.
 *
 *   $$\ln(x) : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([100])
 *
 *   // equivalent calls
 *   const a = t.log()
 *   const b = sm.log(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their natural logarithm calculated
 *   @returns - A new {@link Tensor}
 */ export function log(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._log(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'log'
  return t
}

/**
 *
 *   Compute the natural logarithm of one plus each element in a tensor. There is a method version of this static function: {@link Tensor.log1p | Tensor.log1p }.
 *
 *   $$\ln(1 + x) : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([100])
 *
 *   // equivalent calls
 *   const a = t.log1p()
 *   const b = sm.log1p(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have one added before their natural logarithm is calculated
 *   @returns - A new {@link Tensor}
 */ export function log1p(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._log1p(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'log1p'
  return t
}

/**
 *
 *   Compute the sine function each element in a tensor. There is a method version of this static function: {@link Tensor.sin | Tensor.sin }.
 *
 *   $$\sin(x) : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.sin()
 *   const b = sm.sin(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their sine calculated
 *   @returns - A new {@link Tensor}
 */ export function sin(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._sin(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'sin'
  return t
}

/**
 *
 *   Compute the cosine function each element in a tensor. There is a method version of this static function: {@link Tensor.cos | Tensor.cos }.
 *
 *   $$\cos(x) : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.cos()
 *   const b = sm.cos(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their cosine calculated
 *   @returns - A new {@link Tensor}
 */ export function cos(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._cos(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'cos'
  return t
}

/**
 *
 *   Compute the square root of each element in a tensor. There is a method version of this static function: {@link Tensor.sqrt | Tensor.sqrt }.
 *
 *   $$\sqrt x : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.sqrt()
 *   const b = sm.sqrt(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their square root calculated
 *   @returns - A new {@link Tensor}
 */ export function sqrt(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._sqrt(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'sqrt'
  return t
}

/**
 *
 *   Compute the hyperbolic tangent function each element in a tensor. There is a method version of this static function: {@link Tensor.tanh | Tensor.tanh }.
 *
 *   $$\tanh(x) : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.tanh()
 *   const b = sm.tanh(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their hyperbolic tangent calculated
 *   @returns - A new {@link Tensor}
 */ export function tanh(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._tanh(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'tanh'
  return t
}

/**
 *
 *   Compute the mathematical floor (round down) of each element in a tensor. There is a method version of this static function: {@link Tensor.floor | Tensor.floor }.
 *
 *   $$\lfloor x \rfloor : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.floor()
 *   const b = sm.floor(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their mathematical floor calculated
 *   @returns - A new {@link Tensor}
 */ export function floor(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._floor(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'floor'
  return t
}

/**
 *
 *   Compute the mathematical ceiling (round up) of each element in a tensor. There is a method version of this static function: {@link Tensor.ceil | Tensor.ceil }.
 *
 *   $$\lceil x \rceil : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.ceil()
 *   const b = sm.ceil(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their mathematical ceiling calculated
 *   @returns - A new {@link Tensor}
 */ export function ceil(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._ceil(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'ceil'
  return t
}

/**
 *
 *   Round each element in a tensor to the nearest integer. There is a method version of this static function: {@link Tensor.rint | Tensor.rint }.
 *
 *   $$
 *   x =
 *   \begin\{cases\}
 *       \lfloor x \rfloor,& \text\{if \} x - \lfloor x \rfloor \leq \frac\{1\}\{2\}\\\\
 *       \lceil x \rceil,& \text\{otherwise\}
 *   \end\{cases\}
 *   \forall x \in T
 *   $$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.rint()
 *   const b = sm.rint(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will be rounded to the nearest integer
 *   @returns - A new {@link Tensor}
 */ export function rint(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._rint(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'rint'
  return t
}

/**
 *
 *   Calculate the absolute value for every element in a {@link Tensor}. There is a method version of this static function: {@link Tensor.absolute | Tensor.absolute }.
 *
 *   $$|x| : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.absolute()
 *   const b = sm.absolute(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their absolute value calculated
 *   @returns - A new {@link Tensor}
 */ export function absolute(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._absolute(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'absolute'
  return t
}

/**
 *
 *   Calculate the absolute value for every element in a {@link Tensor}. There is a method version of this static function: {@link Tensor.abs | Tensor.abs }.
 *
 *   $$|x| : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.abs()
 *   const b = sm.abs(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their absolute value calculated
 *   @returns - A new {@link Tensor}
 */ export function abs(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._abs(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'abs'
  return t
}

/**
 *
 *   Calculate the sigmoid (logistic function) for each element in a {@link Tensor}. There is a method version of this static function: {@link Tensor.sigmoid | Tensor.sigmoid }.
 *
 *   $$\frac\{1\}\{1 + e^\{-x\}\} : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([1337])
 *
 *   // equivalent calls
 *   const a = t.sigmoid()
 *   const b = sm.sigmoid(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their sigmoid calculated
 *   @returns - A new {@link Tensor}
 */ export function sigmoid(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._sigmoid(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'sigmoid'
  return t
}

/**
 *
 *   Calculate the error function ({@link https://en.wikipedia.org/wiki/Error_function | Wikipedia entry}) for each element in a {@link Tensor}. There is a method version of this static function: {@link Tensor.erf | Tensor.erf }.
 *
 *   $$\frac\{2\}\{\sqrt\{\pi\}\}\int_0^\{x\} e^\{-t^2\} dt : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([1337])
 *
 *   // equivalent calls
 *   const a = t.erf()
 *   const b = sm.erf(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their error function calculated
 *   @returns - A new {@link Tensor}
 */ export function erf(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._erf(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'erf'
  return t
}

export function flip(tensor: Tensor, dim: number) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._flip(tensor.ptr, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad
    ? [tensor, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0]
    : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'flip'
  return t
}

export function clip(tensor: Tensor, low: Tensor, high: Tensor) {
  const requires_stats = tensor.requires_stats || low.requires_stats || high.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, low, high])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._clip(tensor.ptr, low.ptr, high.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || low.requires_grad || high.requires_grad
  const deps = requires_grad ? [tensor, low, high] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || low.provenance || high.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'clip'
  return t
}

export function roll(tensor: Tensor, shift: number, axis: number) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._roll(tensor.ptr, shift | 0, axis | 0)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, shift | 0, axis | 0] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'roll'
  return t
}

export function isnan(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._isnan(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'isnan'
  return t
}

export function isinf(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._isinf(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'isinf'
  return t
}

export function sign(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._sign(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'sign'
  return t
}

export function tril(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._tril(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'tril'
  return t
}

export function triu(tensor: Tensor) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._triu(tensor.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'triu'
  return t
}

export function where(cond: Tensor, x: Tensor, y: Tensor) {
  const requires_stats = cond.requires_stats || x.requires_stats || y.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([cond, x, y])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._where(cond.ptr, x.ptr, y.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = cond.requires_grad || x.requires_grad || y.requires_grad
  const deps = requires_grad ? [cond, x, y] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = cond.provenance || x.provenance || y.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'where'
  return t
}

export function sort(tensor: Tensor, dim: number) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._sort(tensor.ptr, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad
    ? [tensor, dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0]
    : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'sort'
  return t
}

export function add(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._add(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'add'
  return t
}

export function sub(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._sub(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'sub'
  return t
}

export function mul(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._mul(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'mul'
  return t
}

export function div(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._div(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'div'
  return t
}

export function eq(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._eq(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'eq'
  return t
}

export function neq(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._neq(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'neq'
  return t
}

export function lessThan(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._lessThan(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'lessThan'
  return t
}

export function lessThanEqual(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._lessThanEqual(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'lessThanEqual'
  return t
}

export function greaterThan(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._greaterThan(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'greaterThan'
  return t
}

export function greaterThanEqual(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._greaterThanEqual(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'greaterThanEqual'
  return t
}

export function logicalOr(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._logicalOr(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'logicalOr'
  return t
}

export function logicalAnd(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._logicalAnd(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'logicalAnd'
  return t
}

export function mod(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._mod(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'mod'
  return t
}

export function bitwiseAnd(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._bitwiseAnd(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'bitwiseAnd'
  return t
}

export function bitwiseOr(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._bitwiseOr(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'bitwiseOr'
  return t
}

export function bitwiseXor(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._bitwiseXor(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'bitwiseXor'
  return t
}

export function lShift(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._lShift(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'lShift'
  return t
}

export function rShift(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._rShift(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'rShift'
  return t
}

export function minimum(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._minimum(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'minimum'
  return t
}

export function maximum(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._maximum(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'maximum'
  return t
}

export function power(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._power(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'power'
  return t
}

export function matmul(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._matmul(tensor.ptr, other.ptr)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || other.requires_grad
  const deps = requires_grad ? [tensor, other] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || other.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'matmul'
  return t
}

export function conv2d(
  tensor: Tensor,
  weights: Tensor,
  bias: Tensor,
  sx: number,
  sy: number,
  px: number,
  py: number,
  dx: number,
  dy: number,
  groups: number
) {
  const requires_stats = tensor.requires_stats || weights.requires_stats || bias.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, weights, bias])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._conv2d(
    tensor.ptr,
    weights.ptr,
    bias.ptr,
    sx | 0,
    sy | 0,
    px | 0,
    py | 0,
    dx | 0,
    dy | 0,
    groups | 0
  )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || weights.requires_grad || bias.requires_grad
  const deps = requires_grad
    ? [tensor, weights, bias, sx | 0, sy | 0, px | 0, py | 0, dx | 0, dy | 0, groups | 0]
    : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || weights.provenance || bias.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'conv2d'
  return t
}

export function amin(tensor: Tensor, axes: BigInt64Array | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._amin(tensor.ptr, axes_ptr, axes_len, !!keep_dims)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'amin'
  return t
}

export function amax(tensor: Tensor, axes: BigInt64Array | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._amax(tensor.ptr, axes_ptr, axes_len, !!keep_dims)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'amax'
  return t
}

export function argmin(tensor: Tensor, axis: number, keep_dims = false) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._argmin(tensor.ptr, axis | 0, !!keep_dims)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axis | 0, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'argmin'
  return t
}

export function argmax(tensor: Tensor, axis: number, keep_dims = false) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._argmax(tensor.ptr, axis | 0, !!keep_dims)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axis | 0, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'argmax'
  return t
}

export function sum(tensor: Tensor, axes: BigInt64Array | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._sum(tensor.ptr, axes_ptr, axes_len, !!keep_dims)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'sum'
  return t
}

export function cumsum(tensor: Tensor, axis: number) {
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._cumsum(tensor.ptr, axis | 0)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axis | 0] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'cumsum'
  return t
}

export function mean(tensor: Tensor, axes: BigInt64Array | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._mean(tensor.ptr, axes_ptr, axes_len, !!keep_dims)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'mean'
  return t
}

export function median(tensor: Tensor, axes: BigInt64Array | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._median(tensor.ptr, axes_ptr, axes_len, !!keep_dims)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'median'
  return t
}

export function _var(
  tensor: Tensor,
  axes: BigInt64Array | number[] = [],
  bias = false,
  keep_dims = false
) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._var(tensor.ptr, axes_ptr, axes_len, !!bias, !!keep_dims)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!bias, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'var'
  return t
}

export function std(tensor: Tensor, axes: BigInt64Array | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._std(tensor.ptr, axes_ptr, axes_len, !!keep_dims)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'std'
  return t
}

export function norm(
  tensor: Tensor,
  axes: BigInt64Array | number[] = [],
  p = 2,
  keep_dims = false
) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._norm(
    tensor.ptr,
    axes_ptr,
    axes_len,
    p + 0.00000000000001 - 0.00000000000001,
    !!keep_dims
  )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad
    ? [tensor, axes_ptr, axes_len, p + 0.00000000000001 - 0.00000000000001, !!keep_dims]
    : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'norm'
  return t
}

export function countNonzero(
  tensor: Tensor,
  axes: BigInt64Array | number[] = [],
  keep_dims = false
) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._countNonzero(tensor.ptr, axes_ptr, axes_len, !!keep_dims)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'countNonzero'
  return t
}

export function any(tensor: Tensor, axes: BigInt64Array | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._any(tensor.ptr, axes_ptr, axes_len, !!keep_dims)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'any'
  return t
}

export function all(tensor: Tensor, axes: BigInt64Array | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes, FFIType.i64)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = fl._all(tensor.ptr, axes_ptr, axes_len, !!keep_dims)

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes_ptr, axes_len, !!keep_dims] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'all'
  return t
}
