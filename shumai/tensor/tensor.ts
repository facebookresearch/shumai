import { ptr, toArrayBuffer, FFIType } from 'bun:ffi'
import { fl } from '../ffi/ffi_flashlight'
import { arrayArg } from '../ffi/ffi_bind_utils'
import { TensorOpsInterface } from './tensor_ops_interface_gen'
import { full } from './tensor_ops_gen'
import { gen_tensor_op_shim } from './tensor_ops_shim_gen'
import { getStack, collectStats } from './stats'
import type { OpStats } from '../io'
export { NATIVE_FILE } from '../ffi/ffi_flashlight'

fl.init.native()

export enum dtype {
  Float16 = Number(fl.dtypeFloat16.native()),
  Float32 = Number(fl.dtypeFloat32.native()),
  Float64 = Number(fl.dtypeFloat64.native()),
  BoolInt8 = Number(fl.dtypeBoolInt8.native()),
  Int16 = Number(fl.dtypeInt16.native()),
  Int32 = Number(fl.dtypeInt32.native()),
  Int64 = Number(fl.dtypeInt64.native()),
  BigInt64 = Number(fl.dtypeInt64.native()),
  Uint8 = Number(fl.dtypeUint8.native()),
  Uint16 = Number(fl.dtypeUint16.native()),
  Uint32 = Number(fl.dtypeUint32.native()),
  Uint64 = Number(fl.dtypeUint64.native()),
  BigUint64 = Number(fl.dtypeUint64.native())
}
/** @private */
export const gradient_functions: { [key: string]: CallableFunction } = {}

/** @private */
export function wrapFLTensor(closure: CallableFunction, ...args: unknown[]): Tensor {
  const ptr_args = args.map((x) => {
    if (x instanceof Tensor) {
      return x.ptr
    }
    return x
  })

  const requires_stats = args.some((x) => (x as Tensor).requires_stats)

  let stats = null
  let recorded_stat = null
  if (requires_stats) {
    stats = collectStats(<Tensor[]>args.filter((arg) => arg instanceof Tensor))
  }
  if (requires_stats) {
    recorded_stat = [performance.now(), fl.bytesUsed()]
  }

  const _ptr = closure(...ptr_args)

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

  const requires_grad = args.some((x) => (x as Tensor).requires_grad)
  const deps: Tensor[] = requires_grad ? <Tensor[]>args.filter((x) => x instanceof Tensor) : []
  if (!_ptr)
    throw new Error(`Tensor returned from closure is null; native code likely threw an error...`)
  const t = new Tensor({
    _ptr: _ptr,
    _deps: deps
  })
  t.requires_grad = requires_grad

  t.provenance = args.reduce(
    (a, b) => (a ? (a as Tensor).provenance : null) || (b ? (b as Tensor).provenance : null),
    null
  )
  if (requires_stats) {
    t.requires_stats = true
    t.stats = stats
  }
  return t
}

export function scalar(s: number): Tensor {
  return full([], s)
}

function traverse_gradients(sorted_traversal, jacobian) {
  const all_grads_dict: Record<number, [Tensor, Tensor]> = {}
  const base_t = sorted_traversal[0]
  all_grads_dict[base_t.ptr] = [base_t, jacobian]
  for (const t of sorted_traversal) {
    if (t.requires_grad && !all_grads_dict[t.ptr]) {
      throw `Cannot run backward pass through ${t.op}. The gradient fed into it is null!`
    }
    if (t.deps.length && !gradient_functions[t.op]) {
      throw `Cannot differentiate ${t.op}. The gradient function is not defined!`
    }
    let idx = -1
    for (const dep of t.deps) {
      idx++
      if (!dep.requires_grad) {
        continue
      }
      const grad_arg = {
        idx: idx,
        in: t.deps,
        out: t,
        grad_in: all_grads_dict[t.ptr][1]
      }
      const g = gradient_functions[t.op](grad_arg)
      if (dep.ptr in all_grads_dict) {
        const [t, prev_g] = all_grads_dict[dep.ptr]
        all_grads_dict[dep.ptr] = [t, prev_g.add(g)]
      } else {
        all_grads_dict[dep.ptr] = [dep, g]
      }
    }
  }
  return all_grads_dict
}

