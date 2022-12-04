import * as console from 'console'
import * as os from 'os'
import * as process from 'process'
import { fl } from '../ffi/ffi_flashlight'
import { Tensor } from '../tensor'
import { StatsCollector, StatsCollectorOptions } from './collector'
import { StatsLogger } from './logger'
import { opToFlops } from './op_to_flops'

const hostname = os.hostname()
const pid = process.pid

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
  utilization: number
  totals: StatsEntry
  deviceRate: StatsEntry
  hostRate: StatsEntry
  entriesByStack: [string, StatsEntry][]
  entriesByOp: [string, StatsEntry][]
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

export class Stats {
  #hostId: string = hostname
  #processId: string = pid.toString()
  #deviceId = 'unknown' // TODO: currently rely on caller to supply these details, but in future would be nice to have a way to auto-detect (CPU, GPU, etc)
  #collectors: StatsCollector[] = []
  #collectStacks = false

  get enabled() {
    return this.#collectors.length > 0
  }

  set enabled(enabled: boolean) {
    if (enabled) {
      if (this.#collectors.length > 0) return // already enabled

      this.addCollector()
    } else {
      this.#collectors.forEach((c) => c.reset())
      this.#collectors = []
    }
  }

  get collectors(): StatsCollector[] {
    return this.#collectors
  }

  addCollector(options?: StatsCollectorOptions | StatsLogger): StatsCollector {
    if (options && 'process' in options) {
      options = { logger: options as StatsLogger }
    }
    const collector = new StatsCollector(this, options as StatsCollectorOptions)
    this.#collectors.push(collector)

    return collector
  }

  removeCollector(collector: StatsCollector) {
    const idx = this.#collectors.indexOf(collector)
    if (idx >= 0) {
      this.#collectors.splice(idx, 1)
    }
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
    const trace: StatTrace = {
      op,
      stack: this.#collectStacks ? getStack() : void 0,
      startTime: performance.now(),
      startBytes: fl.bytesUsed.native(),
      time: 0,
      bytes: 0n
    }

    return trace
  }

  stopTrace(trace: StatTrace) {
    trace.time = performance.now() - trace.startTime
    trace.bytes = fl.bytesUsed.native() - trace.startBytes
  }

  logTrace(trace: StatTrace, inputs: Tensor[], output: Tensor) {
    const gflops = opToFlops(trace.op, inputs, output) / 1e9

    const entry: StatsEntry = {
      count: 1n,
      time: trace.time,
      bytes: trace.bytes,
      gflops
    }

    this.#collectors.forEach((c) => c.log(trace, entry))
  }

  /* alias functions */

  reset() {
    this.#collectors.map((c) => c.reset())
  }

  get statsByStack(): Map<number, StatsEntry> {
    return this.#collectors?.[0].statsByStack
  }

  get statsByOp(): Map<string, StatsEntry> {
    return this.#collectors?.[0].statsByOp
  }

  getSummary(): StatsSummary {
    return this.#collectors?.[0].getSummary()
  }
}

export const stats = new Stats()

/** @private */
export let scoped_stats: Stats = void 0

export function collectStats(
  fn: (...args: any[]) => any,
  optsOrLogger?: StatsCollectorOptions | StatsLogger
): Stats {
  const prev = scoped_stats

  let options: StatsCollectorOptions = (optsOrLogger as StatsCollectorOptions) || {}
  if (options && 'process' in options) {
    options = { logger: options as StatsLogger }
  }
  options.interval ||= 0 // disable interval logging unless explicitly set
  options.logger ||= null // disable logger unless explicitly set

  const new_stats = (scoped_stats = new Stats())
  scoped_stats.addCollector(options)
  try {
    fn()
  } finally {
    scoped_stats = prev // restore previous scope
  }

  return new_stats
}
