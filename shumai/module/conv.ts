import type { Tensor } from '../tensor'
import * as ops from '../tensor/tensor_ops'
import { Module } from './module'

const sm = { ...ops }

interface Conv2dParameters {
  stride?: number
  padding?: number
  dilation?: number
  groups?: number
  bias?: boolean
}

export class Conv2d extends Module {
  weight: Tensor
  bias?: Tensor
  constructor(
    inp_channel: number,
    out_channel: number,
    kernel_size: number,
    { stride = 1, padding = 0, dilation = 1, groups = 1, bias = true }: Conv2dParameters
  ) {
    super()
    this.stride = stride
    this.padding = padding
    this.dilation = dilation
    this.groups = groups
    this.weight = sm.randn([out_channel, inp_channel, kernel_size, kernel_size])
    this.weight.requires_grad = true
    if (bias) {
      this.bias = sm.randn([out_channel, 1, 1])
      this.bias.requires_grad = true
    }
  }

  forward(x: Tensor): Tensor {
    x = sm.conv2d(
      x,
      this.weight,
      this.stride,
      this.stride,
      this.padding,
      this.padding,
      this.dilation,
      this.dilation,
      this.groups
    )
    if (this.bias) {
      x = x.add(this.bias)
    }
    return x
  }
}

export function conv2d(...args) {
  return new Conv2d(...args)
}
