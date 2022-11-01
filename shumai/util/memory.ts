import { Tensor } from '../tensor/tensor'
export const creationTracker: Map<number, Tensor> = new Map()
export const altTracker: Record<number, Tensor> = {}

export let is_tidy_run = false

export function tidy<T>(fn: (...args: any[]) => T, args: any | any[] = []): T {
  if (!Array.isArray(args)) args = [args]
  is_tidy_run = true
  const result = fn(...args)

  // lazy mark & sweep w stringifed obj to avoid circ ref
  const prev_seen = new Set<string>()
  const parseTidyRet = (result: any) => {
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
      creationTracker.delete(result.ptr)
      return
    }

    if (Array.isArray(result)) {
      // array
      const length = result.length
      for (let i = 0; i < length; i++) {
        if (result[i] instanceof Tensor) {
          creationTracker.delete(result[i])
        } else {
          parseTidyRet(result[i])
        }
      }
      return
    }

    if (typeof result === 'object') {
      // Object
      const stringified = JSON.stringify(result)
      if (!prev_seen.has(stringified)) {
        prev_seen.add(stringified)

        const keys = Object.keys(result)
        for (let i = 0; i < keys.length; i++) {
          if (result[keys[i]] instanceof Tensor) {
            creationTracker.delete(result[keys[i]].ptr)
          } else {
            parseTidyRet(result[keys[i]])
          }
        }
      }
      return
    }
  }
  parseTidyRet(result)

  for (const [, tensor] of creationTracker) {
    tensor.dispose()
  }
  creationTracker.clear()
  is_tidy_run = false
  return result
}
