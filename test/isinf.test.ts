import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('isinf', () => {
  it('basic', () => {
    const a = sm.tensor(new Float32Array([Infinity, 3, -Infinity, 1]))
    const r = sm.isinf(a)
    expectArraysClose(r.toFloat32Array(), [1, 0, 1, 0])
  })
  it('basic with NaN', () => {
    const a = sm.tensor(new Float32Array([NaN, Infinity, -Infinity, 0, 1]))
    const r = sm.isinf(a)
    expectArraysClose(r.toFloat32Array(), [0, 1, 1, 0, 0])
  })
  /* TODO: unit tests for gradients */
})
