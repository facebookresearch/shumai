import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'

describe('dispose', () => {
  // currently segfaults; seems to GC twice
  it('basic', () => {
    const start_bytes = sm.bytesUsed()
    for (let i = 0; i < 1000; i++) {
      // Bun.gc(true)
      const a = sm.tensor(new Float32Array([0, 1, 2, 3]))
      a.dispose()
      expect(sm.bytesUsed()).toBe(start_bytes)
      // Bun.gc(true)
    }
    expect(sm.bytesUsed()).toBe(start_bytes)
  })
})
