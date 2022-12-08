import { StatsCollector } from '../collector'
import { StatsLogger, StatsLoggerData } from '../logger'

export class StatsLoggerConsole implements StatsLogger {
  async process(data: StatsLoggerData): Promise<void> {
    const { deviceRate, hostRate, entriesByOp } = data.stats.getSummary()
    const topOps = entriesByOp
      .sort((a, b) => b[1].gflops - a[1].gflops)
      .map(([op, entry]) => `${op}=${entry.gflops.toFixed(1)}gflops/sec`)
      .slice(0, 4)
      .join(', ')

    console.log(
      `shumai -> stats> hostRate:${hostRate.gflops.toFixed(
        1
      )}gflops/sec, deviceRate:${deviceRate.gflops.toFixed(1)}gflops/sec, topOps:${topOps}`
    )
  }
}
