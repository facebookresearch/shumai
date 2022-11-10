import type { Tensor } from './tensor'
/** @private */
export const getStack = () => {
  try {
    const e = new Error('')
  } catch (e) {
    const slice_idx = e.stack.indexOf('\n')
    console.log(e, slice_idx)
    if (slice_idx < 0) {
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
