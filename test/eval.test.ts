import * as sm from '@shumai/shumai'

import { it, describe, expect } from 'bun:test'
import { logBenchmarkInfo } from './utils'

describe('eval (memtest)', () => {
  it('basic', () => {
    const a = sm.full([1024 * 8], 1)
    const iters = 10000
    const t0 = performance.now()
    let b = a
    for (let i = 0; i < iters; i++) {
      b = b.add(a)
    }
    const o = b.toFloat32Array()[0]
    const t1 = performance.now()
    expect(o).toBe(10001)
    logBenchmarkInfo(t0, t1, iters, o)
  })
})
