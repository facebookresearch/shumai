import type { Tensor } from '../tensor'
export class Module extends Function {
  private __self__: this
  constructor() {
    super('...args', 'return this.__self__.forward(...args)')
    const self = this.bind(this)
    this.__self__ = self
    return self
  }

  forward(...args: any[]): Tensor[] | Tensor {
    throw new Error('You must implement a `forward()` method in your module')
  }
}
