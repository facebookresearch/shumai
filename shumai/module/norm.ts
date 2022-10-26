import type { Tensor } from '../tensor'
import * as tensor from '../tensor/tensor'
import * as ops from '../tensor/tensor_ops'
import { Module } from './module'

const sm = { ...ops, ...tensor }

export class LayerNorm extends Module {
  private dims: number[]
  private axes: number[]
  private eps: Tensor
  private gamma: Tensor
  private beta: Tensor

  constructor(dims: number[], eps?: number | Tensor) {
    super()
    if (dims.length === 0) {
      throw new Error(`LayerNorm cannot be applied to scalars; dims cannot be []`)
    }
    this.dims = dims
    this.axes = dims.map((x, i) => -1 * (i + 1))
    if (eps === undefined) {
      this.eps = sm.scalar(1e-6)
    } else if (typeof eps === 'number') {
      this.eps = sm.scalar(eps)
    } else if (eps.shape.length === 0) {
      this.eps = eps
    } else {
      throw new Error(`Parameter eps (${eps}) must be a number or scalar Tensor`)
    }
    if (this.eps.greaterThan(sm.scalar(0)).toUint8Array()[0] === 0) {
      throw new Error(`Parameter eps (${eps}) must be greater than 0`)
    }

    this.resetParameters()
    this.gamma.requireGrad()
    this.beta.requireGrad()
  }

  resetParameters(): void {
    this.gamma = sm.full(this.dims, 1)
    this.beta = sm.full(this.dims, 0)
  }

  forward(tensor: Tensor): Tensor {
    const shape = tensor.shape
    for (const negAxis of this.axes) {
      if (shape[shape.length + negAxis] !== this.dims[this.dims.length + negAxis]) {
        throw new Error(
          `Final axes of input tensor (shape ${shape}) must match module dimensions (${this.dims})`
        )
      }
    }

    const mean = tensor.mean(this.axes, true)
    const std = tensor.variance(this.axes, false, true).add(this.eps).sqrt()

    return tensor.sub(mean).div(std).mul(this.gamma).add(this.beta)
  }
}
