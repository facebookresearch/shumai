import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, isClose, isShape } from './utils'

describe('mean', () => {
  it('basic', () => {
    const t = sm
      .tensor(
        new Float32Array([
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
          25, 26, 27, 28, 29, 30, 31
        ])
      )
      .reshape([16, 2])
    const mean = sm.mean(t)

    expect(isClose(mean.toFloat32(), 15.5)).toBe(true)
  })
  it('propagates NaNs', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, NaN, 0, 1])).reshape([3, 2])
    const mean = sm.mean(t)
    expect(isClose(mean.toFloat32(), NaN)).toBe(true)
  })
  it('works for 1D Tensor', () => {
    const t = sm.tensor(new Float32Array([3, 1, 5, 2, 4]))
    const mean = sm.mean(t)
    expect(isClose(mean.toFloat32(), 3)).toBe(true)
  })
  it('works for 2D Tensor; keep_dims=true', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 0, 0, 1])).reshape([3, 2])
    const mean = t.mean([], true)
    expect(isShape(mean, [1, 1])).toBe(true)
    expect(isClose(mean.toFloat32(), 7 / 6)).toBe(true)
  })
  it('2D Tensor; axis=[0]', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 0, 0, 1])).reshape([3, 2])
    const mean = sm.mean(t, [0])
    expect(isShape(mean, [2])).toBe(true)
    expectArraysClose(mean.toFloat32Array(), [4 / 3, 1])
  })
  it('2D Tensor; axis=[0], keep_dims=true', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 0, 0, 1])).reshape([3, 2])
    const mean = sm.mean(t, [0], true)
    expect(isShape(mean, [1, 2])).toBe(true)
    expectArraysClose(mean.toFloat32Array(), [4 / 3, 1])
  })
  it('2D Tensor; axis=[1]', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 0, 0, 1])).reshape([3, 2])
    const mean = sm.mean(t, [1])
    expect(isShape(mean, [3])).toBe(true)
    expectArraysClose(mean.toFloat32Array(), [1.5, 1.5, 0.5])
  })
  it('2D Tensor; axis=[-1]', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 0, 0, 1])).reshape([3, 2])
    const mean = sm.mean(t, [-1])
    expect(isShape(mean, [3])).toBe(true)
    expectArraysClose(mean.toFloat32Array(), [1.5, 1.5, 0.5])
  })
  it('2D Tensor; axis=[0,1]', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 0, 0, 1])).reshape([3, 2])
    const mean = sm.mean(t, [0, 1])
    expect(isShape(mean, [])).toBe(true)
    expectArraysClose(mean.toFloat32Array(), [7 / 6])
  })
  it('gradient', () => {
    const t = sm
      .tensor(new Float32Array([1, 2, 3, 0, 0, 1]))
      .reshape([3, 2])
      .requireGrad()
    const result = sm.mean(t)
    result.backward()
    expect(isShape(t.grad, t.shape)).toBe(true)
    expectArraysClose(t.grad.toFloat32Array(), [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6])
  })
  it('gradient (keepDims = true)', () => {
    const t = sm
      .tensor(new Float32Array([1, 2, 3, 0, 0, 1]))
      .reshape([3, 2])
      .requireGrad()
    const result = sm.mean(t, [], true)
    result.backward()
    expect(isShape(t.grad, t.shape)).toBe(true)
    expectArraysClose(t.grad.toFloat32Array(), [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6])
  })
  it('gradient, axis=[1]', () => {
    const t = sm
      .tensor(new Float32Array([1, 2, 3, 0, 0, 1]))
      .reshape([3, 2])
      .requireGrad()
    const result = sm.mean(t, [1]).sum()
    result.backward()
    expect(isShape(t.grad, t.shape)).toBe(true)
    expectArraysClose(t.grad.toFloat32Array(), [1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2])
  })
  it('gradient, axis=[1] (keepDims = true)', () => {
    const t = sm
      .tensor(new Float32Array([1, 2, 3, 0, 0, 1]))
      .reshape([3, 2])
      .requireGrad()
    const result = sm.mean(t, [1], true).sum()
    result.backward()
    expect(isShape(t.grad, t.shape)).toBe(true)
    expectArraysClose(t.grad.toFloat32Array(), [1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2, 1 / 2])
  })
})
