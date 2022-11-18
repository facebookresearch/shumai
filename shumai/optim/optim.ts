export class Optimizer extends Function {
  private __self__: this
  constructor() {
    super('...args', 'return this.__self__.step(...args)')
    const self = this.bind(this)
    this.__self__ = self
    return self
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  step(grads: Record<string, { grad: sm.Tensor; tensor: sm.Tensor; id: number }>) {
    throw new Error('You must implement a `step()` method in your optimizer')
  }
}
