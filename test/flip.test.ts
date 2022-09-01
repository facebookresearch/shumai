import { it, describe, expect } from 'bun:test'
import * as sm from '@shumai/shumai'
import { expectArraysClose, isShape } from './utils'

describe('flip', () => {
  it('basic (1D Tensor)', () => {
    const t = sm.tensor(new Float32Array([0, 1, 2, 3]))
    const r = sm.flip(t, 1)
    expect(isShape(r, [4])).toBe(true)
    expectArraysClose(<Float32Array>r.valueOf(), [3, 2, 1, 0])

    const t2 = sm.tensor(new Float32Array([12345678, 2, 1, 0]))
    const r2 = sm.flip(t2, 1)
    expect(isShape(r2, [4])).toBe(true)
    expectArraysClose(<Float32Array>r2.valueOf(), [0, 1, 2, 12345678])
  })

  /* TODO: unit tests for gradients once supported */
})
