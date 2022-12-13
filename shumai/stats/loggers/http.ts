import assert from 'assert'
import { jsonStringifyHandler } from '../../io/encode'
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

    const statsRaw = data.stats.toJSON({ computeRates: false, includeRemotes: true })

    const body = JSON.stringify(statsRaw, jsonStringifyHandler)

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
