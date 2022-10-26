import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, isShape } from './utils'

describe('tile', () => {
  it('1D Tensor', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3]))
    const t2 = sm.tile(t, [2])
    expect(isShape(t2, [6])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 2, 3, 1, 2, 3])
  })
  it('2D Tensor', () => {
    const t = sm.tensor(new Float32Array([1, 11, 2, 22])).reshape([2, 2])
    let t2 = sm.tile(t, [1, 2])
    expect(isShape(t2, [2, 4])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 11, 1, 11, 2, 22, 2, 22])

    t2 = sm.tile(t, [2, 1])
    expect(isShape(t2, [4, 2])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 11, 2, 22, 1, 11, 2, 22])

    t2 = sm.tile(t, [2, 2])
    expect(isShape(t2, [4, 4])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 11, 1, 11, 2, 22, 2, 22, 1, 11, 1, 11, 2, 22, 2, 22])
  })
  it('3D Tensor', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8])).reshape([2, 2, 2])
    const t2 = sm.tile(t, [1, 2, 1])
    expect(isShape(t2, [2, 4, 2])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 2, 3, 4, 1, 2, 3, 4, 5, 6, 7, 8, 5, 6, 7, 8])
  })
  it('4D Tensor', () => {
    const t = sm.tensor(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8])).reshape([1, 2, 2, 2])
    const t2 = sm.tile(t, [1, 2, 1, 1])
    expect(isShape(t2, [1, 4, 2, 2])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8])
  })
  /* TODO: FIX - CURRENTLY FAILS (Throws C++ Exception)
    it('5D Tensor', () => {
      const t = sm.tensor(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8])).reshape([1, 1, 2, 2, 2])
      const t2 = sm.tile(t, [1, 2, 1, 1, 1])
      expect(isShape(t2, [1, 2, 2, 2, 2])).toBe(true)
      expectArraysClose(t2.toFloat32Array(), [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8])
    })
  */
  /* TODO: FIX - CURRENTLY FAILS (Throws C++ Exception)
    it('6D Tensor', () => {
      const t = sm
        .tensor(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]))
        .reshape([1, 1, 2, 2, 2, 2])
      const t2 = sm.tile(t, [1, 2, 1, 1, 1, 1])
      expect(isShape(t2, [1, 2, 2, 2, 2, 2])).toBe(true)
      expectArraysClose(
        t2.toFloat32Array(),
        [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
          12, 13, 14, 15, 16
        ]
      )
    })
  */
  it('propagates NaNs', () => {
    const t = sm.tensor(new Float32Array([1, 2, NaN]))
    const t2 = sm.tile(t, [2])
    expect(isShape(t2, [6])).toBe(true)
    expectArraysClose(t2.toFloat32Array(), [1, 2, NaN, 1, 2, NaN])
  })
  /* TODO: unit tests for gradients */
})
