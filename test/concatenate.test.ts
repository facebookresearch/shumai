import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, expectThrows, isShape, nativeError } from './utils'

describe('concatenate', () => {
  it('scalar tensors invalid dims', () => {
    const a = sm.scalar(0)
    const b = sm.scalar(10)

    expectThrows(() => sm.concatenate([a, b], 0), nativeError)
    expectThrows(() => sm.concatenate([a, b], 1), nativeError)
  })
  it('scalar tensors expand dims', () => {
    const a = sm.scalar(0)
    const b = sm.scalar(10)
    const result0 = sm.concatenate([a, b], -1)
    const expectedArray0 = new Float32Array([0, 10])
    const expectedShape0 = [2]
    expectArraysClose(result0.toFloat32Array(), expectedArray0)
    expect(isShape(result0, expectedShape0)).toBe(true)

    const result1 = sm.concatenate([a, b], -2)
    const expectedArray1 = expectedArray0
    const expectedShape1 = [2, 1]
    expectArraysClose(result1.toFloat32Array(), expectedArray1)
    expect(isShape(result1, expectedShape1)).toBe(true)
  })
  it('1D tensors', () => {
    const a = sm.tensor(new Float32Array([0, 1, 2, 3, 4, 5]))
    const b = sm.tensor(new Float32Array([10, 11, 12, 13, 14, 15]))

    const result = sm.concatenate([a, b], 0)
    const expectedArray = new Float32Array([0, 1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15])
    const expectedShape = [12]
    expectArraysClose(result.toFloat32Array(), expectedArray)
    expect(isShape(result, expectedShape)).toBe(true)
  })
  it('1D tensors different sizes', () => {
    const a = sm.tensor(new Float32Array([0, 1, 2, 3, 4, 5]))
    const b = sm.tensor(new Float32Array([10, 11, 12]))

    const result = sm.concatenate([a, b], 0)
    const expectedArray = new Float32Array([0, 1, 2, 3, 4, 5, 10, 11, 12])
    const expectedShape = [9]
    expectArraysClose(result.toFloat32Array(), expectedArray)
    expect(isShape(result, expectedShape)).toBe(true)
  })
  it('1D singleton tensors', () => {
    const a = sm.tensor(new Float32Array([0]))
    const b = sm.tensor(new Float32Array([10]))

    const result = sm.concatenate([a, b], 0)
    const expectedArray = new Float32Array([0, 10])
    const expectedShape = [2]
    expectArraysClose(result.toFloat32Array(), expectedArray)
    expect(isShape(result, expectedShape)).toBe(true)
  })
  it('1D tensors last dim', () => {
    const a = sm.tensor(new Float32Array([0, 1, 2, 3, 4, 5]))
    const b = sm.tensor(new Float32Array([10, 11, 12, 13, 14, 15]))

    const result = sm.concatenate([a, b], -1)
    const expectedArray = new Float32Array([0, 1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15])
    const expectedShape = [12]
    expectArraysClose(result.toFloat32Array(), expectedArray)
    expect(isShape(result, expectedShape)).toBe(true)
  })
  it('1D tensors expand dims', () => {
    const a = sm.tensor(new Float32Array([0, 1, 2, 3, 4, 5]))
    const b = sm.tensor(new Float32Array([10, 11, 12, 13, 14, 15]))

    const result0 = sm.concatenate([a, b], -2)
    const expectedArray0 = new Float32Array([0, 1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15])
    const expectedShape0 = [2, 6]
    expectArraysClose(result0.toFloat32Array(), expectedArray0)
    expect(isShape(result0, expectedShape0)).toBe(true)

    const result1 = sm.concatenate([a, b], -3)
    const expectedArray1 = expectedArray0
    const expectedShape1 = [2, 1, 6]
    expectArraysClose(result1.toFloat32Array(), expectedArray1)
    expect(isShape(result1, expectedShape1)).toBe(true)
  })
  it('1D tensors invalid dim', () => {
    const a = sm.tensor(new Float32Array([0, 1, 2, 3, 4, 5]))
    const b = sm.tensor(new Float32Array([10, 11, 12, 13, 14, 15]))

    expectThrows(() => sm.concatenate([a, b], 1), nativeError)
  })
  it('1D tensors multiple', () => {
    const tensors = Array.from(Array(4), (x, i) =>
      sm.tensor(new Float32Array([i * 10, i * 10 + 1, i * 10 + 2]))
    )

    const result = sm.concatenate(tensors, 0)
    const expectedArray = new Float32Array([0, 1, 2, 10, 11, 12, 20, 21, 22, 30, 31, 32])
    const expectedShape = [12]
    expectArraysClose(result.toFloat32Array(), expectedArray)
    expect(isShape(result, expectedShape)).toBe(true)
  })
  it('1D tensors too many', () => {
    const tensors = Array.from(Array(5), (x, i) =>
      sm.tensor(new Float32Array([i * 10, i * 10 + 1, i * 10 + 2]))
    )
    expectThrows(() => sm.concatenate(tensors, 0), nativeError)
  })
  it('2D tensors', () => {
    const a = sm.tensor(new Float32Array([0, 1, 2, 3, 4, 5])).reshape([3, 2])
    const b = sm.tensor(new Float32Array([10, 11, 12, 13, 14, 15])).reshape([3, 2])

    const result0 = sm.concatenate([a, b], 0)
    const expectedArray0 = new Float32Array([0, 1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15])
    const expectedShape0 = [6, 2]
    expectArraysClose(result0.toFloat32Array(), expectedArray0)
    expect(isShape(result0, expectedShape0)).toBe(true)

    const result1 = sm.concatenate([a, b], 1)
    const expectedArray1 = new Float32Array([0, 1, 10, 11, 2, 3, 12, 13, 4, 5, 14, 15])
    const expectedShape1 = [3, 4]
    expectArraysClose(result1.toFloat32Array(), expectedArray1)
    expect(isShape(result1, expectedShape1)).toBe(true)
  })
  it('2D tensors different sizes', () => {
    const a0 = sm.tensor(new Float32Array([0, 1, 2, 3, 4, 5])).reshape([3, 2])
    const b0 = sm.tensor(new Float32Array([10, 11])).reshape([1, 2])

    const result0 = sm.concatenate([a0, b0], 0)
    const expectedArray0 = new Float32Array([0, 1, 2, 3, 4, 5, 10, 11])
    const expectedShape0 = [4, 2]
    expectArraysClose(result0.toFloat32Array(), expectedArray0)
    expect(isShape(result0, expectedShape0)).toBe(true)

    const a1 = sm.tensor(new Float32Array([0, 1, 2, 3, 4, 5])).reshape([3, 2])
    const b1 = sm.tensor(new Float32Array([10, 11, 12])).reshape([3, 1])

    const result1 = sm.concatenate([a1, b1], 1)
    const expectedArray1 = new Float32Array([0, 1, 10, 2, 3, 11, 4, 5, 12])
    const expectedShape1 = [3, 3]
    expectArraysClose(result1.toFloat32Array(), expectedArray1)
    expect(isShape(result1, expectedShape1)).toBe(true)
  })
  it('2D singleton tensors', () => {
    const a = sm.tensor(new Float32Array([0])).reshape([1, 1])
    const b = sm.tensor(new Float32Array([10])).reshape([1, 1])

    const result0 = sm.concatenate([a, b], 0)
    const expectedArray0 = new Float32Array([0, 10])
    const expectedShape0 = [2, 1]
    expectArraysClose(result0.toFloat32Array(), expectedArray0)
    expect(isShape(result0, expectedShape0)).toBe(true)

    const result1 = sm.concatenate([a, b], 1)
    const expectedArray1 = expectedArray0
    const expectedShape1 = [1, 2]
    expectArraysClose(result1.toFloat32Array(), expectedArray1)
    expect(isShape(result1, expectedShape1)).toBe(true)
  })
  it('2D tensors last dims', () => {
    const a = sm.tensor(new Float32Array([0, 1, 2, 3, 4, 5])).reshape([3, 2])
    const b = sm.tensor(new Float32Array([10, 11, 12, 13, 14, 15])).reshape([3, 2])

    const result1 = sm.concatenate([a, b], -1)
    const expectedArray1 = new Float32Array([0, 1, 10, 11, 2, 3, 12, 13, 4, 5, 14, 15])
    const expectedShape1 = [3, 4]
    expectArraysClose(result1.toFloat32Array(), expectedArray1)
    expect(isShape(result1, expectedShape1)).toBe(true)

    const result0 = sm.concatenate([a, b], -2)
    const expectedArray0 = new Float32Array([0, 1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15])
    const expectedShape0 = [6, 2]
    expectArraysClose(result0.toFloat32Array(), expectedArray0)
    expect(isShape(result0, expectedShape0)).toBe(true)
  })
  it('2D tensors expand dims', () => {
    const a = sm.tensor(new Float32Array([0, 1, 2, 3, 4, 5])).reshape([3, 2])
    const b = sm.tensor(new Float32Array([10, 11, 12, 13, 14, 15])).reshape([3, 2])

    const result0 = sm.concatenate([a, b], -3)
    const expectedArray0 = new Float32Array([0, 1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15])
    const expectedShape0 = [2, 3, 2]
    expectArraysClose(result0.toFloat32Array(), expectedArray0)
    expect(isShape(result0, expectedShape0)).toBe(true)

    const result1 = sm.concatenate([a, b], -4)
    const expectedArray1 = expectedArray0
    const expectedShape1 = [2, 1, 3, 2]
    expectArraysClose(result1.toFloat32Array(), expectedArray1)
    expect(isShape(result1, expectedShape1)).toBe(true)
  })
  it('2D tensors invalid dim', () => {
    const a = sm.tensor(new Float32Array([0, 1, 2, 3, 4, 5])).reshape([3, 2])
    const b = sm.tensor(new Float32Array([10, 11, 12, 13, 14, 15])).reshape([3, 2])

    expectThrows(() => sm.concatenate([a, b], 2), nativeError)
  })
  it('2D tensors multiple', () => {
    const tensors = Array.from(Array(4), (x, i) =>
      sm.tensor(new Float32Array(Array.from(Array(6), (y, j) => i * 10 + j))).reshape([3, 2])
    )

    const result0 = sm.concatenate(tensors, 0)
    const expectedArray0 = new Float32Array([
      0, 1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25, 30, 31, 32, 33, 34, 35
    ])
    const expectedShape0 = [12, 2]
    expectArraysClose(result0.toFloat32Array(), expectedArray0)
    expect(isShape(result0, expectedShape0)).toBe(true)

    const result1 = sm.concatenate(tensors, 1)
    const expectedArray1 = new Float32Array([
      0, 1, 10, 11, 20, 21, 30, 31, 2, 3, 12, 13, 22, 23, 32, 33, 4, 5, 14, 15, 24, 25, 34, 35
    ])
    const expectedShape1 = [3, 8]
    expectArraysClose(result1.toFloat32Array(), expectedArray1)
    expect(isShape(result1, expectedShape1)).toBe(true)
  })
  it('2D tensors too many', () => {
    const tensors = Array.from(Array(5), (x, i) =>
      sm.tensor(new Float32Array(Array.from(Array(6), (y, j) => i * 10 + j))).reshape([3, 2])
    )
    expectThrows(() => sm.concatenate(tensors, 0), nativeError)
    expectThrows(() => sm.concatenate(tensors, 1), nativeError)
  })
  it('propagates NaNs', () => {
    const a = sm.tensor(new Float32Array([NaN, 1, 2, 3, NaN, 5])).reshape([3, 2])
    const b = sm.tensor(new Float32Array([NaN, 11, 12, 13, 14, NaN])).reshape([3, 2])

    const concat0 = sm.concatenate([a, b], 0)
    const expectedArray0 = new Float32Array([NaN, 1, 2, 3, NaN, 5, NaN, 11, 12, 13, 14, NaN])
    const expectedShape0 = [6, 2]
    expectArraysClose(concat0.toFloat32Array(), expectedArray0)
    expect(isShape(concat0, expectedShape0)).toBe(true)

    const concat1 = sm.concatenate([a, b], 1)
    const expectedArray1 = new Float32Array([NaN, 1, NaN, 11, 2, 3, 12, 13, NaN, 5, 14, NaN])
    const expectedShape1 = [3, 4]
    expectArraysClose(concat1.toFloat32Array(), expectedArray1)
    expect(isShape(concat1, expectedShape1)).toBe(true)
  })
  it('gradient', () => {
    const a = sm
      .tensor(new Float32Array([0, 1, 2, 3, 4, 5]))
      .reshape([3, 2])
      .requireGrad()
    const b = sm
      .tensor(new Float32Array([10, 11, 12, 13, 14, 15]))
      .reshape([3, 2])
      .requireGrad()

    const out = sm.concatenate([a, b], 1).sum()
    out.backward()
    const expectedGradShape = [3, 2]
    const expectedGrad = sm.full(expectedGradShape, 1)
    const expectedGradArray = expectedGrad.toFloat32Array()
    expectArraysClose(a.grad.toFloat32Array(), expectedGradArray)
    expectArraysClose(b.grad.toFloat32Array(), expectedGradArray)
    expect(isShape(a.grad, expectedGradShape)).toBe(true)
    expect(isShape(b.grad, expectedGradShape)).toBe(true)
  })
})
