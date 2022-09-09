import * as base from '../tensor/tensor'
import * as ops from '../tensor/tensor_ops_gen'
const sm = { ...base, ...ops }
import { Module } from './module'

export class Linear extends Module {
  weight: sm.Tensor
  bias: sm.Tensor
  constructor(inp_dim: number, out_dim: number) {
    super()
    this.weight = sm.randn([inp_dim, out_dim])
    this.bias = sm.randn([1, out_dim])
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
