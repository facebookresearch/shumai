import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { areSameShape, expectArraysClose, expectThrows, isClose } from './utils'

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

describe('encode/decode Binary', () => {
  it('1D Tensor', () => {
    const a = sm.tensor(new Float32Array([1, 0, 3, 2]))
    const a_buf = sm.io.encodeBinary(a)
    const b = sm.io.decodeBinary(a_buf)
    expect(areSameShape(a, b)).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('2D Tensor', () => {
    const a = sm.randn([8, 8])
    const a_buf = sm.io.encodeBinary(a)
    const b = sm.io.decodeBinary(a_buf)
    expect(areSameShape(a, b)).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('Scalar', () => {
    const a = sm.scalar(77)
    const a_buf = sm.io.encodeBinary(a)
    const b = sm.io.decodeBinary(a_buf)
    expect(areSameShape(a, b)).toBe(true)
    expect(isClose(a.toFloat32(), b.toFloat32()))
  })
})

describe('encode/decode Base64', () => {
  it('1D Tensor', () => {
    const a = sm.tensor(new Float32Array([1, 0, 3, 2]))
    const a_buf = sm.io.encodeBase64(a)
    const b = sm.io.decodeBase64(a_buf)
    expect(areSameShape(a, b)).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('2D Tensor', () => {
    const a = sm.randn([8, 8])
    const a_buf = sm.io.encodeBase64(a)
    const b = sm.io.decodeBase64(a_buf)
    expect(areSameShape(a, b)).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('Scalar', () => {
    const a = sm.scalar(77)
    const a_buf = sm.io.encodeBase64(a)
    const b = sm.io.decodeBase64(a_buf)
    expect(areSameShape(a, b)).toBe(true)
    expect(isClose(a.toFloat32(), b.toFloat32()))
  })
})

describe('encode/decode Readable', () => {
  it('1D Tensor', () => {
    const a = sm.tensor(new Float32Array([1, 0, 3, 2]))
    const a_buf = '[1, 0, 3, 2]: Float32'
    const b = sm.io.decodeReadable(a_buf)
    expect(areSameShape(a, b)).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('2D Tensor', () => {
    const a = sm.tensor(new Float32Array([1, 0, 3, 2])).reshape([2, 2])
    const a_buf = '[[1, 0], [3, 2]]: Float32'
    const b = sm.io.decodeReadable(a_buf)
    expect(areSameShape(a, b)).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('2D Tensor encode', () => {
    const t = sm.tensor(new Float32Array([77, 1, 2, 4])).reshape([2, 2])
    const encoding = sm.io.encodeReadable(t)
    expect(encoding).toBe('[[77, 1], [2, 4]]:Float32')
  })
  it('Ragged Tensor (unsupported)', () => {
    const a_buf = '[[1, 0], [3, 2, 4]]: Float32'
    expectThrows(() => {
      sm.io.decodeReadable(a_buf)
    })
  })
  it('Scalar', () => {
    const a = sm.scalar(77)
    const a_buf = '77: Float32'
    const b = sm.io.decodeReadable(a_buf)
    expect(areSameShape(a, b)).toBe(true)
    expect(isClose(a.toFloat32(), b.toFloat32()))
  })
})
