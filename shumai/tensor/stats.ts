import type { Tensor } from './tensor'
/** @private */
export const getStack = (skip_slice = false) => {
  try {
    throw new Error('')
  } catch (e) {
    const slice_idx = e.stack.indexOf('\n')
    if (slice_idx < 0 || skip_slice) {
      return e.stack
    }
    return e.stack.slice(slice_idx)
  }
  return ''
}

/** @private */
export function collectStats(tensors: Tensor[]) {
  const stats = {}
  for (const t of tensors) {
    if (!t.stats) {
      continue
    }
    for (const key of Object.keys(t.stats)) {
      if (key in stats) {
        stats[key].time += t.stats[key].time
        stats[key].bytes += t.stats[key].bytes
      } else {
        stats[key] = t.stats[key]
      }
    }
  }
  return stats
}
