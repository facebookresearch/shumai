import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'

describe('dispose', () => {
  it('basic', () => {
    const start_bytes = sm.bytesUsed()
    for (let i = 0; i < 1000; i++) {
      const a = sm.tensor(new Float32Array(new Array(100).fill(Math.random())))
      a.dispose()
      expect(sm.bytesUsed()).toBe(start_bytes)
    }
    expect(sm.bytesUsed()).toBe(start_bytes)
  })
})
