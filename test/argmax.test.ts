import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, isShape } from './utils'

const THRESHOLD = 30

describe('argmax', () => {
  it('1D Tensor', () => {
    const a = sm.tensor(new Float32Array([1, 0, 3, 2]))
    const r = sm.argmax(a, 0)
    expectArraysClose(r.toFloat32Array(), [2])
  })
  it('one element', () => {
    const a = sm.tensor(new Float32Array([10]))
    const r = sm.argmax(a, 0)
    expectArraysClose(r.toFloat32Array(), [0])
  })
  it('1D Tensor', () => {
    const n = THRESHOLD * 2
    const values = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      values[i] = i
    }
    const a = sm.tensor(values)
    const r = sm.argmax(a, 0)
    expectArraysClose(r.toFloat32Array(), n - 1)
  })
  it('3D Tensor, axis=-1', () => {
    const n = THRESHOLD * 2
    const values = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      values[i] = i
    }
    const a = sm.tensor(values).reshape([1, 1, n])
    const r = sm.argmax(a, -1)
    expectArraysClose(r.toFloat32Array(), n - 1)
  })
  it('ignores NaNs', () => {
    const a = sm.tensor(new Float32Array([0, 3, 5, NaN, 3]))
    const r = sm.argmax(a, 0)
    expectArraysClose(r.toFloat32Array(), [2])
  })
  it('2D Tensor, axis=0', () => {
    const a = sm.tensor(new Float32Array([3, -1, 0, 100, -7, 2])).reshape([2, 3])
    const r = sm.argmax(a, 0)
    expect(isShape(r, [3])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [1, 0, 1])
  })
  /* TODO: FIX - CURRENTLY FAILS (Throws C++ Exception)
    it('6D Tensor, axis=0', () => {
      const a = sm.tensor(new Float32Array([3, -1, 0, 100, -7, 2])).reshape([2, 1, 1, 1, 1, 3])
      const r = sm.argmax(a, 0)
      expect(isShape(r, [1, 1, 1, 1, 3])).toBe(true)
      expectArraysClose(r.toFloat32Array(), [1, 0, 1])
    })
  */
  it('2D Tensor, axis=1', () => {
    const a = sm.tensor(new Float32Array([3, 2, 5, 100, -7, 2])).reshape([2, 3])
    expectArraysClose(sm.argmax(a, 1).toFloat32Array(), [2, 0])
  })
  it('2D Tensor, axis=-1', () => {
    const a = sm.tensor(new Float32Array([3, 2, 5, 100, -7, 2])).reshape([2, 3])
    expectArraysClose(sm.argmax(a, -1).toFloat32Array(), [2, 0])
  })
  /* TODO: unit tests for gradients */
})
