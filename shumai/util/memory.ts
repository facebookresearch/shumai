import { fl } from '../ffi/ffi_flashlight'
import { Tensor } from '../tensor/tensor'

export let _tidyTracker: Map<number, Tensor> = null

export function tidy<T>(fn: (...args: any[]) => T, args: any | any[] = []): T {
  // by tracking prior scope nested tidy's can play nice
  const previousTracker = _tidyTracker

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

  // restore tracker to prior scope
  _tidyTracker = previousTracker

  return result
}

export function tidyExclude(fn: () => void) {
  const previousTracker = _tidyTracker

  // tensors created in this scope will be excluded from tracking
  _tidyTracker = null
  fn();

  // restore tracker to prior scope
  _tidyTracker = previousTracker
}

export type MemoryOptions = {
  lowerBoundThreshold?: number
  upperBoundThreshold?: number
  delayBetweenGCs?: number
}

const DEFAULT_MEMORY_OPTIONS: MemoryOptions = {
  lowerBoundThreshold: 100e6, // 100MB
  upperBoundThreshold: 5e9, // 5GB
  delayBetweenGCs: 1000 // 1s
}

/** @private */
const gOptions: MemoryOptions = {
  ...DEFAULT_MEMORY_OPTIONS
}

/** @private */
let nextGC = performance.now() + gOptions.delayBetweenGCs

export function gcAsNeeded(bytesNeeded = 0) {
  const bytesUsed = fl.bytesUsed.native() + BigInt(bytesNeeded)
  const now = performance.now()
  if (
    bytesUsed >= gOptions.upperBoundThreshold ||
    (now >= nextGC && bytesUsed >= gOptions.lowerBoundThreshold)
  ) {
    Bun.gc(true)
    nextGC = now + gOptions.delayBetweenGCs
  }
}

export function memoryOptions(opts: MemoryOptions): MemoryOptions {
  gOptions.lowerBoundThreshold = opts?.lowerBoundThreshold ?? gOptions.lowerBoundThreshold
  gOptions.upperBoundThreshold = opts?.upperBoundThreshold ?? gOptions.upperBoundThreshold
  gOptions.delayBetweenGCs = opts?.delayBetweenGCs ?? gOptions.delayBetweenGCs

  return gOptions
}
