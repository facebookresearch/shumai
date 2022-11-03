import { Tensor } from '../tensor'
import { Module } from './module'

export class Sequential extends Module {
  private _modules: CallableFunction[]

  constructor(...modules: CallableFunction[]) {
    super()
    this._modules = modules
  }

  get length(): number {
    return this._modules.length
  }

  get modules(): CallableFunction[] {
    return this._modules
  }

  forward(...inputs: unknown[]): Tensor | Tensor[] {
    if (this._modules.length === 0) {
      if (inputs.length === 0) {
        return null
      } else if (inputs.length === 1) {
        if (!(inputs[0] instanceof Tensor)) {
          throw new Error(`No-op can only be performed on Tensor inputs: arg at index 0`)
        }
        return inputs[0]
      } else {
        for (let i = 0; i < inputs.length; i++) {
          if (!(inputs[i] instanceof Tensor)) {
            throw new Error(`No-op can only be performed on Tensor inputs: arg at index ${i}`)
          }
        }
        return <Tensor[]>inputs
      }
    }

    let output: Tensor | Tensor[] = this._modules[0](...inputs)
    for (let i = 1; i < this._modules.length; i++) {
      if (output instanceof Array) {
        output = this._modules[i](...output)
      } else {
        output = this._modules[i](output)
      }
    }

    return output
  }
}
