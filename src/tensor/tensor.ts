import { ptr, toArrayBuffer, FFIType } from 'bun:ffi'
import { fl } from '../ffi/ffi_flashlight'
import { arrayArg } from '../ffi/ffi_bind_utils'
import { TensorInterface } from './tensor_interface'
import { TensorOpsInterface } from './tensor_ops_interface_gen'
import { full } from './tensor_ops_gen'
import { gen_tensor_op_shim } from './tensor_ops_shim_gen'

fl.init.native()
const gradient_functions: { [key: string]: CallableFunction } = {}

export function wrapFLTensor(closure: CallableFunction, ...args: any[]): Tensor {
  const ptr_args = args.map((x) => {
    if (x.constructor === Tensor) {
      return x.ptr
    }
    return x
  })
  const _ptr = closure(...ptr_args)
  const requires_grad = args.some((x) => x.requires_grad)
  const deps = requires_grad ? args.filter((x) => x.constructor === Tensor) : []
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
function backward(base_t: Tensor, jacobian: Tensor) {
  const t0 = performance.now()
  if (!jacobian) {
    jacobian = full([], 1)
  }
  const t1 = performance.now()
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

  const t2 = performance.now()

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

  const t3 = performance.now()

  const exec_stats = {}
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
      const gt0 = performance.now()
      const g = gradient_functions[t.op](grad_arg)
      const gt1 = performance.now()
      if (!(t.op in exec_stats)) {
        exec_stats[t.op] = [0, 0]
      }
      const [count, tt] = exec_stats[t.op]
      exec_stats[t.op] = [count + 1, tt + (gt1 - gt0)]
      if (dep.grad) {
        dep.grad = dep.grad.add(g)
      } else {
        dep.grad = g
      }
    }
  }
  const t4 = performance.now()
  return [t0, t1, t2, t3, t4, exec_stats]
}

class Tensor {
  underlying: ArrayBuffer
  deps: Array<Tensor> = []
  requires_grad = false
  grad: Tensor = null
  op = 'constant'

  _injest_ptr(_ptr) {
    const numel = Number(fl.elements.native(_ptr))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - overload toArrayBuffer params
    this.underlying = toArrayBuffer(_ptr, 0, numel * 4, fl.genTensorDestroyer.native())
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
      this._injest_ptr(fl.tensorFromBuffer.native(obj.length, ptr(obj)))
      return
    }
    if (obj.constructor === Number) {
      obj = [obj]
    }
    this._injest_ptr(fl.createTensor.native(...arrayArg(obj, FFIType.i64)))
    return
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
    const out = new BigInt64Array(this.ndim)
    if (out.length === 0) {
      return out
    }
    const err = fl.shape.native(this.ptr, ptr(out), out.length)
    if (err != 0) {
      throw "couldn't determine shape"
    }
    const l: number[] = []
    for (const o of out) {
      l.push(Number(o))
    }
    return l
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
}

// Interface extension trick to extend the type definition of Tensor
// to include generated ops added to prototype after def
interface Tensor extends TensorInterface, TensorOpsInterface {}

// Initialize other generated methods on the Tensor obj prototype
for (const [method, closure] of Object.entries(gen_tensor_op_shim(Tensor))) {
  Tensor.prototype[method] = closure
}

function tensor(obj) {
  return new Tensor(obj)
}

function bytesUsed() {
  return fl.bytesUsed.native()
}

const layout = {
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

export { tensor, backward, bytesUsed, layout, gradient_functions, Tensor }
