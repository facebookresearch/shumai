import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { areSameShape, expectArraysClose } from './utils'

describe('network', () => {
  it('encode', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    const b = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    const abuf = sm.io.encodeBinary(a)
    const bbuf = sm.io.encodeBinary(b)
    expectArraysClose(new Uint8Array(abuf), new Uint8Array(bbuf))
  })
  it('decode', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    const abuf = sm.io.encodeBinary(a)
    const { tensor: b } = sm.io.decodeBinary(abuf)
    const { tensor: c } = sm.io.decodeBinary(abuf)
    expectArraysClose(b.toFloat32Array(), c.toFloat32Array())
    expect(areSameShape(b, c)).toBe(true)
  })
  it('encode then decode', async () => {
    const a = sm.randn([128, 128])
    const abuf = sm.io.encodeBinary(a)
    const { tensor: b } = sm.io.decodeBinary(abuf)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
    expect(areSameShape(a, b)).toBe(true)
  })
})
