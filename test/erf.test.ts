import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, isClose } from './utils'

describe('erf', () => {
  it('basic', () => {
    const t = sm.tensor(new Float32Array([-0.25, 0.25, 0.5, 0.75, -0.4]))
    const r = sm.erf(t)
    expectArraysClose(r.toFloat32Array(), [-0.2763264, 0.2763264, 0.5204999, 0.7111556, -0.4283924])
  })
  it('blowup', () => {
    const t = sm.tensor(new Float32Array([-1.4, -2.5, -3.1, -4.4]))
    const r = sm.erf(t)
    expectArraysClose(r.toFloat32Array(), [-0.9522852, -0.999593, -0.9999883, -1])
  })
  it('scalar', () => {
    const t = sm.scalar(1)
    const r = sm.erf(t)
    expect(isClose(r.toFloat32(), 0.8427008)).toBe(true)
  })
  it('2D Tensor', () => {
    const t = sm.tensor(new Float32Array([0.2, 0.3, 0.4, 0.5])).reshape([2, 2])
    const r = sm.erf(t)
    expectArraysClose(r.toFloat32Array(), [0.2227026, 0.32862678, 0.42839235, 0.5204999])
  })
  it('propagates NaNs', () => {
    const a = sm.tensor(new Float32Array([0.5, NaN, 0]))
    const res = sm.erf(a)
    expectArraysClose(res.toFloat32Array(), [0.5204999, NaN, 0.0])
  })
  /* TODO: unit tests for gradients */
})
