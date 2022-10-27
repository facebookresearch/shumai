import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('cos', () => {
  it('basic', () => {
    const values = [1, 3, 4, 6, 7, 9, 10, 12, -1, -3, -4, -6, -7, -9, -10, -12]
    const a = sm.tensor(new Float32Array(values))
    const r = sm.cos(a)
    expectArraysClose(
      r.toFloat32Array(),
      values.map((v) => Math.cos(v))
    )
  })
  it('propagates NaNs', () => {
    const a = sm.tensor(new Float32Array([4, NaN, 0]))
    const r = sm.cos(a)
    expectArraysClose(r.toFloat32Array(), [Math.cos(4), NaN, Math.cos(0)])
  })
  /* TODO: unit tests for gradients */
})
