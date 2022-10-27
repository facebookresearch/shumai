import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { calcSizeFromShape, expectArraysClose, isShape } from './utils'
const MATMUL_SHARED_DIM_THRESHOLD = 1000

describe('matmul', () => {
  it('A x B', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4, 5, 6])).reshape([2, 3])
    const b = sm.tensor(new Float32Array([0, 1, -3, 2, 2, 1])).reshape([3, 2])
    const r = sm.matmul(a, b)
    expect(isShape(r, [2, 2])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 8, -3, 20])
  })
  it('A (shape=[8,4]) x B (shape=[4,8])', async () => {
    const a = sm
      .tensor(
        new Float32Array([
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1,
          2, 3, 4, 5, 6, 7, 8
        ])
      )
      .reshape([8, 4])
    const b = sm
      .tensor(
        new Float32Array([
          0, 1, -3, 2, 1, -1, 0, 5, 6, 7, 8, 0, -2, -2, 1, 9, 11, 10, 0, 1, -3, 2, 1, -1, 1, 2, 3,
          4, 5, 6, 7, 8
        ])
      )
      .reshape([4, 8])
    const r = sm.matmul(a, b)
    expect(isShape(r, [8, 8])).toBe(true)
    expectArraysClose(
      r.toFloat32Array(),
      [
        49, 53, 25, 21, 8, 25, 33, 52, 121, 133, 57, 49, 12, 45, 69, 136, 193, 213, 89, 77, 16, 65,
        105, 220, 265, 293, 121, 105, 20, 85, 141, 304, 337, 373, 153, 133, 24, 105, 177, 388, 409,
        453, 185, 161, 28, 125, 213, 472, 49, 53, 25, 21, 8, 25, 33, 52, 121, 133, 57, 49, 12, 45,
        69, 136
      ]
    )
  })
  it('broadcast w unequal batch dims', () => {
    const a = sm
      .tensor(
        new Float32Array([2, 1, 3, 2, 1, 1, 1, 5, 6, 7, 8, 1, 2, 2, 1, 9, 11, 10, 1, 1, 3, 2, 1, 1])
      )
      .reshape([4, 3, 2])
    const b = sm.tensor(new Float32Array([1, 0.5])).reshape([1, 2, 1])
    const r = sm.matmul(a, b)
    expect(isShape(r, [4, 3, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [2.5, 4, 1.5, 3.5, 9.5, 8.5, 3, 5.5, 16, 1.5, 4, 1.5])
  })
  /* TODO: FIX - CURRENTLY FAILS (Throws C++ Exception)
    it('broadcast w unequal ranks', () => {
      const a = sm
        .tensor(
          new Float32Array([2, 1, 3, 2, 1, 1, 1, 5, 6, 7, 8, 1, 2, 2, 1, 9, 11, 10, 1, 1, 3, 2, 1, 1])
        )
        .reshape([1, 2, 2, 3, 2])
      const b = sm.tensor(new Float32Array([1, 0.5])).reshape([2, 1])
      const r = sm.matmul(a, b)
      expect(isShape(r, [1, 2, 2, 3, 1])).toBe(true)
      expectArraysClose(r.toFloat32Array(), [2.5, 4, 1.5, 3.5, 9.5, 8.5, 3, 5.5, 16, 1.5, 4, 1.5])
    })
  */
  it('matmul => mul', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    const b = sm.tensor(new Float32Array([1, 2, 3, 4, 5, 6])).reshape([2, 3])
    const r1 = sm.matmul(a, b)
    const c = sm.tensor(new Float32Array([0, 1, 0.5, 0, 0.25, 2])).reshape([2, 3])
    const r2 = sm.mul(r1, c)
    expect(isShape(r2, [2, 3])).toBe(true)
    expectArraysClose(r2.toFloat32Array(), [0, 12, 7.5, 0, 6.5, 66])
  })
  it('vector x matrix (w implicit reshape)', () => {
    const a = sm.tensor(new Float32Array([2, 3]))
    const b = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    const r = sm.matmul(a, b)
    expect(isShape(r, [2])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [11, 16])
  })
  it('matrix x vector', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    const b = sm.tensor(new Float32Array([2, 3]))
    const r = sm.matmul(a, b)
    expect(isShape(r, [2])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [8, 18])
  })

  it('works on batches w matrices as vectors', () => {
    const BATCH_SIZE = 3
    const sharedDim = MATMUL_SHARED_DIM_THRESHOLD + 1
    const values = new Float32Array(BATCH_SIZE * sharedDim)
    values[10] = 2
    const a = sm.tensor(values).reshape([BATCH_SIZE, 1, sharedDim])
    const b = sm.tensor(values).reshape([BATCH_SIZE, sharedDim, 1])
    const r = sm.matmul(a, b)
    expect(isShape(r, [BATCH_SIZE, 1, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [4, 0, 0])
  })
  it('works on batches w matrix x vector', () => {
    const BATCH_SIZE = 3
    const sharedDim = MATMUL_SHARED_DIM_THRESHOLD + 1
    const values = new Float32Array(BATCH_SIZE * sharedDim)
    values[10] = 2
    const shape1 = [BATCH_SIZE, 2, sharedDim]
    const a = sm
      .tensor(new Float32Array(new Array(calcSizeFromShape(shape1)).fill(1)))
      .reshape(shape1)
    const b = sm.tensor(values).reshape([BATCH_SIZE, sharedDim, 1])
    const r = sm.matmul(a, b)
    expect(isShape(r, [BATCH_SIZE, 2, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [2, 2, 0, 0, 0, 0])
  })
  it('works on batches w vector x matrix', () => {
    const BATCH_SIZE = 3
    const sharedDim = MATMUL_SHARED_DIM_THRESHOLD + 1
    const values = new Float32Array(BATCH_SIZE * sharedDim)
    values[10] = 2
    const a = sm.tensor(values).reshape([BATCH_SIZE, 1, sharedDim])

    const bShape = [BATCH_SIZE, sharedDim, 2]
    const b = sm
      .tensor(new Float32Array(new Array(calcSizeFromShape(bShape)).fill(1)))
      .reshape(bShape)
    const r = sm.matmul(a, b)
    expect(isShape(r, [BATCH_SIZE, 1, 2])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [2, 2, 0, 0, 0, 0])
  })
  it('matrix x vector propagates NaNs', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    const b = sm.tensor(new Float32Array([2, NaN]))
    const r = sm.matmul(a, b)
    expectArraysClose(r.toFloat32Array(), [NaN, NaN])
  })
  it('dot product', () => {
    const a = sm.tensor(new Float32Array([2, 3]))
    const b = sm.tensor(new Float32Array([2, 1]))
    const r = sm.matmul(a, b)
    expectArraysClose(r.toFloat32Array(), [7])
  })
  it('dot product propagates NaNs', () => {
    const a = sm.tensor(new Float32Array([2, NaN]))
    const b = sm.tensor(new Float32Array([2, 1]))
    const r = sm.matmul(a, b)
    expectArraysClose(r.toFloat32Array(), [NaN])
  })
  /* TODO: unit tests for gradients */
})
