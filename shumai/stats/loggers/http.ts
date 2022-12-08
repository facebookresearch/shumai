import assert from 'assert'
import * as console from 'console'
import { StatsLogger, StatsLoggerData } from '../logger'

export type StatsLoggerHttpOptions = {
  url: string
  method?: string
}

export class StatsLoggerHttp implements StatsLogger {
  #options: StatsLoggerHttpOptions

  constructor(options: StatsLoggerHttpOptions) {
    assert(options?.url, 'url is required')

    this.#options = options
  }

  process(data: StatsLoggerData): Promise<void> {
    const { url, ...otherOptions } = this.#options

    const { deviceRate, hostRate, entriesByOp, entriesByStack } = data.stats.getSummary()

    const { hostId, processId, deviceId } = data.stats

    const endTime = Date.now()
    const startTime = endTime - data.stats.interval

    const body = JSON.stringify(
      {
        startTime,
        endTime,
        hostId,
        processId,
        deviceId,
        deviceRate,
        hostRate,
        ops: entriesByOp,
        stacks: entriesByStack
      },
      (key, value) => {
        if (typeof value === 'bigint') {
          return Number(value)
        }
        return value
      },
      2
    )

    return fetch(url, {
      method: 'POST',
      ...otherOptions,
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }).catch((err) => {
      // no retry support for now, just log
      console.error('shumai -> stats> http logger failed', err)
    })
  }
}
