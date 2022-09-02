import { it, describe } from 'bun:test'
import * as sm from '@shumai/shumai'
import { expectArraysClose } from './utils'

describe('isnan', () => {
  /* TODO: FIX - CURRENTLY FAILS */
  it('basic', () => {
    const a = sm.tensor(new Float32Array([NaN, 3, 0, 1]))
    const r = sm.isnan(a)
    expectArraysClose(r.toFloat32Array(), [1, 0, 0, 0])
  })

  /* TODO: FIX - CURRENTLY FAILS */
  it('basic with +/- Infinity', () => {
    const a = sm.tensor(new Float32Array([NaN, Infinity, -Infinity, 0, 1]))
    const r = sm.isnan(a)
    expectArraysClose(r.toFloat32Array(), [1, 0, 0, 0, 0])
  })

  /* TODO: unit tests for gradients once supported */
})
