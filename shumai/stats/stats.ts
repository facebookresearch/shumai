import * as os from 'os'
import * as process from 'process'
import { fl } from '../ffi/ffi_flashlight'
import { Tensor } from '../tensor'
import { cyrb53 } from '../util'
import { StatsLogger } from './logger'
import { StatsLoggerConsole } from './loggers'
import { opToFlops } from './op_to_flops'

const hostname = os.hostname()
const pid = process.pid.toString()

/** @private */
export const getStack = (skip_slice = false) => {
  try {
    throw new Error('')
  } catch (e) {
    if (skip_slice) return e.stack
    return e.stack.split('\n').slice(2).join('\n')
  }
}

export type StatsEntry = {
  count: bigint
  time: number
  bytes: bigint
  gflops: number
}

export type StatsSummary = {
  id: string
  hostId: string
  processId: string
  deviceId: string
  bytesUsed: bigint
  utilization: number
  startTime: number
  endTime: number
  totals: StatsEntry
  deviceRate: StatsEntry
  hostRate: StatsEntry
  stackKeys: [number, string][]
  entriesByStack: [number, StatsEntry][]
  entriesByOp: [string, StatsEntry][]
  remoteStats: StatsSummary[]
}

export type StatInfo = {
  op: string
  stack: string
}

export interface StatTrace extends StatInfo {
  startTime: number
  startBytes: bigint
  time: number
  bytes: bigint
}

export const StatsOptionsDefaults = {
  enabled: false,
  interval: 5_000,
  collectStacks: false,
  logger: new StatsLoggerConsole()
}

export type StatsOptions = {
  enabled?: boolean
  interval?: number
  collectStacks?: boolean
  logger?: StatsLogger
}

export type StatsJSONOptions = {
  includeRemotes: boolean
  computeRates: boolean
}

export class Stats {
  #hostId: string = hostname
  #processId: string = pid
  #deviceId = 'unknown' // TODO: currently rely on caller to supply these details, but in future would be nice to have a way to auto-detect (CPU, GPU, etc)

  #enabled: boolean
  #interval: number
  #collectStacks: boolean
  #loggers: StatsLogger[] = []

  #bytesUsed = fl.bytesUsed.native() // could track history in future for mean, max, etc
  #stackIds: Map<string, number> = new Map()
  #stackKeys: Map<number, string> = new Map()
  #startTime = 0
  #endTime = 0
  #statsByStack: Map<number, StatsEntry> = new Map()
  #statsByOp: Map<string, StatsEntry> = new Map()

  #remoteStats: Map<string, Stats> = new Map()

  constructor(options: StatsOptions = StatsOptionsDefaults) {
    const { enabled, interval, collectStacks, logger } = { ...StatsOptionsDefaults, ...options }
    this.#enabled = enabled
    this.#interval = interval
    this.#collectStacks = collectStacks
    logger && this.#loggers.push(logger)
  }

  get enabled() {
    return this.#enabled
  }

