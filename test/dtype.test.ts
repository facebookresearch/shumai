import { it, describe, expect } from 'bun:test'
import * as sm from '@shumai/shumai'

describe('asType/dType', () => {
  it('basic', () => {
    const t = sm.tensor(new Float32Array([-0.25, 0.25, 0.5, 0.75, -0.4])).asType(sm.dtype.Float64)
    expect(t.dType).toBe(sm.dtype.Float64)

    const t2 = t.asType(sm.dtype.Int32)
    expect(t2.dType).toBe(sm.dtype.Int32)

    const t3 = t2.asType(sm.dtype.Float32)
    expect(t3.dType).toBe(sm.dtype.Float32)
  })
})
