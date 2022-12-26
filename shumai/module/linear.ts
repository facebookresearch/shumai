import type { Tensor } from '../tensor'
import * as ops from '../tensor/tensor_ops'
import { Module } from './module'

const sm = { ...ops }

export class Linear extends Module {
  weight: Tensor
  bias: Tensor
  constructor(inp_dim: number, out_dim: number) {
    super()
    const fan_in = Math.sqrt(2 / inp_dim)
    this.weight = sm.randn([inp_dim, out_dim]).mul(sm.scalar(fan_in))
    this.bias = sm.full([out_dim], 0)
    this.weight.requires_grad = true
    this.bias.requires_grad = true
  }

  forward(x: Tensor): Tensor {
    x = x.matmul(this.weight)
    return x.add(this.bias)
  }
}

export function linear(inp_dim, out_dim) {
  return new Linear(inp_dim, out_dim)
}
