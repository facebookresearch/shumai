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
      perSec: { count: 0n, time: 1_000, bytes: 0n, gflops: 0 },
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
      stats.totals.bytes += entry.bytes
      stats.totals.gflops += entry.gflops

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
        stats.entriesByOp.set(op, entry)
      }
    }

    t.stats = null // wipe out stats so they're not accidently reused which would skew summary
  }

  // compute per second stats
  const seconds = stats.totals.time / 1000
  stats.perSec.count = BigInt(Math.round(Number(stats.totals.count) / seconds))
  // perSec stats may result in loss due to type conversions
  stats.perSec.bytes = stats.totals.bytes / BigInt(stats.totals.count)
  stats.perSec.gflops = Number(stats.totals.gflops) / seconds

  return stats
}
