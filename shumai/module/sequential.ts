import type { Tensor } from '../tensor'
import { Module } from './module'

export class Sequential extends Module {
  private _modules: Module[]

  constructor(...modules: Module[]) {
    super()
    this._modules = modules
  }

  get length(): number {
    return this._modules.length
  }

  get modules(): Module[] {
    return this._modules
  }

  forward(...inputs: Tensor[]): Tensor | Tensor[] {
    if (this._modules.length === 0) {
      if (inputs.length === 0) {
        return null
      } else if (inputs.length === 1) {
        return inputs[0]
      } else {
        return inputs
      }
    }

    if (inputs.length !== this._modules[0].forward.length) {
      throw new Error(
        `Module at index 0 expects ${this._modules[0].forward.length} arguments: got ${inputs.length}`
      )
    }

    let output: Tensor | Tensor[] = this._modules[0](...inputs)
    for (let i = 1; i < this._modules.length; i++) {
      if (output instanceof Array) {
        if (output.length !== this._modules[i].forward.length) {
          throw new Error(
            `Module at index ${i} expects ${this._modules[i].forward.length} arguments: got ${output.length}`
          )
        }
        output = this._modules[i](...output)
      } else {
        if (this._modules[i].forward.length !== 1) {
          throw new Error(
            `Module at index ${i} expects ${this._modules[i].forward.length} arguments: got 1`
          )
        }
        output = this._modules[i](output)
      }
    }

    return output
  }
}
