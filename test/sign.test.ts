import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('sign', () => {
  it('basic', () => {
    const t = sm.tensor(new Float32Array([1.5, 0, NaN, -1.4]))
    const r = sm.sign(t)
    expectArraysClose(r.toFloat32Array(), [1, 0, 1, -1])
  })
  it('does not propagate NaNs', () => {
    const a = sm.tensor(new Float32Array([1.5, NaN, -1.4]))
    const r = sm.sign(a)
    expectArraysClose(r.toFloat32Array(), [1, 1, -1])
  })
  /* TODO: unit tests for gradients */
})
