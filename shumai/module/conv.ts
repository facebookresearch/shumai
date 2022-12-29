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
    { stride = 1, padding = 0, dilation = 1, groups = 1, bias = true }: Conv2dParameters = {}
  ) {
    super()
    this.stride = stride
    this.padding = padding
    this.dilation = dilation
    this.groups = groups
    this.weight = sm.xavier_uniform(
      [out_channel, inp_channel, kernel_size, kernel_size],
      inp_channel,
      out_channel,
      Math.sqrt(2)
    )
    this.weight.requires_grad = true
    if (bias) {
      this.bias = sm.full([out_channel, 1, 1], 0)
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

interface AvgPool2dParameters {
  stride?: number
  padding?: number
}

export class AvgPool2d extends Module {
  kernel_size: number
  stride: number
  padding: number
  scale?: Tensor
  constructor(
    kernel_size: number,
    { stride = kernel_size, padding = 0 }: AvgPool2dParameters = {}
  ) {
    super()
    this.kernel_size = kernel_size
    this.stride = stride
    this.padding = padding
    this.scale = sm.scalar(1 / (kernel_size * kernel_size))
  }

  forward(x: Tensor): Tensor {
    if (x.shape.length !== 4) {
      throw `avgPool2d requires an input of rank 4, received one of rank ${x.shape.length}.  To possibly fix this, you can use unsqueeze/squeeze`
    }
    const w = sm.full([x.shape[1], 1, this.kernel_size, this.kernel_size], 1)
    x = sm
      .conv2d(x, w, this.stride, this.stride, this.padding, this.padding, 1, 1, x.shape[1])
      .mul(this.scale)
    return x
  }
}

export function avgPool2d(...args) {
  return new AvgPool2d(...args)
}
