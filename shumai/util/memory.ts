import { Tensor } from '../tensor/tensor'
export const creationTracker: Map<number, Tensor> = new Map()
export let is_tidy_run = false

export function tidy<T>(fn: (...args: any[]) => T, args: any | any[] = []): T {
  if (!Array.isArray(args)) args = [args]
  is_tidy_run = true
  const result = fn(...args)
  const keep_ptrs: number[] = []
  switch (typeof result) {
  }
  if (result instanceof Tensor) {
    keep_ptrs.push(result.ptr)
  } else if (Array.isArray(result)) {
    const count = result.length
    for (let i = 0; i < count; i++) {
      const item = result[i]
      if (item instanceof Tensor) {
        keep_ptrs.push(item.ptr)
      }
    }
  }
  // TODO: needs to recursively scan for `instanceof Tensor` in the result

  keep_ptrs.map((ptr) => creationTracker.delete(ptr))
  for (const [, tensor] of creationTracker) {
    tensor.dispose()
  }
  creationTracker.clear()
  is_tidy_run = false
  return result
}
