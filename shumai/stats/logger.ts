import { StatsCollector } from './collector'
import { StatsEntry } from './stats'

export type StatsLoggerData = {
  collector: StatsCollector
  ops: Map<string, StatsEntry>
  stacks: Map<number, StatsEntry>
  stackKeys: Map<number, string>
}

export interface StatsLogger {
  process(data: StatsLoggerData): Promise<void>
}
