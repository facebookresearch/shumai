import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, expectThrows, isShape } from './utils'

describe('where', () => {
  it('Scalars', () => {
    const a = sm.scalar(10)
    const b = sm.scalar(20)
    const c = sm.scalar(1)
    expectArraysClose(sm.where(c, a, b).toFloat32Array(), [10])
  })
  it('1D Tensor', () => {
    const c = sm.tensor(new Float32Array([1, 0, 1, 0]))
    const a = sm.tensor(new Float32Array([10, 10, 10, 10]))
    const b = sm.tensor(new Float32Array([20, 20, 20, 20]))
    expectArraysClose(sm.where(c, a, b).toFloat32Array(), [10, 20, 10, 20])
  })
  it('2D Tensor', () => {
    const c = sm.tensor(new Float32Array([1, 0, 0, 1])).reshape([2, 2])
    const a = sm.tensor(new Float32Array([10, 10, 10, 10])).reshape([2, 2])
    const b = sm.tensor(new Float32Array([5, 5, 5, 5])).reshape([2, 2])
    expectArraysClose(sm.where(c, a, b).toFloat32Array(), [10, 5, 5, 10])
  })
  /* TODO: FIX - CURRENTLY FAILS (Throws C++ Exception)
    it('broadcasts 2D Tensor shapes', () => {
      const c = sm.tensor(new Float32Array([1, 0]))
      let a = sm.tensor(new Float32Array([10, 10])).reshape([2, 1]),
        b = sm.tensor(new Float32Array([5, 5])).reshape([2, 1]),
        r = sm.where(c, a, b)
      expect(isShape(r, [2, 2])).toBe(true)
      expectArraysClose(sm.where(c, a, b).toFloat32Array(), [10, 5, 10, 5])

      a = sm.tensor(new Float32Array([10, 10, 10, 10, 10, 10])).reshape([2, 3])
      b = sm.tensor(new Float32Array([5, 5, 5])).reshape([3, 1])
      r = sm.where(c, a, b)
      expect(isShape(r, [3, 2])).toBe(true)
      expectArraysClose(sm.where(c, a, b).toFloat32Array(), [10, 5, 10, 5, 10, 5])
    })
  */
  it('3D Tensor', () => {
    const c = sm.tensor(new Float32Array([1, 0, 1, 0, 0, 0])).reshape([2, 3, 1])
    const a = sm.tensor(new Float32Array([5, 5, 5, 5, 5, 5])).reshape([2, 3, 1])
    const b = sm.tensor(new Float32Array([3, 3, 3, 3, 3, 3])).reshape([2, 3, 1])
    expectArraysClose(sm.where(c, a, b).toFloat32Array(), [5, 3, 5, 3, 3, 3])
  })
  /* TODO: FIX - CURRENTLY FAILS (Throws C++ Exception)
    it('broadcasts 3D Tensor shapes', () => {
      const c = sm.tensor(new Float32Array([1, 0]))
      let a = sm.tensor(new Float32Array([9, 9, 9, 9])).reshape([4, 1, 1]),
        b = sm.tensor(new Float32Array([8, 8, 8, 8])).reshape([4, 1, 1]),
        r = sm.where(c, a, b)
      expect(isShape(r, [4, 1, 2])).toBe(true)
      expectArraysClose(sm.where(c, a, b).toFloat32Array(), [9, 8, 9, 8, 9, 8, 9, 8])

      a = sm.tensor(new Float32Array([9, 9])).reshape([2, 1])
      b = sm.tensor(new Float32Array([8, 8, 8, 8])).reshape([4, 1, 1])
      r = sm.where(c, a, b)
      expect(isShape(r, [4, 2, 2])).toBe(true)
      expectArraysClose(sm.where(c, a, b).toFloat32Array(), [9, 8, 9, 8, 9, 8, 9, 8, 9, 8, 9, 8, 9, 8, 9, 8])
    })
  */

  it('4D Tensor', () => {
    const c = sm.tensor(new Float32Array([1, 0, 1, 1])).reshape([2, 2, 1, 1])
    const a = sm.tensor(new Float32Array([7, 7, 7, 7])).reshape([2, 2, 1, 1])
    const b = sm.tensor(new Float32Array([3, 3, 3, 3])).reshape([2, 2, 1, 1])
    expectArraysClose(sm.where(c, a, b).toFloat32Array(), [7, 3, 7, 7])
  })

  it('gradient for scalars', () => {
    const c = sm.scalar(1)
    const a = sm.scalar(10).requireGrad()
    const b = sm.scalar(20).requireGrad()
    const result = sm.where(c, a, b)
    result.backward()

    expect(isShape(a.grad, a.shape)).toBe(true)
    expectArraysClose(a.grad.toFloat32Array(), [1])

    expect(isShape(b.grad, b.shape)).toBe(true)
    expectArraysClose(b.grad.toFloat32Array(), [0])
  })
  it('gradient for 2D Tensors', () => {
    const c = sm.tensor(new Float32Array([1, 0, 1, 1])).reshape([2, 2])
    const a = sm
      .tensor(new Float32Array([10, 10, 10, 10]))
      .reshape([2, 2])
      .requireGrad()
    const b = sm
      .tensor(new Float32Array([5, 5, 5, 5]))
      .reshape([2, 2])
      .requireGrad()
    const result = sm.where(c, a, b).sum()
    result.backward()

    expect(isShape(a.grad, a.shape)).toBe(true)
    expectArraysClose(a.grad.toFloat32Array(), [1, 0, 1, 1])

    expect(isShape(b.grad, b.shape)).toBe(true)
    expectArraysClose(b.grad.toFloat32Array(), [0, 1, 0, 0])
  })
  it('gradient cond is invalid', () => {
    const c = sm
      .tensor(new Float32Array([1, 0, 1, 1]))
      .reshape([2, 2])
      .requireGrad()
    const a = sm
      .tensor(new Float32Array([10, 10, 10, 10]))
      .reshape([2, 2])
      .requireGrad()
    const b = sm
      .tensor(new Float32Array([5, 5, 5, 5]))
      .reshape([2, 2])
      .requireGrad()
    const result = sm.where(c, a, b).sum()

    expectThrows(() => result.backward(), new RegExp('cannot be propagated'))
  })
})
