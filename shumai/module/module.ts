export class Module extends Function {
  constructor() {
    super('...args', 'return this.__self__.forward(...args)')
    const self = this.bind(this)
    this.__self__ = self
    return self
  }

  forward() {
    throw 'You must implement a `forward()` method in your module'
  }
}
