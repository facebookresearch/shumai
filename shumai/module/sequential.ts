import type { Tensor } from '../tensor'
import { Module } from './module'

export class Sequential extends Module {
  private modules: Module[]

  constructor(...modules: Module[]) {
    super()
    this.modules = modules
  }

  get length(): number {
    return this.modules.length
  }

  at(index: number): Module {
    return this.modules.at(index)
  }

  push(module: Module): number {
    return this.modules.push(module)
  }

  pop(): Module {
    return this.modules.pop()
  }

  shift(): Module {
    return this.modules.shift()
  }

  unshift(module: Module): number {
    return this.modules.unshift(module)
  }

  reverse() {
    this.modules.reverse() // in-place
  }

  forward(...inputs: Tensor[]): Tensor | Tensor[] {
    if (this.modules.length === 0) {
      if (inputs.length === 0) {
        return null
      } else if (inputs.length === 1) {
        return inputs[0]
      } else {
        return inputs
      }
    }

    if (inputs.length !== this.modules[0].forward.length) {
      throw new Error(
        `Module at index 0 expects ${this.modules[0].forward.length} arguments: got ${inputs.length}`
      )
    }

    let output: Tensor | Tensor[] = this.modules[0](...inputs)
    for (let i = 1; i < this.modules.length; i++) {
      if (output instanceof Array) {
        if (output.length !== this.modules[i].forward.length) {
          throw new Error(
            `Module at index ${i} expects ${this.modules[i].forward.length} arguments: got ${output.length}`
          )
        }
        output = this.modules[i](...output)
      } else {
        if (this.modules[i].forward.length !== 1) {
          throw new Error(
            `Module at index ${i} expects ${this.modules[i].forward.length} arguments: got 1`
          )
        }
        output = this.modules[i](output)
      }
    }

    return output
  }
}
