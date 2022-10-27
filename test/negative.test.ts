import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('negative', () => {
  it('basic', () => {
    const t = sm.tensor(new Float32Array([1, -3, 2, 7, -4]))
    const r = sm.negative(t)
    expectArraysClose(r.toFloat32Array(), [-1, 3, -2, -7, 4])
  })
  it('should work with larger numbers', () => {
    const t2 = sm.tensor(new Float32Array([1, 10, -3405123, 230538, -2]))
    const r2 = t2.negative()
    expectArraysClose(r2.toFloat32Array(), [-1, -10, 3405123, -230538, 2])
  })
  it('propagates NaNs', () => {
    const t = sm.tensor(new Float32Array([1, -3, NaN, 7, -10234]))
    const r = sm.negative(t)
    expectArraysClose(r.toFloat32Array(), [-1, 3, NaN, -7, 10234])
  })
  /* TODO: unit tests for gradients */
})
