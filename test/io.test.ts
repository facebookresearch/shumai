import * as sm from '@shumai/shumai'
import { it, expect, describe } from 'bun:test'
import { areSameShape, expectArraysClose } from './utils'

describe('io', () => {
  it('encode', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    const b = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    const abuf = sm.io.encode(a)
    const bbuf = sm.io.encode(b)
    expectArraysClose(new Uint8Array(abuf), new Uint8Array(bbuf))
  })
  it('decode', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    const abuf = sm.io.encode(a)
    const b = sm.io.decode(abuf)
    const c = sm.io.decode(abuf)
    expectArraysClose(b.toFloat32Array(), c.toFloat32Array())
    expect(areSameShape(b, c)).toBe(true)
  })
  it('encode then decode', () => {
    const a = sm.randn(128, 128)
    const abuf = sm.io.encode(a)
    const b = sm.io.decode(abuf)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
    expect(areSameShape(a, b)).toBe(true)
  })
})