async function async_traverse_gradients(sorted_traversal, jacobian) {
  const all_grads_dict: Record<number, [Tensor, Tensor]> = {}
  const base_t = sorted_traversal[0]
  all_grads_dict[base_t.ptr] = [base_t, jacobian]
  for (const t of sorted_traversal) {
    if (t.requires_grad && !all_grads_dict[t.ptr]) {
      throw `Cannot run backward pass through ${t.op}. The gradient fed into it is null!`
    }
    if (t.deps.length && !gradient_functions[t.op] && !t.grad_callback_async) {
      throw `Cannot differentiate ${t.op}. The gradient function is not defined!`
    }
    let idx = -1
    for (const dep of t.deps) {
      idx++
      if (!dep.requires_grad) {
        continue
      }
      const grad_arg = {
        idx: idx,
        in: t.deps,
        out: t,
        grad_in: all_grads_dict[t.ptr][1]
      }
      let g
      if (t.grad_callback_async) {
        g = await t.grad_callback_async(grad_arg)
      } else {
        g = gradient_functions[t.op](grad_arg)
      }
      if (dep.ptr in all_grads_dict) {
        const [t, prev_g] = all_grads_dict[dep.ptr]
        all_grads_dict[dep.ptr] = [t, prev_g.add(g)]
      } else {
        all_grads_dict[dep.ptr] = [dep, g]
      }
    }
  }
  return all_grads_dict
}

// differentiate t with respect to all
// dependencies with requires_grad === True
export function backward(base_t: Tensor, jacobian: Tensor) {
  if (!jacobian) {
    jacobian = full([], 1)
    jacobian.requires_stats = base_t.requires_stats
  }
  let frontier: Tensor[] = [base_t]
  const incoming_count: Record<number, number> = {}
  incoming_count[base_t.ptr] = 0
  while (frontier.length) {
    const new_frontier: Tensor[] = []
    for (const t of frontier) {
      for (const dep of t.deps) {
        if (!dep.requires_grad) {
          continue
        }
        if (dep.ptr in incoming_count) {
          incoming_count[dep.ptr]++
        } else {
          incoming_count[dep.ptr] = 1
          new_frontier.push(dep)
        }
      }
    }
    frontier = new_frontier
  }

  frontier = [base_t]
  const sorted_traversal = [base_t]
  let need_async = false
  while (frontier.length) {
    const new_frontier: Tensor[] = []
    for (const t of frontier) {
      for (const dep of t.deps) {
        if (--incoming_count[dep.ptr] === 0) {
          new_frontier.push(dep)
          if (dep.requires_grad && dep.deps.length) {
            if (dep.grad_callback_async) {
              need_async = true
            }
            sorted_traversal.push(dep)
          }
        }
      }
    }
    frontier = new_frontier
  }

  // NB: can't easily embed this in the traverse functions
  // (or else references are stale)
  const calc_grads = (all_grads_dict) => {
    const all_grads: Record<string, { grad: Tensor; tensor: Tensor }> = {}
    for (const key in all_grads_dict) {
      const [t, g] = all_grads_dict[key]
      // NB: not really safe in parallel, but convenient for stateful API
      t.grad = g
      all_grads[t] = {
        tensor: t,
        grad: g
      }
    }
    return all_grads
  }

  if (need_async) {
    return (async () => {
      return calc_grads(await async_traverse_gradients(sorted_traversal, jacobian))
    })()
  }

  return calc_grads(traverse_gradients(sorted_traversal, jacobian))
}

export class Tensor {
  underlying: ArrayBuffer
  deps: Array<Tensor> = []
  requires_grad = false
  requires_stats = false
  stats: OpStats = null
  provenance = null
  grad: Tensor = null
  op = 'constant'

