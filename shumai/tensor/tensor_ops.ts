import type { Tensor } from './tensor'
import { _var, conv2d, full, scalar, sigmoid } from './tensor_ops_gen'

export * from './tensor_ops_gen'

export function scalar(s: number): Tensor {
  return full([], s)
}

export function softmax(tensor: Tensor, axis: number): Tensor {
  const exp = tensor.sub(tensor.amax([axis], true)).exp()
  return exp.div(exp.sum([axis], true))
}

export function relu(tensor: Tensor): Tensor {
  return tensor.maximum(scalar(0))
}

export function leakyRelu(tensor: Tensor, negative_slope = 1e-3): Tensor {
  const rhs = tensor.maximum(scalar(0))
  const lhs = scalar(negative_slope).mul(tensor.minimum(scalar(0)))
  return rhs.add(lhs)
}

export function swish(tensor: Tensor, beta = 1e-3): Tensor {
  return tensor.mul(sigmoid(scalar(beta).mul(tensor)))
}

export function elu(tensor: Tensor, alpha = 1): Tensor {
  const mask = tensor.gte(scalar(0))
  const notMask = mask.logicalNot()
  return mask.mul(tensor).add(notMask.mul(scalar(alpha)).mul(tensor.exp().sub(scalar(1))))
}

export function thresholdRelu(tensor: Tensor, threshold = 1): Tensor {
  const mask = tensor.gte(scalar(threshold))
  return tensor.mul(mask)
}

export function clamp(tensor: Tensor, low: number, high: number): Tensor {
  return tensor.clip(full(tensor.shape, low), full(tensor.shape, high))
}

export function relu6(tensor: Tensor): Tensor {
  return clamp(tensor, 0.0, 6.0)
}

export function hardTanh(tensor: Tensor): Tensor {
  return clamp(tensor, -1.0, 1.0)
}

const geluConst = 1 / Math.sqrt(2)
export function gelu(tensor: Tensor): Tensor {
  // https://arxiv.org/pdf/1606.08415.pdf
  return tensor.mul(scalar(0.5)).mul(
    scalar(1.0)
      .add(tensor.mul(scalar(geluConst)))
      .erf()
  )
}

export function avgPool2d(tensor: Tensor, kx: number, ky: number, sx = 1, sy = 1): Tensor {
  const w = full([1, 1, kx, ky], 1)
  return conv2d(tensor, w, sx, sy).div(scalar(kx * ky))
}

export function unsqueeze(tensor: Tensor, axis: number): Tensor {
  if (axis < 0) {
    axis += tensor.shape.length + 1
  }
  const new_shape = []
  for (let i = 0; i < tensor.shape.length; ++i) {
    if (i === axis) {
      new_shape.push(1)
    }
    new_shape.push(tensor.shape[i])
  }
  if (axis === tensor.shape.length) {
    new_shape.push(1)
  }
  return tensor.reshape(new_shape)
}

export function squeeze(tensor: Tensor, axis?: number): Tensor {
  if (axis !== undefined && axis < 0) {
    axis += tensor.shape.length
  }
  const new_shape = []
  for (let i = 0; i < tensor.shape.length; ++i) {
    const d = tensor.shape[i]
    if (d !== 1) {
      new_shape.push(d)
    } else if (axis !== undefined && axis !== i) {
      new_shape.push(d)
    }
  }
  return tensor.reshape(new_shape)
}
