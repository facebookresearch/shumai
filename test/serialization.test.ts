import { it, describe, expect } from 'bun:test'
import * as sm from '@shumai/shumai'
import { expectArraysClose, areSameShape, isClose } from './utils'

describe('serialization', () => {
  it('1D Tensor', () => {
    const a = sm.tensor(new Float32Array([1, 0, 3, 2]))
    a.save('/tmp/a')
    const b = sm.tensor('/tmp/a')
    expect(areSameShape(a, b)).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('2D Tensor', () => {
    const a = sm.randn([8, 8])
    a.save('/tmp/a')
    const b = sm.tensor('/tmp/a')
    expect(areSameShape(a, b)).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('Scalar', () => {
    const a = sm.scalar(77)
    a.save('/tmp/a')
    const b = sm.tensor('/tmp/a')
    expect(areSameShape(a, b)).toBe(true)
    expect(isClose(a.toFloat32(), b.toFloat32()))
  })
})
