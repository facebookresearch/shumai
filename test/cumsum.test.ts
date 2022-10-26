import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, isShape } from './utils'

describe('cumsum', () => {
  it('1D Tensor', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4]))
    const r = a.cumsum(0)
    expect(isShape(r, [4])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [1, 3, 6, 10])
  })
  it('2D Tensor, axis=1', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    const r = a.cumsum(1)
    expect(isShape(r, [2, 2]))
    expectArraysClose(r.toFloat32Array(), [1, 3, 3, 7])
  })
  it('2D Tensor, axis=0', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    const r = a.cumsum(0)
    expect(isShape(r, [2, 2]))
    expectArraysClose(r.toFloat32Array(), [1, 2, 4, 6])
  })
  it('3D Tensor, axis=2', () => {
    const a = sm.tensor(new Float32Array([0, 1, 2, 3, 4, 5, 6, 7])).reshape([2, 2, 2])
    const r = a.cumsum(2)
    expect(isShape(r, [2, 2, 2]))
    expectArraysClose(r.toFloat32Array(), [0, 1, 2, 5, 4, 9, 6, 13])
  })
  /* TODO: unit tests for gradients */
})
