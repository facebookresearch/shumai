import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { areSameShape, expectArraysClose, isClose } from './utils'

describe('serialization', () => {
  it('1D Tensor', () => {
    const a = sm.tensor(new Float32Array([1, 0, 3, 2]))
    const rand = Math.round(1e8 * Math.random())
    a.save(`/tmp/a_${rand}`)
    const b = sm.tensor(`/tmp/a_${rand}`)
    expect(areSameShape(a, b)).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('2D Tensor', () => {
    const a = sm.randn([8, 8])
    const rand = Math.round(1e8 * Math.random())
    a.save(`/tmp/a_${rand}`)
    const b = sm.tensor(`/tmp/a_${rand}`)
    expect(areSameShape(a, b)).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('Scalar', () => {
    const a = sm.scalar(77)
    const rand = Math.round(1e8 * Math.random())
    a.save(`/tmp/a_${rand}`)
    const b = sm.tensor(`/tmp/a_${rand}`)
    expect(areSameShape(a, b)).toBe(true)
    expect(isClose(a.toFloat32(), b.toFloat32()))
  })
})
