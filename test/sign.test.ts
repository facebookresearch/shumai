import { it, describe } from 'bun:test'
import * as sm from '@shumai/shumai'
import { expectArraysClose } from './utils'

describe('sign', () => {
  /* TODO: FIX - CURRENTLY FAILS (NaN value = 1 in output) */
  it('basic', () => {
    const t = sm.tensor(new Float32Array([1.5, 0, NaN, -1.4]))
    const r = sm.sign(t)
    expectArraysClose(r.toFloat32Array(), [1, 0, 0, -1])
  })

  /* TODO: FIX - CURRENTLY FAILS (NaN value = 1 in output) */
  it('does not propagate NaNs', () => {
    const a = sm.tensor(new Float32Array([1.5, NaN, -1.4]))
    const r = sm.sign(a)
    expectArraysClose(r.toFloat32Array(), [1, 0, -1])
  })

  /* TODO: unit tests for gradients */
})
