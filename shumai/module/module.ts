import * as fs from 'node:fs'
import * as path from 'path'
import { Tensor } from '../tensor'

function traverse(obj, dir, callback, prefix = 'model') {
  for (const [key, value] of Object.entries(obj)) {
    const file_key = `${prefix}.${key}`
    if (value instanceof Tensor) {
      const fn = path.join(dir, `${file_key}.tensor`)
      value.checkpoint(fn, callback)
      continue
    }
    if (value instanceof Object) {
      traverse(value, dir, callback, file_key)
    }
  }
}

export function checkpoint(model, dir, callback = () => true) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  traverse(model, dir)
}

export class Module extends Function {
  private __self__: this
  constructor() {
    super('...args', 'return this.__self__.forward(...args)')
    const self = this.bind(this)
    this.__self__ = self
    return self
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forward(...args: unknown[]): Tensor[] | Tensor {
    throw new Error('You must implement a `forward()` method in your module')
  }

  checkpoint(dir, callback = () => true) {
    checkpoint(this, dir, callback)
  }
}
