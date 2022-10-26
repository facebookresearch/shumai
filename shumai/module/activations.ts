import type { Tensor } from '../tensor'
import { Module } from './module'
import * as tensor from '../tensor'
import * as ops from '../tensor/tensor_ops'
const sm = { ...tensor, ...ops }

export class Tanh extends Module {
  constructor() {
    super()
  }

  forward(x: Tensor): Tensor {
    return x.tanh()
  }
}

export function tanh(): Module {
  return new Tanh()
}

export class Sigmoid extends Module {
  constructor() {
    super()
  }

  forward(x: Tensor): Tensor {
    return x.sigmoid()
  }
}

export function sigmoid(): Module {
  return new Sigmoid()
}

export class ReLU extends Module {
  constructor() {
    super()
    this.zero = sm.scalar(0)
  }

  forward(x: Tensor): Tensor {
    return x.maximum(this.zero)
  }
}

export function relu(): Module {
  return new ReLU()
}

export class LeakyReLU extends Module {
  constructor(slope: number) {
    super()
    this.#slope = sm.scalar(slope)
  }

  #slope: Tensor

  forward(x: Tensor): Tensor {
    return x.maximum(x.mul(this.#slope))
  }
}

export function leakyrelu(slope: number): Module {
  return new LeakyReLU(slope)
}
