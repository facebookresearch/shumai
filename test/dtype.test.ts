import { it, describe, expect } from 'bun:test'
import * as sm from '@shumai/shumai'

describe('asType/dType', () => {
  it('basic', () => {
    for (let i = 0; i < 256; i++) {
      const t = sm
        .tensor(new Float32Array(new Array(10).map(() => Math.random())))
        .asType(sm.dtype.Float64)
      expect(t.dType).toBe(sm.dtype.Float64)

      const t2 = t.asType(sm.dtype.Int32)
      expect(t2.dType).toBe(sm.dtype.Int32)

      const t3 = t2.asType(sm.dtype.Float32)
      expect(t3.dType).toBe(sm.dtype.Float32)
    }
  })
})
