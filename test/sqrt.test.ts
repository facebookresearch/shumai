import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('sqrt', () => {
  it('basic', () => {
    const values = [2, 4]
    const a = sm.tensor(new Float32Array(values))
    expectArraysClose(
      sm.sqrt(a).toFloat32Array(),
      values.map((v) => Math.sqrt(v))
    )
  })
  it('propagates NaNs', () => {
    const values = [1, NaN]
    const a = sm.tensor(new Float32Array(values))
    expectArraysClose(
      sm.sqrt(a).toFloat32Array(),
      values.map((v) => Math.sqrt(v))
    )
  })
  it('gradient', () => {
    const values = [2, 4]
    const a = sm.tensor(new Float32Array(values)).requireGrad()
    const result = a.sqrt().sum()
    result.backward()
    expectArraysClose(
      a.grad.toFloat32Array(),
      values.map((v) => 1 / (2 * Math.sqrt(v)))
    )
  })
  /* TODO: unit tests for gradients */
})