  set enabled(enabled: boolean) {
    if (this.#enabled === enabled) return // no change

    this.#enabled = enabled

    enabled && this.reset() // clean state on re-enable otherwise history will skew results
  }

  addLogger(logger: StatsLogger) {
    this.#loggers.push(logger)
  }

  removeLogger(logger: StatsLogger) {
    const idx = this.#loggers.indexOf(logger)
    if (idx >= 0) {
      this.#loggers.splice(idx, 1)
    }
  }

  get id() {
    return `${this.#hostId}:${this.#processId}:${this.#deviceId}`
  }

  get hostId() {
    return this.#hostId
  }

  set hostId(hostId: string) {
    this.#hostId = hostId
  }

  get processId() {
    return this.#processId
  }

  set processId(processId: string) {
    this.#processId = processId
  }

  get deviceId() {
    return this.#deviceId
  }

  set deviceId(deviceId: string) {
    this.#deviceId = deviceId
  }

  get collectStacks() {
    return this.#collectStacks
  }

  set collectStacks(collectStacks: boolean) {
    this.#collectStacks = collectStacks
  }

  startTrace(op: string): StatTrace {
    const now = performance.timeOrigin + performance.now()
    if (!this.#startTime) {
      this.#startTime = this.#endTime = now
    }

    const trace: StatTrace = {
      op,
      stack: this.#collectStacks ? getStack() : void 0,
      startTime: now,
      startBytes: fl.bytesUsed.native(),
      time: 0,
      bytes: 0n
    }

    return trace
  }

  stopTrace(trace: StatTrace) {
    const endTime = (this.#endTime = performance.timeOrigin + performance.now())

    trace.time = endTime - trace.startTime
    trace.bytes = fl.bytesUsed.native() - trace.startBytes
  }

  logTrace(trace: StatTrace, inputs: Tensor[], output: Tensor) {
    const gflops = opToFlops(trace.op, inputs, output) / 1e9

    this.#bytesUsed = trace.bytes + trace.startBytes

    const entry: StatsEntry = {
      count: 1n,
      time: trace.time,
      bytes: trace.bytes,
      gflops
    }

    this.log(trace, entry)
  }

  reset(): void {
    // create new maps since the old are handed off to the logger to avoid copies
    this.#statsByStack = new Map()
    this.#statsByOp = new Map()
    this.#remoteStats = new Map()
    this.#startTime = this.#endTime = 0
  }

  get statsByStack(): Map<number, StatsEntry> {
    return this.#statsByStack
  }

  get statsByOp(): Map<string, StatsEntry> {
    return this.#statsByOp
  }

  get interval(): number {
    return this.#interval
  }

  set interval(interval: number) {
    this.#interval = interval
  }

  get loggers(): StatsLogger[] {
    return this.#loggers
  }

  get bytesUsed(): bigint {
    return this.#bytesUsed
  }

  /**
   * Used to replace existing logger(s)
   */
  set logger(logger: StatsLogger) {
    this.#loggers = [logger]
  }

  get remoteStats(): Map<string, Stats> {
    return this.#remoteStats
  }

  addRemoteStats(stats: Stats): Stats {
    const existing = stats.id === this.id ? this : this.#remoteStats.get(stats.id)
    if (!existing) {
      // new remote stats, add only
      this.#remoteStats.set(stats.id, stats)
      return stats
    }

    // merge stats with existing
    existing.#startTime = Math.min(existing.#startTime, stats.#startTime)
    existing.#endTime = Math.max(existing.#endTime, stats.#endTime)
    existing.#bytesUsed =
      existing.#bytesUsed < stats.#bytesUsed ? stats.#bytesUsed : existing.#bytesUsed
    stats.#statsByOp.forEach((entry, op) => {
      const existingEntry = existing.#statsByOp.get(op)
      if (!existingEntry) {
        existing.#statsByOp.set(op, entry)
      } else {
        existingEntry.count += entry.count
        existingEntry.time += entry.time
        existingEntry.bytes += entry.bytes
        existingEntry.gflops += entry.gflops
      }
    })
    stats.#statsByStack.forEach((entry, op) => {
      const existingEntry = existing.#statsByStack.get(op)
      if (!existingEntry) {
        existing.#statsByStack.set(op, entry)
      } else {
        existingEntry.count += entry.count
        existingEntry.time += entry.time
        existingEntry.bytes += entry.bytes
        existingEntry.gflops += entry.gflops
      }
    })
    stats.#stackKeys.forEach((stack, id) => {
      existing.#stackKeys.set(id, stack)
      existing.#stackIds.set(stack, id)
    })

    return existing
  }

  private async log(info: StatInfo, stat: StatsEntry): Promise<void> {
    const { op, stack } = info

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

    // interval & loggers are intertwined, otherwise state is persisted
    if (
      this.#interval &&
      this.#loggers.length &&
      performance.timeOrigin + performance.now() - this.#startTime >= this.#interval
    ) {
      try {
        // fire and forget, DO NOT BLOCK
        this.#loggers.forEach((l) =>
          l.process({
            stats: this,
            ops: this.#statsByOp,
            stacks: this.#statsByStack,
            stackKeys: this.#stackKeys
          })
        )
      } catch (e) {
        console.error(e)
      }

      this.reset()
    }
  }

  /**
   * Get a summary of the stats collected
   *
   * @param includeRemotes Include stats from remote devices
   * @returns StatsSummary
   */
  getSummary(
    options: StatsJSONOptions = { includeRemotes: true, computeRates: true }
  ): StatsSummary {
    return this.toJSON({ ...options, computeRates: true })
  }

  /**
   * Returns an object presentation of the stats collected
   *
   * @param options - If `includeRemotes` is true, stats from remote devices will be included. If `computeRates` is true, rates will be computed.
   * @returns
   */
  toJSON(options: StatsJSONOptions = { includeRemotes: false, computeRates: false }): StatsSummary {
    const { includeRemotes = false, computeRates = false } = options

    const entriesByStack: [number, StatsEntry][] = [...this.#statsByStack.entries()].map(
      ([stackId, entry]) => [stackId, { ...entry }] // copy entries so they can be safely mutated for aggregations
    )
    const entriesByOp: [string, StatsEntry][] = [...this.#statsByOp.entries()].map(
      ([op, entry]) => [op, { ...entry }] // copy entries so they can be safely mutated for aggregations
    )

    const stats: StatsSummary = {
      id: this.id,
      hostId: this.hostId,
      processId: this.processId,
      deviceId: this.deviceId,
      startTime: this.#startTime,
      endTime: this.#endTime,
      totals: { count: 0n, time: 0, bytes: 0n, gflops: 0 },
      deviceRate: { count: 0n, time: 1_000, bytes: 0n, gflops: 0 },
      hostRate: { count: 0n, time: 1_000, bytes: 0n, gflops: 0 },
      stackKeys: [...this.#stackKeys.entries()],
      entriesByStack,
      entriesByOp,
      utilization: 0,
      bytesUsed: fl.bytesUsed.native(),
      remoteStats: includeRemotes
        ? [...this.#remoteStats.values()].map((s) => s.toJSON(options))
        : []
    }

    // measure of host time is fixed to the first & last entry to avoid gaps of work skewing results
    // this fixed window of time allows for consistent rates to be computed even when serialized from multiple devices
    const hostSeconds = (this.#endTime - this.#startTime) / 1_000

    for (const [, entry] of entriesByOp) {
      stats.totals.count += entry.count
      stats.totals.time += entry.time
      stats.totals.bytes += entry.bytes
      stats.totals.gflops += entry.gflops

      if (computeRates) {
        // convert to gflops/sec
        entry.gflops = hostSeconds ? entry.gflops / hostSeconds : 0
      }
    }

    if (computeRates) {
      for (const [, entry] of entriesByStack) {
        // convert to gflops/sec
        entry.gflops = hostSeconds ? entry.gflops / hostSeconds : 0
      }
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

  static fromJSON(o: StatsSummary): Stats {
    // by default create an inactive (pull only) stats object since it's intended as a state bag
    const stats = new Stats({ enabled: false, logger: null })

    stats.hostId = o.hostId || 'unknown'
    stats.processId = o.processId || 'unknown'
    stats.deviceId = o.deviceId || 'unknown'

    stats.#stackKeys = new Map(o.stackKeys)
    stats.#stackIds = new Map(o.stackKeys.map(([k, v]) => [v, k]))
    stats.#statsByOp = new Map(o.entriesByOp)
    stats.#statsByStack = new Map(o.entriesByStack)

    stats.#bytesUsed = o.bytesUsed
    stats.#startTime = o.startTime
    stats.#endTime = o.endTime

    stats.#remoteStats = new Map(
      o.remoteStats.map((rawStats) => {
        const s = Stats.fromJSON(rawStats)
        return [s.id, s]
      })
    )

    return stats
  }
}

/** @private */
export const globalStats: Stats = new Stats()

export let stats = globalStats

export function collectStats(
  fn: (...args: any[]) => any,
  optsOrLogger?: StatsOptions | StatsLogger
): Stats {
  const prev = stats

  let options: StatsOptions = (optsOrLogger as StatsOptions) || {}
  if (options && 'process' in options) {
    options = { logger: options as StatsLogger }
  }
  options.logger ||= null // disable logger unless explicitly set

  const new_stats = (stats = new Stats(options))

  try {
    fn()
  } finally {
    stats = prev || globalStats // restore previous scope
  }

  return new_stats
}
