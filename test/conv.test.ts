import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, isShape } from './utils'

describe('conv', () => {
  it('simple', () => {
    const x = sm.full([1, 1, 4, 4], 1)
    const w = sm.full([1, 1, 3, 3], 1)
    const y = sm.conv2d(x, w)
    expect(isShape(y, [1, 1, 2, 2])).toBe(true)
    expectArraysClose(y.toFloat32Array(), sm.full([2, 2], 9).toFloat32Array())
  })
  it('simple grad', () => {
    const x = sm.full([1, 1, 4, 4], 1).requireGrad()
    const w = sm.full([1, 1, 3, 3], 1)
    const y = sm.conv2d(x, w)
    y.backward(sm.full([1, 1, 2, 2], 1))
    expect(isShape(x.grad, [1, 1, 4, 4])).toBe(true)
    expectArraysClose(
      x.grad.toFloat32Array(),
      new Float32Array([1, 2, 2, 1, 2, 4, 4, 2, 2, 4, 4, 2, 1, 2, 2, 1])
    )
  })
  it('padded', () => {
    const x = sm.full([1, 1, 3, 3], 1)
    const w = sm.full([1, 1, 3, 3], 1)
    const y = sm.conv2d(x, w, 1, 1, 1, 1)
    expect(isShape(y, [1, 1, 3, 3])).toBe(true)
    expectArraysClose(y.toFloat32Array(), new Float32Array([4, 6, 4, 6, 9, 6, 4, 6, 4]))
  })
  it('padded grad', () => {
    const x = sm.full([1, 1, 3, 3], 1).requireGrad()
    const w = sm.full([1, 1, 3, 3], 1)
    const y = sm.conv2d(x, w, 1, 1, 1, 1)
    y.backward(sm.full([1, 1, 3, 3], 1))
    expect(isShape(x.grad, [1, 1, 3, 3])).toBe(true)
    expectArraysClose(x.grad.toFloat32Array(), new Float32Array([4, 6, 4, 6, 9, 6, 4, 6, 4]))
  })
  it('strided', () => {
    const x = sm.full([1, 1, 6, 6], 1)
    const w = sm.full([1, 1, 3, 3], 1)
    const y = sm.conv2d(x, w, 1, 1, 0, 0, 2, 2)
    expect(isShape(y, [1, 1, 2, 2])).toBe(true)
    expectArraysClose(y.toFloat32Array(), sm.full([2, 2], 9).toFloat32Array())
  })
})

describe('avgPool', () => {
  it('basic', () => {
    const x = sm.full([1, 1, 4, 4], 3)
    const y = x.avgPool2d(3, 3)
    expectArraysClose(y.toFloat32Array(), sm.full([2, 2], 3).toFloat32Array())
  })
  it('channels', () => {
    const x = sm.full([3, 2, 4, 4], 3)
    const y = x.avgPool2d(3, 3)
    expectArraysClose(y.toFloat32Array(), sm.full([3, 2, 2, 2], 3).toFloat32Array())
  })
  it('strided', () => {
    const x = sm.full([1, 1, 5, 5], 3)
    const y = x.avgPool2d(2, 2, 2, 2)
    expectArraysClose(y.toFloat32Array(), sm.full([2, 2], 3).toFloat32Array())
  })
})

describe('module.avgPool2d', () => {
  it('basic', () => {
    const x = sm.full([1, 1, 4, 4], 3)
    const f = sm.module.avgPool2d(2)
    expectArraysClose(f(x).toFloat32Array(), sm.full([2, 2], 3).toFloat32Array())
  })
  it('channels', () => {
    const x = sm.full([3, 2, 4, 4], 3)
    const f = sm.module.avgPool2d(3, { stride: 1 })
    const y = f(x)
    expectArraysClose(y.toFloat32Array(), sm.full([3, 2, 2, 2], 3).toFloat32Array())
  })
})

describe('conv2d module', () => {
  it('basic', () => {
    const x = sm.randn([1, 8, 64, 64])
    const l = sm.module.conv2d(8, 12, 3, { stride: 2 })
    const y = l(x)
    expect(isShape(y, [1, 12, 31, 31])).toBe(true)
  })
})
