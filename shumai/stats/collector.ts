import * as console from 'console'
import { cyrb53 } from '../util'
import { StatsLogger } from './logger'
import { StatsLoggerConsole } from './loggers/console'
import { StatInfo, Stats, StatsEntry, StatsSummary } from './stats'

export const StatsCollectorOptionsDefaults = {
  interval: 5_000,
  logger: new StatsLoggerConsole()
}

export type StatsCollectorOptions = {
  interval?: number
  logger?: StatsLogger
}

export class StatsCollector {
  #stackIds: Map<string, number> = new Map()
  #stackKeys: Map<number, string> = new Map()
  #stats: Stats
  #startTime = 0
  #statsByStack: Map<number, StatsEntry> = new Map()
  #statsByOp: Map<string, StatsEntry> = new Map()
  #options: StatsCollectorOptions

  constructor(stats: Stats, options: StatsCollectorOptions = StatsCollectorOptionsDefaults) {
    this.#stats = stats
    this.#options = { ...StatsCollectorOptionsDefaults, ...options }
  }

  get stats(): Stats {
    return this.#stats
  }

  reset(): void {
    // create new maps since the old are handed off to the logger to avoid copies
    this.#statsByStack = new Map()
    this.#statsByOp = new Map()
    this.#startTime = performance.now()
  }

  get statsByStack(): Map<number, StatsEntry> {
    return this.#statsByStack
  }

  get statsByOp(): Map<string, StatsEntry> {
    return this.#statsByOp
  }

  get options(): StatsCollectorOptions {
    return this.#options
  }

  async log(info: StatInfo, stat: StatsEntry): Promise<void> {
    const { op, stack } = info

    this.#startTime ||= performance.now()

    let stackId = 0
    if (stack) {
      if (!this.#stackIds.has(stack)) {
        stackId = cyrb53(stack)
        this.#stackIds.set(stack, stackId)
        this.#stackKeys.set(stackId, stack)
      } else {
        stackId = this.#stackIds.get(stack)
      }
    }

    let stackEntry: StatsEntry
    if (stackId && !this.#statsByStack.has(stackId)) {
      stackEntry = { ...stat }
      this.#statsByStack.set(stackId, stackEntry)
    } else if (stackId) {
      stackEntry = this.#statsByStack.get(stackId)
      stackEntry.count += stat.count
      stackEntry.time += stat.time
      stackEntry.bytes += stat.bytes
      stackEntry.gflops += stat.gflops
    }

    let opEntry: StatsEntry
    if (!this.#statsByOp.has(op)) {
      opEntry = { ...stat }
      this.#statsByOp.set(op, opEntry)
    } else {
      opEntry = this.#statsByOp.get(op)
      opEntry.count += stat.count
      opEntry.time += stat.time
      opEntry.bytes += stat.bytes
      opEntry.gflops += stat.gflops
    }

    if (performance.now() - this.#startTime >= this.#options.interval) {
      try {
        // fire and forget, DO NOT BLOCK
        this.#options.logger.process({
          collector: this,
          ops: this.#statsByOp,
          stacks: this.#statsByStack,
          stackKeys: this.#stackKeys
        })
      } catch (e) {
        console.error(e)
      }

      this.reset()
    }
  }

  /** getStatsSummary
   * @description get a summary of the stats collected
   *
   * @returns StatsSummary
   */
  getStatsSummary(): StatsSummary {
    const entriesByStack: [string, StatsEntry][] = [...this.#statsByStack.entries()].map(
      ([stackId, entry]) => [this.#stackKeys.get(stackId), entry]
    )
    const entriesByOp: [string, StatsEntry][] = [...this.#statsByOp.entries()].map(
      ([op, entry]) => [op, entry]
    )

    const stats: StatsSummary = {
      totals: { count: 0n, time: 0, bytes: 0n, gflops: 0 },
      deviceRate: { count: 0n, time: 1_000, bytes: 0n, gflops: 0 },
      hostRate: { count: 0n, time: 1_000, bytes: 0n, gflops: 0 },
      entriesByStack,
      entriesByOp,
      utilization: 0
    }

    const hostSeconds = (performance.now() - this.#startTime) / 1_000

    for (const [, entry] of entriesByOp) {
      stats.totals.count += entry.count
      stats.totals.time += entry.time
      stats.totals.bytes += entry.bytes
      stats.totals.gflops += entry.gflops

      // convert to gflops/sec
      entry.gflops = hostSeconds ? entry.gflops / hostSeconds : 0
    }

    for (const [, entry] of entriesByStack) {
      // convert to gflops/sec
      entry.gflops = hostSeconds ? entry.gflops / hostSeconds : 0
    }

    const seconds = stats.totals.time / 1_000

    // compute per second stats
    stats.deviceRate.count = seconds ? BigInt(Math.round(Number(stats.totals.count) / seconds)) : 0n
    stats.deviceRate.time = hostSeconds ? stats.totals.time / hostSeconds : 1_000
    // deviceRate stats may result in loss due to type conversions
    stats.deviceRate.bytes = stats.totals.count
      ? stats.totals.bytes / BigInt(stats.totals.count)
      : 0n
    stats.deviceRate.gflops = seconds ? Number(stats.totals.gflops) / seconds : 0

    // compute host rate stats (total wall clock compared to only device time)
    stats.hostRate.count = hostSeconds
      ? BigInt(Math.round(Number(stats.totals.count) / hostSeconds))
      : 0n
    stats.hostRate.time = stats.deviceRate.time
    // hostRate stats may result in loss due to type conversions
    stats.hostRate.bytes = stats.totals.count ? stats.totals.bytes / BigInt(stats.totals.count) : 0n
    stats.hostRate.gflops = hostSeconds ? Number(stats.totals.gflops) / hostSeconds : 0

    // compute utilization of device against host time
    stats.utilization = stats.deviceRate.time / 1_000

    return stats
  }
}
