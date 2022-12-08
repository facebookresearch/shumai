import { Stats, StatsEntry } from './stats'

export type StatsLoggerData = {
  stats: Stats
  ops: Map<string, StatsEntry>
  stacks: Map<number, StatsEntry>
  stackKeys: Map<number, string>
}

export interface StatsLogger {
  process(data: StatsLoggerData): Promise<void>
}