  grad_callback_async?: (grad?: any) => Promise<void | Tensor>

  /** @private */
  _injest_ptr(_ptr) {
    this.underlying = toArrayBuffer(
      _ptr,
      0,
      Number(fl._bytes.native(_ptr)),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - overload toArrayBuffer params
      fl.genTensorDestroyer.native()
    )
  }

  backward(jacobian?: Tensor) {
    return backward(this, jacobian)
  }

  // obj is any of {number, Float32Array} (private construction has other options)
  constructor(obj) {
    if (obj.constructor === Tensor) {
      this.underlying = obj.underlying
      this.deps = obj.deps
      this.requires_grad = obj.requires_grad
      this.requires_stats = obj.requires_stats
      this.stats = obj.stats
      this.grad = obj.grad
      this.op = obj.op
      return
    }
    if (obj.hasOwnProperty('_ptr')) {
      this._injest_ptr(obj._ptr)
      this.deps = obj._deps
      return
    }
    if (typeof obj === 'string') {
      this._injest_ptr(fl.load(new TextEncoder().encode(obj)))
      return
    }
    if (obj.constructor === Float32Array) {
      const len_ = obj.length
      const len = len_.constructor === BigInt ? len_ : BigInt(len_ || 0)
      this._injest_ptr(fl.tensorFromFloat32Buffer.native(len, ptr(obj)))
      return
    }
    if (obj.constructor === Float64Array) {
      const len_ = obj.length
      const len = len_.constructor === BigInt ? len_ : BigInt(len_ || 0)
      this._injest_ptr(fl.tensorFromFloat64Buffer.native(len, ptr(obj)))
      return
    }
    if (obj.constructor === Int8Array) {
      const len_ = obj.length
      const len = len_.constructor === BigInt ? len_ : BigInt(len_ || 0)
      this._injest_ptr(fl.tensorFromInt8Buffer.native(len, ptr(obj)))
      return
    }
    if (obj.constructor === Int16Array) {
      const len_ = obj.length
      const len = len_.constructor === BigInt ? len_ : BigInt(len_ || 0)
      this._injest_ptr(fl.tensorFromInt16Buffer.native(len, ptr(obj)))
      return
    }
    if (obj.constructor === Int32Array) {
      const len_ = obj.length
      const len = len_.constructor === BigInt ? len_ : BigInt(len_ || 0)
      this._injest_ptr(fl.tensorFromInt32Buffer.native(len, ptr(obj)))
      return
    }
    if (obj.constructor === BigInt64Array) {
      const len_ = obj.length
      const len = len_.constructor === BigInt ? len_ : BigInt(len_ || 0)
      this._injest_ptr(fl.tensorFromInt64Buffer.native(len, ptr(obj)))
      return
    }
    if (obj.constructor === Uint8Array) {
      const len_ = obj.length
      const len = len_.constructor === BigInt ? len_ : BigInt(len_ || 0)
      this._injest_ptr(fl.tensorFromUint8Buffer.native(len, ptr(obj)))
      return
    }
    if (obj.constructor === Uint16Array) {
      const len_ = obj.length
      const len = len_.constructor === BigInt ? len_ : BigInt(len_ || 0)
      this._injest_ptr(fl.tensorFromUint16Buffer.native(len, ptr(obj)))
      return
    }
    if (obj.constructor === Uint32Array) {
      const len_ = obj.length
      const len = len_.constructor === BigInt ? len_ : BigInt(len_ || 0)
      this._injest_ptr(fl.tensorFromUint32Buffer.native(len, ptr(obj)))
      return
    }
    if (obj.constructor === BigUint64Array) {
      const len_ = obj.length
      const len = len_.constructor === BigInt ? len_ : BigInt(len_ || 0)
      this._injest_ptr(fl.tensorFromUint64Buffer.native(len, ptr(obj)))
      return
    }

    if (typeof obj === 'number') {
      obj = [obj]
    }
    this._injest_ptr(fl.createTensor.native(...arrayArg(obj, FFIType.i64)))
    return
  }

