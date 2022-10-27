import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, isShape } from './utils'

describe('flip', () => {
  /* TODO: FIX - CURRENTLY FAILS */
  it('basic (1D Tensor)', () => {
    const t = sm.tensor(new Float32Array([0, 1, 2, 3]))
    const r = sm.flip(t, 0)
    expect(isShape(r, [4])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [3, 2, 1, 0])

    const t2 = sm.tensor(new Float32Array([12345678, 2, 1, 0]))
    const r2 = sm.flip(t2, 0)
    expect(isShape(r2, [4])).toBe(true)
    expectArraysClose(r2.toFloat32Array(), [0, 1, 2, 12345678])
  })

  /* TODO: unit tests for gradients */
})
