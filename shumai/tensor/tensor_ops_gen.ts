/* GENERATED CODE (gen_binding.py) */
import { arrayArg } from '../ffi/ffi_bind_utils'
import { fl } from '../ffi/ffi_flashlight'
import { collectStats, getStack } from './stats'
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
  const [shape_ptr, shape_len] = arrayArg(shape)
  const requires_stats = false

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._rand.native(shape_ptr, shape_len)
  if (!_ptr)
    throw new Error('Tensor returned from `rand` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = false
  const deps = requires_grad ? [shape] : []
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
  const [shape_ptr, shape_len] = arrayArg(shape)
  const requires_stats = false

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._randn.native(shape_ptr, shape_len)
  if (!_ptr)
    throw new Error('Tensor returned from `randn` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = false
  const deps = requires_grad ? [shape] : []
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
  const [shape_ptr, shape_len] = arrayArg(shape)
  const requires_stats = false

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._full.native(shape_ptr, shape_len, Math.fround(val))
  if (!_ptr)
    throw new Error('Tensor returned from `full` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = false
  const deps = requires_grad ? [shape, Math.fround(val)] : []
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._identity.native(dim.constructor === BigInt ? dim : BigInt(dim || 0))
  if (!_ptr)
    throw new Error('Tensor returned from `identity` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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

export function ident(dim: number) {
  return identity(dim)
}

export function eye(dim: number) {
  return identity(dim)
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._arange.native(Math.fround(start), Math.fround(end), Math.fround(step))
  if (!_ptr)
    throw new Error('Tensor returned from `arange` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
  const [dims_ptr, dims_len] = arrayArg(dims)
  const [tileDims_ptr, tileDims_len] = arrayArg(tileDims)
  const requires_stats = false

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._iota.native(dims_ptr, dims_len, tileDims_ptr, tileDims_len)
  if (!_ptr)
    throw new Error('Tensor returned from `iota` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = false
  const deps = requires_grad ? [dims, tileDims] : []
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
  const [shape_ptr, shape_len] = arrayArg(shape)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._reshape.native(tensor.ptr, shape_ptr, shape_len)
  if (!_ptr)
    throw new Error('Tensor returned from `reshape` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, shape] : []
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
  const [axes_ptr, axes_len] = arrayArg(axes)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._transpose.native(tensor.ptr, axes_ptr, axes_len)
  if (!_ptr)
    throw new Error(
      'Tensor returned from `transpose` is null; native code likely threw an error...'
    )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes] : []
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
  const [shape_ptr, shape_len] = arrayArg(shape)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._tile.native(tensor.ptr, shape_ptr, shape_len)
  if (!_ptr)
    throw new Error('Tensor returned from `tile` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, shape] : []
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

export function concatenate(tensors: Array<Tensor>, axis: number) {
  if (axis < 0) {
    for (let i = 0; i < tensors.length; ++i) {
      if (tensors[i].shape.length === 0) {
        tensors[i] = tensors[i].reshape([1])
      }
    }
  }
  const [tensors_ptr, tensors_len] = arrayArg(tensors)
  const requires_stats = tensors.reduce((r, c) => r || c.requires_stats, false)

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._concatenate.native(tensors_ptr, tensors_len, axis | 0)
  if (!_ptr)
    throw new Error(
      'Tensor returned from `concatenate` is null; native code likely threw an error...'
    )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensors.reduce((r, c) => r || c.requires_grad, false)
  const deps = requires_grad ? [...tensors, axis | 0] : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensors.reduce((r, c) => r || c.provenance, 0)
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'concatenate'
  return t
}

export function concat(tensors: Array<Tensor>, axis: number) {
  return concatenate(tensors, axis)
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._nonzero.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `nonzero` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._negative.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `negative` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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

export function negate(tensor: Tensor) {
  return negative(tensor)
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._logicalNot.native(tensor.ptr)
  if (!_ptr)
    throw new Error(
      'Tensor returned from `logicalNot` is null; native code likely threw an error...'
    )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._exp.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `exp` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._log.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `log` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._log1p.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `log1p` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._sin.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `sin` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._cos.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `cos` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._sqrt.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `sqrt` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._tanh.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `tanh` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._floor.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `floor` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._ceil.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `ceil` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._rint.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `rint` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._absolute.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `absolute` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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

export function abs(tensor: Tensor) {
  return absolute(tensor)
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._sigmoid.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `sigmoid` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._erf.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `erf` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._flip.native(
    tensor.ptr,
    dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0
  )
  if (!_ptr)
    throw new Error('Tensor returned from `flip` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._clip.native(tensor.ptr, low.ptr, high.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `clip` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._roll.native(tensor.ptr, shift | 0, axis | 0)
  if (!_ptr)
    throw new Error('Tensor returned from `roll` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._isnan.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `isnan` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._isinf.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `isinf` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._sign.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `sign` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._tril.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `tril` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._triu.native(tensor.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `triu` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._where.native(cond.ptr, x.ptr, y.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `where` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._sort.native(
    tensor.ptr,
    dim <= 0 ? 0 : dim >= 0xffffffff ? 0xffffffff : +dim || 0
  )
  if (!_ptr)
    throw new Error('Tensor returned from `sort` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._add.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `add` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._sub.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `sub` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._mul.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `mul` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._div.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `div` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._eq.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `eq` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._neq.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `neq` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._lessThan.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `lessThan` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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

export function lt(tensor: Tensor, other: Tensor) {
  return lessThan(tensor, other)
}

export function lessThanEqual(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._lessThanEqual.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error(
      'Tensor returned from `lessThanEqual` is null; native code likely threw an error...'
    )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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

export function lte(tensor: Tensor, other: Tensor) {
  return lessThanEqual(tensor, other)
}

export function greaterThan(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._greaterThan.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error(
      'Tensor returned from `greaterThan` is null; native code likely threw an error...'
    )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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

export function gt(tensor: Tensor, other: Tensor) {
  return greaterThan(tensor, other)
}

export function greaterThanEqual(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._greaterThanEqual.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error(
      'Tensor returned from `greaterThanEqual` is null; native code likely threw an error...'
    )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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

export function gte(tensor: Tensor, other: Tensor) {
  return greaterThanEqual(tensor, other)
}

export function logicalOr(tensor: Tensor, other: Tensor) {
  const requires_stats = tensor.requires_stats || other.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, other])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._logicalOr.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error(
      'Tensor returned from `logicalOr` is null; native code likely threw an error...'
    )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._logicalAnd.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error(
      'Tensor returned from `logicalAnd` is null; native code likely threw an error...'
    )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._mod.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `mod` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._bitwiseAnd.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error(
      'Tensor returned from `bitwiseAnd` is null; native code likely threw an error...'
    )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._bitwiseOr.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error(
      'Tensor returned from `bitwiseOr` is null; native code likely threw an error...'
    )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._bitwiseXor.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error(
      'Tensor returned from `bitwiseXor` is null; native code likely threw an error...'
    )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._lShift.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `lShift` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._rShift.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `rShift` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._minimum.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `minimum` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._maximum.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `maximum` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._power.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `power` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._matmul.native(tensor.ptr, other.ptr)
  if (!_ptr)
    throw new Error('Tensor returned from `matmul` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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

export function mm(tensor: Tensor, other: Tensor) {
  return matmul(tensor, other)
}

export function conv2d(
  tensor: Tensor,
  weights: Tensor,
  sx = 1,
  sy = 1,
  px = 0,
  py = 0,
  dx = 1,
  dy = 1,
  groups = 1
) {
  const requires_stats = tensor.requires_stats || weights.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor, weights])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._conv2d.native(
    tensor.ptr,
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
    throw new Error('Tensor returned from `conv2d` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad || weights.requires_grad
  const deps = requires_grad
    ? [tensor, weights, sx | 0, sy | 0, px | 0, py | 0, dx | 0, dy | 0, groups | 0]
    : []
  const t = new Tensor({ _ptr: _ptr, _deps: deps })
  t.provenance = tensor.provenance || weights.provenance
  t.requires_grad = requires_grad
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  t.op = 'conv2d'
  return t
}

export function amin(tensor: Tensor, axes: BigInt64Array | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._amin.native(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  if (!_ptr)
    throw new Error('Tensor returned from `amin` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes, !!keep_dims] : []
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
  const [axes_ptr, axes_len] = arrayArg(axes)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._amax.native(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  if (!_ptr)
    throw new Error('Tensor returned from `amax` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes, !!keep_dims] : []
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._argmin.native(tensor.ptr, axis | 0, !!keep_dims)
  if (!_ptr)
    throw new Error('Tensor returned from `argmin` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._argmax.native(tensor.ptr, axis | 0, !!keep_dims)
  if (!_ptr)
    throw new Error('Tensor returned from `argmax` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
  const [axes_ptr, axes_len] = arrayArg(axes)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._sum.native(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  if (!_ptr)
    throw new Error('Tensor returned from `sum` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes, !!keep_dims] : []
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
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._cumsum.native(tensor.ptr, axis | 0)
  if (!_ptr)
    throw new Error('Tensor returned from `cumsum` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
  const [axes_ptr, axes_len] = arrayArg(axes)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._mean.native(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  if (!_ptr)
    throw new Error('Tensor returned from `mean` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes, !!keep_dims] : []
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
  const [axes_ptr, axes_len] = arrayArg(axes)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._median.native(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  if (!_ptr)
    throw new Error('Tensor returned from `median` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes, !!keep_dims] : []
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
  const [axes_ptr, axes_len] = arrayArg(axes)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._var.native(tensor.ptr, axes_ptr, axes_len, !!bias, !!keep_dims)
  if (!_ptr)
    throw new Error('Tensor returned from `_var` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes, !!bias, !!keep_dims] : []
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

export function variance(
  tensor: Tensor,
  axes: BigInt64Array | number[] = [],
  bias = false,
  keep_dims = false
) {
  return _var(tensor, axes, bias, keep_dims)
}

export function std(tensor: Tensor, axes: BigInt64Array | number[] = [], keep_dims = false) {
  const [axes_ptr, axes_len] = arrayArg(axes)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._std.native(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  if (!_ptr)
    throw new Error('Tensor returned from `std` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes, !!keep_dims] : []
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
  const [axes_ptr, axes_len] = arrayArg(axes)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._norm.native(
    tensor.ptr,
    axes_ptr,
    axes_len,
    p + 0.00000000000001 - 0.00000000000001,
    !!keep_dims
  )
  if (!_ptr)
    throw new Error('Tensor returned from `norm` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
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
    ? [tensor, axes, p + 0.00000000000001 - 0.00000000000001, !!keep_dims]
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

export function normalize(
  tensor: Tensor,
  axes: BigInt64Array | number[] = [],
  p = 2,
  keep_dims = false
) {
  return norm(tensor, axes, p, keep_dims)
}

export function countNonzero(
  tensor: Tensor,
  axes: BigInt64Array | number[] = [],
  keep_dims = false
) {
  const [axes_ptr, axes_len] = arrayArg(axes)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._countNonzero.native(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  if (!_ptr)
    throw new Error(
      'Tensor returned from `countNonzero` is null; native code likely threw an error...'
    )

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes, !!keep_dims] : []
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
  const [axes_ptr, axes_len] = arrayArg(axes)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._any.native(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  if (!_ptr)
    throw new Error('Tensor returned from `any` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes, !!keep_dims] : []
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
  const [axes_ptr, axes_len] = arrayArg(axes)
  const requires_stats = tensor.requires_stats

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats([tensor])
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }

  const _ptr = fl._all.native(tensor.ptr, axes_ptr, axes_len, !!keep_dims)
  if (!_ptr)
    throw new Error('Tensor returned from `all` is null; native code likely threw an error...')

  if (requires_stats) {
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {
      stats[s].time += dt
      stats[s].bytes += db
    } else {
      stats[s] = { time: dt, bytes: db }
    }
  }

  const requires_grad = tensor.requires_grad
  const deps = requires_grad ? [tensor, axes, !!keep_dims] : []
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
