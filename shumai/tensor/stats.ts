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
        stats[key].count += t.stats[key].count
        stats[key].time += t.stats[key].time
        stats[key].bytes += t.stats[key].bytes
        stats[key].gflops += t.stats[key].gflops
      } else {
        stats[key] = t.stats[key]
      }
    }
  }
  return stats
}

export type StatsEntry = {
  count: bigint
  time: number
  bytes: bigint
  gflops: number
}

export type StatsSummary = {
  totals: StatsEntry
  perSec: StatsEntry
  entriesByStack: Map<string, StatsEntry>
  entriesByOp: Map<string, StatsEntry>
}

export function getStatsSummary(tensors: Tensor[], priorStats?: StatsSummary): StatsSummary {
  let stats: StatsSummary = priorStats
  if (!stats) {
    // init
    stats = {
      totals: { count: 0n, time: 0, bytes: 0n, gflops: 0 },
      perSec: { count: 0n, time: 0, bytes: 0n, gflops: 0 },
      entriesByStack: new Map(),
      entriesByOp: new Map()
    }
  }

  for (const t of tensors) {
    if (!t.stats) {
      throw new Error(`tensor has no stats ${t.ptr}:${t.shape}`)
    }

    for (const key of Object.keys(t.stats)) {
      const op = /^(\n)?(.*)@/.exec(key)?.[2] || key
      const entry = t.stats[key]
      stats.totals.count += entry.count
      stats.totals.time += entry.time
      if (stats.totals.time === Infinity) {
        console.warn('something wrong!', stats.totals, entry)
        process.exit()
      }
      stats.totals.bytes += entry.bytes
      stats.totals.gflops += entry.gflops
      if (stats.totals.time === Infinity) {
        console.warn('something wrong!', stats.totals, entry)
        process.exit()
      }

      const stackEntry = stats.entriesByStack.get(key)
      if (stackEntry) {
        stackEntry.count += entry.count
        stackEntry.time += entry.time
        stackEntry.bytes += entry.bytes
        stackEntry.gflops += entry.gflops
      } else {
        stats.entriesByStack.set(key, entry)
      }

      const opEntry = stats.entriesByOp.get(op)
      if (opEntry) {
        opEntry.count += entry.count
        opEntry.time += entry.time
        opEntry.bytes += entry.bytes
        opEntry.gflops += entry.gflops
      } else {
        stats.entriesByOp.set(entry.op, entry)
      }
    }
  }

  // compute per second stats
  const seconds = stats.totals.time / 1000
  let seconds64;
  try {
  seconds64 = BigInt(Math.round(seconds))
  } catch (e) {
    console.log('seconds', stats.totals.time, seconds)
    throw e;
  }
  stats.perSec.count = seconds64 ? stats.totals.count / seconds64 : 0n
  stats.perSec.time = 1_000 // not useful to compute, just set to 1 second
  // perSec stats may result in loss due to type conversions
  try {
    stats.perSec.bytes = stats.totals.bytes / BigInt(stats.totals.count)
  } catch (err) {
    console.warn('stats.totals.count is NaN', stats.totals)
    throw err
  }
  stats.perSec.gflops = Number(stats.totals.gflops) / seconds

  return stats
}
