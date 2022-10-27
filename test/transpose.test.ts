import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { areSameShape, expectArraysClose, isShape } from './utils'

describe('transpose', () => {
  it('2D Tensor (no change)', () => {
    const t = sm.tensor(new Float32Array([1, 11, 2, 22, 3, 33, 4, 44])).reshape([2, 4])
    const r = sm.transpose(t, [0, 1])
    expect(areSameShape(t, r)).toBe(true)
    expectArraysClose(r.toFloat32Array(), t.toFloat32Array())
  })
  it('2D Tensor', () => {
    const t = sm.tensor(new Float32Array([1, 11, 2, 22, 3, 33, 4, 44])).reshape([2, 4])
    const t2 = t.transpose([1, 0])
    expect(isShape(t2, [4, 2])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 3, 11, 33, 2, 4, 22, 44])
  })
  it('2D Tensor; shape has ones', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([1, 4])
    const t2 = sm.transpose(t, [1, 0])
    expect(isShape(t2, [4, 1])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 2, 3, 4])
  })
  it('3D Tensor [r, c, d] => [d, r, c]', () => {
    const t = sm.tensor(new Float32Array([1, 11, 2, 22, 3, 33, 4, 44])).reshape([2, 2, 2])
    const t2 = sm.transpose(t, [2, 0, 1])
    expect(isShape(t2, [2, 2, 2])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 2, 3, 4, 11, 22, 33, 44])
  })
  it('3D Tensor [r, c, d] => [d, c, r]', () => {
    const t = sm.tensor(new Float32Array([1, 11, 2, 22, 3, 33, 4, 44])).reshape([2, 2, 2])
    const t2 = sm.transpose(t, [2, 1, 0])
    expect(isShape(t2, [2, 2, 2])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 3, 2, 4, 11, 33, 22, 44])
  })
  it('3D Tensor [r, c, d] => [d, r, c], shape has ones', () => {
    const perm = [2, 0, 1]
    const t = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 1, 2])
    const tt = sm.transpose(t, perm)
    expect(isShape(tt, [2, 2, 1])).toBe(true)
    expectArraysClose(tt.toFloat32Array(), [1, 3, 2, 4])

    const t2 = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2, 1])
    const tt2 = sm.transpose(t2, perm)
    expect(isShape(tt2, [1, 2, 2])).toBe(true)
    expectArraysClose(tt2.toFloat32Array(), [1, 2, 3, 4])

    const t3 = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([1, 2, 2])
    const tt3 = sm.transpose(t3, perm)
    expect(isShape(tt3, [2, 1, 2])).toBe(true)
    expectArraysClose(tt3.toFloat32Array(), [1, 3, 2, 4])
  })
  it('3D Tensor [r, c, d] => [r, d, c]', () => {
    const perm = [0, 2, 1]
    const t = sm.tensor(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8])).reshape([2, 2, 2])
    const tt = sm.transpose(t, perm)
    expect(isShape(tt, [2, 2, 2])).toBe(true)
    expectArraysClose(tt.toFloat32Array(), [1, 3, 2, 4, 5, 7, 6, 8])
  })
  /* TODO: FIX - CURRENTLY FAILS (Throws C++ Exception)
    it('5D Tensor [r, c, d, e, f] => [r, c, d, f, e]', () => {
      const t = sm
        .tensor(new Float32Array(new Array(32).fill(0).map((x, i) => i + 1)))
        .reshape([2, 2, 2, 2, 2])
      const t2 = sm.transpose(t, [0, 1, 2, 4, 3])
      expect(isShape(t2, [2, 2, 2, 2, 2])).toBe(true)
      expectArraysClose(
        t2.toFloat32Array(),
        [
          1, 3, 2, 4, 5, 7, 6, 8, 9, 11, 10, 12, 13, 15, 14, 16, 17, 19, 18, 20, 21, 23, 22, 24, 25,
          27, 26, 28, 29, 31, 30, 32
        ]
      )
    })
  */
  it('4D Tensor [r, c, d, e] => [c, r, d, e]', () => {
    const t = sm
      .tensor(new Float32Array(new Array(16).fill(0).map((x, i) => i + 1)))
      .reshape([2, 2, 2, 2])
    const t2 = sm.transpose(t, [1, 0, 2, 3])
    expect(isShape(t2, [2, 2, 2, 2])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 2, 3, 4, 9, 10, 11, 12, 5, 6, 7, 8, 13, 14, 15, 16])
  })
  it('4D Tensor [r, c, d, e] => [c, r, e, d]', () => {
    const t = sm
      .tensor(new Float32Array(new Array(16).fill(0).map((x, i) => i + 1)))
      .reshape([2, 2, 2, 2])
    const t2 = sm.transpose(t, [1, 0, 3, 2])
    expect(isShape(t2, [2, 2, 2, 2])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 3, 2, 4, 9, 11, 10, 12, 5, 7, 6, 8, 13, 15, 14, 16])
  })
  it('4D Tensor [r, c, d, e] => [e, r, c, d]', () => {
    const t = sm
      .tensor(new Float32Array(new Array(16).fill(0).map((x, i) => i + 1)))
      .reshape([2, 2, 2, 2])
    const t2 = sm.transpose(t, [3, 0, 1, 2])
    expect(isShape(t2, [2, 2, 2, 2])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 3, 5, 7, 9, 11, 13, 15, 2, 4, 6, 8, 10, 12, 14, 16])
  })
  it('4D Tensor [r, c, d, e] => [d, c, e, r]', () => {
    const t = sm
      .tensor(new Float32Array(new Array(16).fill(0).map((x, i) => i + 1)))
      .reshape([2, 2, 2, 2])
    const t2 = sm.transpose(t, [2, 1, 3, 0])
    expect(isShape(t2, [2, 2, 2, 2])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 9, 2, 10, 5, 13, 6, 14, 3, 11, 4, 12, 7, 15, 8, 16])
  })
  /* TODO: FIX - CURRENTLY FAILS (Throws C++ Exception)
    it('5D Tensor [r, c, d, e, f] => [c, r, d, e, f]', () => {
      const t = sm
        .tensor(new Float32Array(new Array(32).fill(0).map((x, i) => i + 1)))
        .reshape([2, 2, 2, 2, 2])
      const t2 = sm.transpose(t, [1, 0, 2, 3, 4])
      expect(isShape(t2, [2, 2, 2, 2, 2])).toBe(true)
      expectArraysClose(
        t2.toFloat32Array(),
        [
          1, 2, 3, 4, 5, 6, 7, 8, 17, 18, 19, 20, 21, 22, 23, 24, 9, 10, 11, 12, 13, 14, 15, 16, 25,
          26, 27, 28, 29, 30, 31, 32
        ]
      )
    })
  */
  /* TODO: FIX - CURRENTLY FAILS (Throws C++ Exception)
    it('6D Tensor [r, c, d, e, f] => [r, c, d, f, e]', () => {
      const t = sm
        .tensor(new Float32Array(new Array(64).fill(0).map((x, i) => i + 1)))
        .reshape([2, 2, 2, 2, 2, 2])
      const t2 = sm.transpose(t, [0, 1, 2, 3, 5, 4])
      expect(isShape(t2, [2, 2, 2, 2, 2, 2])).toBe(true)
      expectArraysClose(
        t2.toFloat32Array(),
        [
          1, 3, 2, 4, 5, 7, 6, 8, 9, 11, 10, 12, 13, 15, 14, 16, 17, 19, 18, 20, 21, 23, 22, 24, 25,
          27, 26, 28, 29, 31, 30, 32, 33, 35, 34, 36, 37, 39, 38, 40, 41, 43, 42, 44, 45, 47, 46, 48,
          49, 51, 50, 52, 53, 55, 54, 56, 57, 59, 58, 60, 61, 63, 62, 64
        ]
      )
    })
  */
  /* TODO: FIX - CURRENTLY FAILS (Throws C++ Exception)
    it('6D Tensor [r, c, d, e, f, g] => [c, r, d, e, f, g]', () => {
      const t = sm
        .tensor(new Float32Array(new Array(64).fill(0).map((x, i) => i + 1)))
        .reshape([2, 2, 2, 2, 2, 2])
      const t2 = sm.transpose(t, [1, 0, 2, 3, 4, 5])
      expect(isShape(t2, [2, 2, 2, 2, 2, 2])).toBe(true)
      expectArraysClose(
        t2.toFloat32Array(),
        [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 33, 34, 35, 36, 37, 38, 39, 40, 41,
          42, 43, 44, 45, 46, 47, 48, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
          49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64
        ]
      )
    })
  */
  it('gradient', () => {
    const t = sm
      .tensor(new Float32Array([1, 11, 2, 22, 3, 33, 4, 44]))
      .reshape([2, 4])
      .requireGrad()
    const gradProduct = sm.tensor(new Float32Array([2, 3]))
    const result = t.transpose([1, 0]).mul(gradProduct).sum()
    result.backward()
    expect(isShape(t.grad, [2, 4])).toBe(true)
    expectArraysClose(t.grad.toFloat32Array(), [2, 2, 2, 2, 3, 3, 3, 3])
  })
  it('gradient (no change)', () => {
    const t = sm
      .tensor(new Float32Array([1, 11, 2, 22, 3, 33, 4, 44]))
      .reshape([2, 4])
      .requireGrad()
    const gradProduct = sm.tensor(new Float32Array([2, 3, 4, 5]))
    const result = t.transpose([0, 1]).mul(gradProduct).sum()
    result.backward()
    expect(isShape(t.grad, [2, 4])).toBe(true)
    expectArraysClose(t.grad.toFloat32Array(), [2, 3, 4, 5, 2, 3, 4, 5])
  })
  it('gradient; shape has ones', () => {
    const t = sm
      .tensor(new Float32Array([1, 2, 3, 4]))
      .reshape([1, 4])
      .requireGrad()
    const result = t.transpose([1, 0]).sum()
    result.backward()
    expect(isShape(t.grad, [1, 4])).toBe(true)
    expectArraysClose(t.grad.toFloat32Array(), [1, 1, 1, 1])
  })
})
