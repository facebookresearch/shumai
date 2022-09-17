import { it, describe } from 'bun:test'
import * as sm from '@shumai/shumai'
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
  /* TODO: unit tests for gradients */
})
