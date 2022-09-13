import { ptr, toArrayBuffer, FFIType } from 'bun:ffi'
import { fl } from '../ffi/ffi_flashlight'
import { arrayArg } from '../ffi/ffi_bind_utils'
import { TensorInterface } from './tensor_interface'
import { TensorOpsInterface } from './tensor_ops_interface_gen'
import { full } from './tensor_ops_gen'
import { gen_tensor_op_shim } from './tensor_ops_shim_gen'

fl.init.native()
export const gradient_functions: { [key: string]: CallableFunction } = {}

export function wrapFLTensor(closure: CallableFunction, ...args: unknown[]): Tensor {
  const ptr_args = args.map((x) => {
    if (x instanceof Tensor) {
      return x.ptr
    }
    return x
  })
  const _ptr = closure(...ptr_args)
  const requires_grad = args.some((x) => (x as Tensor).requires_grad)
  const deps: Tensor[] = requires_grad ? <Tensor[]>args.filter((x) => x instanceof Tensor) : []
  const t = new Tensor({
    _ptr: _ptr,
    _deps: deps
  })
  t.requires_grad = requires_grad
  return t
}

export function scalar(s: number): Tensor {
  return full([], s)
}

// differentiate t with respect to all
// dependencies with requires_grad === True
export function backward(base_t: Tensor, jacobian: Tensor) {
  if (!jacobian) {
    jacobian = full([], 1)
  }
  const sorted_traversal = [base_t]
  let frontier = [base_t]
  const incoming_count = {}
  incoming_count[base_t.ptr] = 0
  while (frontier.length) {
    const new_frontier = []
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
  while (frontier.length) {
    const new_frontier = []
    for (const t of frontier) {
      for (const dep of t.deps) {
        if (--incoming_count[dep.ptr] === 0) {
          new_frontier.push(dep)
          sorted_traversal.push(dep)
        }
      }
    }
    frontier = new_frontier
  }

  const all_grads_dict = {}
  base_t.grad = jacobian
  for (const t of sorted_traversal) {
    if (!t.requires_grad || t.deps.length === 0) {
      continue
    }
    if (t.requires_grad && !t.grad) {
      throw `Cannot run backward pass through ${t.op}. The gradient fed into it is null!`
    }
    if (!gradient_functions[t.op]) {
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
        grad_in: t.grad
      }
      const g = gradient_functions[t.op](grad_arg)
      if (dep.grad) {
        dep.grad = dep.grad.add(g)
      } else {
        dep.grad = g
      }
      if (!(dep.ptr in all_grads_dict)) {
        all_grads_dict[dep.ptr] = dep
      }
    }
  }
  const all_grads = []
  const grad_callbacks_async = []
  for (const key in all_grads_dict) {
    const t = all_grads_dict[key]
    if (t.grad_callback_async) {
      grad_callbacks_async.push(t.grad_callback_async)
    }
    all_grads.push(t)
  }
  if (grad_callbacks_async.length) {
    return (async () => {
      for (const cb of grad_callbacks_async) {
        await cb()
      }
      return all_grads
    })()
  }
  return all_grads
}

export class Tensor {
  underlying: ArrayBuffer
  deps: Array<Tensor> = []
  requires_grad = false
  grad: Tensor = null
  op = 'constant'

  _injest_ptr(_ptr) {
    this.underlying = toArrayBuffer(
      _ptr,
      0,
      Number(fl.bytes.native(_ptr)),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - overload toArrayBuffer params
      fl.genTensorDestroyer.native()
    )
  }

  backward(jacobian) {
    return backward(this, jacobian)
  }

  // obj is any of {number, Float32Array} (private construction has other options)
  constructor(obj) {
    if (obj._ptr) {
      this._injest_ptr(obj._ptr)
      this.deps = obj._deps
      return
    }
    if (obj.constructor === Float32Array) {
      const len_ = obj.length
      const len = len_.constructor === BigInt ? len_ : BigInt(len_ || 0)
      this._injest_ptr(fl.tensorFromBuffer.native(len, ptr(obj)))
      return
    }
    if (obj.constructor === Number) {
      obj = [obj]
    }
    this._injest_ptr(fl.createTensor.native(...arrayArg(obj, FFIType.i64)))
    return
  }

  update(tensor: Tensor) {
    this.underlying = tensor.underlying
    this.deps = tensor.deps
  }

  eval() {
    return fl.eval.native(this.ptr)
  }

  get ptr() {
    return ptr(this.underlying)
  }

  get ndim() {
    return Number(fl.ndim.native(this.ptr))
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
    const err = fl.shape.native(this.ptr, ptr(out), out.length)
    if (err != 0) {
      throw "couldn't determine shape"
    }
    return out
  }

  toString() {
    if (this.elements == 1) {
      return this.toFloat32().toString()
    }
    return this.toFloat32Array().toString()
  }

  valueOf() {
    if (this.elements == 1) {
      return this.toFloat32()
    }
    return this.toFloat32Array()
  }

  asContiguousTensor() {
    return wrapFLTensor(fl.asContiguousTensor.native, this.ptr)
  }

  copy() {
    return wrapFLTensor(fl.copy.native, this.ptr)
  }

  detach() {
    const tmp_req_grad = this.requires_grad
    this.requires_grad = false
    const t = wrapFLTensor(fl.copy.native, this.ptr)
    this.requires_grad = tmp_req_grad
    return t
  }

  get elements() {
    return Number(fl.elements.native(this.ptr))
  }

  toFloat32Array() {
    const contig = this.asContiguousTensor()
    const elems = contig.elements
    return new Float32Array(toArrayBuffer(fl.buffer.native(contig.ptr), 0, elems * 4))
  }

  toFloat32(): number {
    return fl.scalar.native(this.ptr)
  }

  index_args(args) {
    if (this.ndim !== args.length) {
      throw `Must specify index for every dimension! (expected ${this.ndim}, got ${args.length}`
    }
    const start = []
    const end = []
    const stride = []
    for (const arg of args) {
      if (arg == ':') {
        start.push(-1)
        end.push(-1)
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
    const [start, end, stride] = this.index_args(args)
    return wrapFLTensor(
      fl._index.native,
      this,
      ...arrayArg(start, FFIType.i64),
      ...arrayArg(end, FFIType.i64),
      ...arrayArg(stride, FFIType.i64)
    )
  }

  index_assign(t, args) {
    const [start, end, stride] = this.index_args(args)
    return wrapFLTensor(
      fl._index_assign.native,
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
export interface Tensor extends TensorInterface, TensorOpsInterface {}

// Initialize other generated methods on the Tensor obj prototype
for (const [method, closure] of Object.entries(gen_tensor_op_shim(Tensor))) {
  Tensor.prototype[method] = closure
}

export function tensor(obj) {
  return new Tensor(obj)
}

export function bytesUsed() {
  return fl.bytesUsed.native()
}

export const layout = {
  setRowMajor: () => {
    fl.setRowMajor()
  },
  setColMajor: () => {
    fl.setColMajor()
  },
  isRowMajor: () => {
    return fl.isRowMajor()
  },
  isColMajor: () => {
    return !fl.isRowMajor()
  }
}
