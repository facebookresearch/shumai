import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('sigmoid', () => {
  it('basic', () => {
    const values = [1, -3, 2, 7, -4]
    const t = sm.tensor(new Float32Array(values))
    const r = sm.sigmoid(t)
    const expect: number[] = []
    for (let i = 0; i < t.elements; i++) {
      expect[i] = 1 / (1 + Math.exp(-values[i]))
    }
    expectArraysClose(r.toFloat32Array(), expect)
  })
  /* TODO: FIX - CURRENTLY FAILS (Throws C++ Exception)
    it('6D Tensor', () => {
      const shape = [2, 2, 2, 2, 2, 2]
      const values = new Array(calcSizeFromShape(shape)).fill(1)
      const t = sm.tensor(new Float32Array(values)).reshape(shape)
      const r = sm.sigmoid(t)
      const expect: number[] = []
      for (let i = 0; i < t.elements; i++) {
        expect[i] = 1 / (1 + Math.exp(-1.0))
      }
      expectArraysClose(r.toFloat32Array(), expect)
    })
  */
  it('propagates NaNs', () => {
    const values = [3, NaN]
    const t = sm.tensor(new Float32Array(values))
    const r = sm.sigmoid(t)
    expectArraysClose(r.toFloat32Array(), [1 / (1 + Math.exp(-3)), NaN])
  })
  /* TODO: unit tests for gradients */
})