  update(tensor: Tensor) {
    this.underlying = tensor.underlying
    this.deps = tensor.deps
    this.eval()
    // TODO do this only when necessary from C++
    if (fl.bytesUsed() > 10e6 /* 10MB */) {
      Bun.gc(true)
    }
  }

  save(filename) {
    return fl._save(this.ptr, new TextEncoder().encode(filename))
  }

  astype(dtype: dtype) {
    return wrapFLTensor(fl._astype, this.ptr, dtype)
  }

  eval() {
    return fl._eval.native(this.ptr)
  }

  get ptr() {
    return ptr(this.underlying)
  }

  get ndim() {
    return Number(fl._ndim.native(this.ptr))
  }

  get dtype() {
    return Number(fl._dtype.native(this.ptr))
  }

  get shape() {
    const out64 = this.shape64
    const out: number[] = []
    for (const o of out64) {
      out.push(Number(o))
    }
    return out
  }

  get shape64() {
    const out = new BigInt64Array(this.ndim)
    if (out.length === 0) {
      return out
    }
    const err = fl._shape.native(this.ptr, ptr(out), out.length)
    if (err != 0) {
      throw "couldn't determine shape"
    }
    return out
  }

  toString() {
    return `Tensor[id=${this.ptr}]`
  }

  valueOf() {
    if (this.elements == 1) {
      return this.toFloat32()
    }
    return this.toFloat32Array()
  }

  asContiguousTensor() {
    return wrapFLTensor(fl._asContiguousTensor.native, this.ptr)
  }

  copy() {
    return new Tensor(this)
  }

  deepCopy() {
    return wrapFLTensor(fl._copy.native, this.ptr)
  }

  pad(paddings: Array<Array<number>>) {
    const before_ = paddings.map((x) => {
      return BigInt(x[0])
    })
    const after_ = paddings.map((x) => {
      return BigInt(x[1])
    })
    return wrapFLTensor(
      fl._pad.native,
      this.ptr,
      ...arrayArg(new BigInt64Array(before_), FFIType.i64),
      ...arrayArg(new BigInt64Array(after_), FFIType.i64)
    )
  }

  requireGrad() {
    const t = this.copy()
    t.requires_grad = true
    return t
  }

  detach() {
    const t = this.copy()
    t.requires_grad = false
    t.grad = null
    t.deps = []
    return t
  }

  get elements() {
    return Number(fl._elements.native(this.ptr))
  }

  /* TODO: https://github.com/facebookresearch/shumai/issues/54
    toFloat16Array() {
      const contig = this.asContiguousTensor()
      const elems = contig.elements
      return new Float32Array(toArrayBuffer(fl._float16Buffer.native(contig.ptr), 0, elems * 2))
    }
  */

  toFloat32Array() {
    const contig = this.asContiguousTensor()
    const elems = contig.elements
    return new Float32Array(toArrayBuffer(fl._float32Buffer.native(contig.ptr), 0, elems * 4))
  }

  toFloat64Array() {
    const contig = this.asContiguousTensor()
    const elems = contig.elements
    return new Float64Array(toArrayBuffer(fl._float64Buffer.native(contig.ptr), 0, elems * 8))
  }

  toInt16Array() {
    const contig = this.asContiguousTensor()
    const elems = contig.elements
    return new Int16Array(toArrayBuffer(fl._int16Buffer.native(contig.ptr), 0, elems * 2))
  }

  toInt32Array() {
    const contig = this.asContiguousTensor()
    const elems = contig.elements
    return new Int32Array(toArrayBuffer(fl._int32Buffer.native(contig.ptr), 0, elems * 4))
  }

  toBigInt64Array() {
    const contig = this.asContiguousTensor()
    const elems = contig.elements
    return new BigInt64Array(toArrayBuffer(fl._int64Buffer.native(contig.ptr), 0, elems * 8))
  }

  toUint8Array() {
    const contig = this.asContiguousTensor()
    const elems = contig.elements
    return new Uint8Array(toArrayBuffer(fl._uint8Buffer.native(contig.ptr), 0, elems))
  }

