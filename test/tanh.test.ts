import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('tanh', () => {
  it('basic', () => {
    const values = [1, -3, 2, 7, -4]
    const a = sm.tensor(new Float32Array([1, -3, 2, 7, -4]))
    const r = sm.tanh(a)
    expectArraysClose(
      r.toFloat32Array(),
      values.map((v) => Math.tanh(v))
    )
  })
  it('propagates NaNs', () => {
    const values = [4, NaN, 0]
    const a = sm.tensor(new Float32Array(values))
    const r = sm.tanh(a)
    expectArraysClose(
      r.toFloat32Array(),
      values.map((v) => Math.tanh(v))
    )
  })
})
