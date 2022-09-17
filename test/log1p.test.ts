import { it, describe, expect } from 'bun:test'
import * as sm from '@shumai/shumai'
import { expectArraysClose, isShape } from './utils'

describe('log1p', () => {
  it('basic', () => {
    const values = [1, 2]
    const a = sm.tensor(new Float32Array(values))
    const r = sm.log1p(a)
    expectArraysClose(
      r.toFloat32Array(),
      values.map((v) => Math.log1p(v))
    )
  })
  it('propagates NaNs', () => {
    const values = [1, NaN]
    const a = sm.tensor(new Float32Array(values))
    const r = a.log1p()
    expect(isShape(r, [2, 2]))
    expectArraysClose(
      r.toFloat32Array(),
      values.map((v) => Math.log1p(v))
    )
  })
  /* TODO: unit tests for gradients */
})