  toUint16Array() {
    const contig = this.asContiguousTensor()
    const elems = contig.elements
    return new Uint16Array(toArrayBuffer(fl._uint16Buffer.native(contig.ptr), 0, elems * 2))
  }

  toUint32Array() {
    const contig = this.asContiguousTensor()
    const elems = contig.elements
    return new Uint32Array(toArrayBuffer(fl._uint32Buffer.native(contig.ptr), 0, elems * 4))
  }

  toBigUint64Array() {
    const contig = this.asContiguousTensor()
    const elems = contig.elements
    return new BigUint64Array(toArrayBuffer(fl._uint64Buffer.native(contig.ptr), 0, elems * 8))
  }

  toFloat32(): number {
    return fl._scalar.native(this.ptr)
  }

  /** @private */
  _index_args(args) {
    if (this.ndim !== args.length) {
      throw `Must specify index for every dimension! (expected ${this.ndim}, got ${args.length}`
    }
    const start = []
    const end = []
    const stride = []
    for (const arg of args) {
      if (typeof arg === 'string') {
        const tokens = arg.split(':').map((x, i) => x.trim())
        let start_idx = -1
        let end_idx = -1
        if (tokens.length >= 1) {
          if (tokens[0] !== '' || tokens.length === 1) {
            start_idx = parseInt(tokens[0]) // When length === 1, '' is parsed to NaN
            end_idx = start_idx + 1
          }
        }
        if (tokens.length >= 2) {
          if (tokens[1] === '') {
            end_idx = -1
          } else {
            end_idx = parseInt(tokens[1])
          }
        }
        if (tokens.length >= 3 || start_idx === NaN || end_idx === NaN) {
          throw `${arg} not yet supported.  Please file a bug with desired behavior!`
        }
        start.push(start_idx)
        end.push(end_idx)
      } else if (typeof arg === 'number') {
        start.push(arg)
        end.push(arg + 1)
      } else {
        throw `${arg} not yet supported.  Please file a bug with desired behavior!`
      }
    }
    return [start, end, stride]
  }

  index(args) {
    const [start, end, stride] = this._index_args(args)
    return wrapFLTensor(
      fl._index.native,
      this,
      ...arrayArg(start, FFIType.i64),
      ...arrayArg(end, FFIType.i64),
      ...arrayArg(stride, FFIType.i64)
    )
  }

  indexedAssign(t, args) {
    const [start, end, stride] = this._index_args(args)
    return wrapFLTensor(
      fl._indexedAssign.native,
      this,
      t,
      ...arrayArg(start, FFIType.i64),
      ...arrayArg(end, FFIType.i64),
      ...arrayArg(stride, FFIType.i64)
    )
  }
}

// Interface extension trick to extend the type definition of Tensor
// to include generated ops added to prototype after def
export interface Tensor extends TensorOpsInterface { } // eslint-disable-line

// Initialize other generated methods on the Tensor obj prototype
for (const [method, closure] of Object.entries(gen_tensor_op_shim(Tensor))) {
  Tensor.prototype[method] = closure
}

export function tensor(obj) {
  return new Tensor(obj)
}

/**
 * @returns The current number of bytes allocated and managed by Shumai.
 */
export function bytesUsed(): bigint {
  return fl.bytesUsed.native()
}

export const conv2dBackwardData = (...args) => {
  return wrapFLTensor(fl._conv2dBackwardData.native, ...args)
}

export const layout = {
  /** Set the framework layout to be row major (default). */
  setRowMajor: () => {
    fl.setRowMajor.native()
  },
  /** Set the framework layout to be column major. */
  setColMajor: () => {
    fl.setColMajor.native()
  },
  /** Return true if the framework is currently row major. */
  isRowMajor: (): boolean => {
    return fl.isRowMajor.native()
  },
  /** Return true if the framework is currently column major. */
  isColMajor: (): boolean => {
    return !fl.isRowMajor.native()
  }
}
