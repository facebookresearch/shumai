import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'

describe('async', () => {
  it('sleep', async () => {
    const t0 = performance.now()
    await sm.util.sleep(100)
    const t1 = performance.now()
    // we shouldn't be fininshed before 100
    expect(t1 - t0 > 99).toBe(true)
  })
  it('await all', async () => {
    const t0 = performance.now()
    const vals = await sm.util.all(
      sm.util.sleep(100),
      sm.util.sleep(100),
      sm.util.sleep(100),
      (async () => {
        return 8
      })()
    )
    const t1 = performance.now()
    // should be run in parallel
    expect(t1 - t0 < 300).toBe(true)
    expect(vals[3]).toBe(8)
  })
})
