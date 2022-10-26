import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'

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
    expectArraysClose(
      r.toFloat32Array(),
      values.map((v) => Math.log1p(v))
    )
  })
  /* TODO: unit tests for gradients */
})
