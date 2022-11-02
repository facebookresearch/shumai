import { Tensor } from '../tensor/tensor'
export let _tidyTracker: Map<number, Tensor> = null

export function tidy<T>(fn: (...args: any[]) => T, args: any | any[] = []): T {
  _tidyTracker = new Map()
  if (!Array.isArray(args)) args = [args]
  const result = fn(...args)

  /**
   * recursively scan for `instanceof Tensor`;
   * mark & sweep w `WeakSet` to avoid circ ref
   */
  const prev_seen = new WeakSet()
  const parseTidyRet = (result: unknown) => {
    const res_type = typeof result
    if (
      res_type === 'number' ||
      res_type === 'bigint' ||
      res_type === 'symbol' ||
      res_type === 'string' ||
      res_type === 'boolean' ||
      res_type === 'undefined' ||
      result == null
    ) {
      return
    }

    if (result instanceof Tensor) {
      if (!prev_seen.has(result)) {
        prev_seen.add(result)
        _tidyTracker.delete(result.ptr)
      }
      return
    }

    if (result instanceof Array) {
      // array
      const length = result.length
      for (let i = 0; i < length; i++) {
        parseTidyRet(result[i])
      }
      return
    }

    if (result instanceof Object) {
      // Object
      if (!prev_seen.has(result)) {
        prev_seen.add(result)
        const keys = Object.keys(result)
        for (let i = 0; i < keys.length; i++) {
          parseTidyRet(result[keys[i]])
        }
      }
      return
    }
  }

  parseTidyRet(result)

  for (const [, tensor] of _tidyTracker) {
    tensor.dispose()
  }
  _tidyTracker = null
  return result
}
