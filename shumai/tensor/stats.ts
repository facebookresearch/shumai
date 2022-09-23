/** @private */
export const getStack = () => {
  const e = new Error('')
  const slice_idx = e.stack.indexOf('\n')
  if (slice_idx < 0) {
    return e.stack
  }
  return e.stack.slice(slice_idx)
}

/** @private */
export function collectStats(tensors) {
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
