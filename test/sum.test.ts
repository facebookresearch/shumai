import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, isClose, isShape } from './utils'

describe('sum', () => {
  it('basic', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 0, 0, 1])).reshape([3, 2])
    const sum = sm.sum(t)
    expect(isClose(sum.toFloat32(), 7)).toBe(true)
  })
  it('propagates NaNs', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, NaN, 0, 1])).reshape([3, 2])
    const sum = sm.sum(t)
    expect(isClose(sum.toFloat32(), NaN)).toBe(true)
  })
  it('sums 1D Tensor', () => {
    const array = new Array(10000)
    let jsSum = 0
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 100)
      jsSum += array[i]
    }
    const t = sm.tensor(new Float32Array(array))
    const sum = sm.sum(t)
    expect(isClose(sum.toFloat32(), jsSum)).toBe(true)
  })
  it('sums axis=[0] 2D Tensor', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 0, 0, 1])).reshape([3, 2])
    const sum = sm.sum(t, [0])
    expect(isShape(sum, [2])).toBe(true)
    expectArraysClose(sum.toFloat32Array(), [4, 3])
  })
  it('sums axis=[0] 2D Tensor (keepDims = true)', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 0, 0, 1])).reshape([3, 2])
    const sum = sm.sum(t, [0], true)
    expect(isShape(sum, [1, 2])).toBe(true)
    expectArraysClose(sum.toFloat32Array(), [4, 3])
  })
  it('sums axis=[1] 2D Tensor', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 0, 0, 1])).reshape([3, 2])
    const sum = sm.sum(t, [1])
    expect(isShape(sum, [3])).toBe(true)
    expectArraysClose(sum.toFloat32Array(), [3, 3, 1])
  })
  it('sums axis=[0,1] 2D Tensor', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 0, 0, 1])).reshape([3, 2])
    const sum = sm.sum(t, [0, 1])
    expect(isShape(sum, [])).toBe(true)
    expectArraysClose(sum.toFloat32Array(), [7])
  })
  it('2D, axis=[-1,-2] in 2D array', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 0, 0, 1])).reshape([3, 2])
    const sum = sm.sum(t, [-1, -2])
    expect(isShape(sum, [])).toBe(true)
    expectArraysClose(sum.toFloat32Array(), [7])
  })
  it('4D, axis=[2, 2, 1]', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([1, 2, 2, 1])
    const sum = sm.sum(t, [0])
    expect(isShape(sum, [2, 2, 1])).toBe(true)
    expectArraysClose(sum.toFloat32Array(), [1, 2, 3, 4])
  })
  it('gradient', () => {
    const t = sm
      .tensor(new Float32Array([1, 2, 3, 0, 0, 1]))
      .reshape([3, 2])
      .requireGrad()
    const result = sm.sum(t)
    result.backward()
    expect(isShape(t.grad, t.shape)).toBe(true)
    expectArraysClose(t.grad.toFloat32Array(), [1, 1, 1, 1, 1, 1])
  })
  it('gradient (keepDims = true)', () => {
    const t = sm
      .tensor(new Float32Array([1, 2, 3, 0, 0, 1]))
      .reshape([3, 2])
      .requireGrad()
    const result = sm.sum(t, [], true)
    result.backward()
    expect(isShape(t.grad, t.shape)).toBe(true)
    expectArraysClose(t.grad.toFloat32Array(), [1, 1, 1, 1, 1, 1])
  })
  it('gradient, axis=[1]', () => {
    const t = sm
      .tensor(new Float32Array([1, 2, 3, 0, 0, 1]))
      .reshape([3, 2])
      .requireGrad()
    const result = sm.sum(t, [1]).mean()
    result.backward()
    expect(isShape(t.grad, t.shape)).toBe(true)
    expectArraysClose(t.grad.toFloat32Array(), [1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3])
  })
  it('gradient, axis=[1] (keepDims = true)', () => {
    const t = sm
      .tensor(new Float32Array([1, 2, 3, 0, 0, 1]))
      .reshape([3, 2])
      .requireGrad()
    const result = sm.sum(t, [1], true).mean()
    result.backward()
    expect(isShape(t.grad, t.shape)).toBe(true)
    expectArraysClose(t.grad.toFloat32Array(), [1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3])
  })
})
