import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, isShape } from './utils'

describe('any', () => {
  it('1D Tensor', () => {
    let a = sm.tensor(new Float32Array([0, 0, 0]))
    expectArraysClose(sm.any(a).toFloat32Array(), [0])

    a = sm.tensor(new Float32Array([1, 0, 1]))
    expectArraysClose(sm.any(a).toFloat32Array(), [1])

    a = sm.tensor(new Float32Array([1, 1, 1]))
    expectArraysClose(sm.any(a).toFloat32Array(), [1])
  })
  it('ignores NaNs', () => {
    const a = sm.tensor(new Float32Array([1, NaN, 0]))
    expectArraysClose(sm.any(a).toFloat32Array(), [1])
  })
  it('2D Tensor', () => {
    const a = sm.tensor(new Float32Array([1, 1, 0, 0])).reshape([2, 2])
    expectArraysClose(sm.any(a).toFloat32Array(), [1])
  })
  it('2D Tensor, axis=[0, 1]', () => {
    const a = sm.tensor(new Float32Array([1, 1, 0, 0, 1, 0])).reshape([2, 3])
    expectArraysClose(sm.any(a, [0, 1]).toFloat32Array(), [1])
  })
  it('2D Tensor, axis=[0]/axis=[1]', () => {
    const a = sm.tensor(new Float32Array([1, 1, 0, 0])).reshape([2, 2])
    let r = sm.any(a, [0])
    expect(isShape(r, [2])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [1, 1])

    r = sm.any(a, [1])
    expect(isShape(r, [2])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [1, 0])
  })
  it('2D Tensor, axis=[0] & keep_dims=true', () => {
    const a = sm.tensor(new Float32Array([1, 1, 0, 0, 1, 0])).reshape([2, 3])
    const r = a.any([0], true)
    expect(isShape(r, [1, 3])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [1, 1, 0])
  })
  it('2D Tensor, axis=[1]', () => {
    const a = sm.tensor(new Float32Array([1, 1, 0, 0, 1, 0])).reshape([2, 3])
    expectArraysClose(a.any([1]).toFloat32Array(), [1, 1])
  })
  it('2D Tensor, axis=[-1]', () => {
    const a = sm.tensor(new Float32Array([1, 1, 0, 0, 1, 0])).reshape([2, 3])
    expectArraysClose(a.any([-1]).toFloat32Array(), [1, 1])
  })
  it('2D Tensor, axis=[-1]', () => {
    const a = sm.tensor(new Float32Array([1, 1, 0, 0, 1, 0])).reshape([2, 3])
    expectArraysClose(a.any([-1]).toFloat32Array(), [1, 1])
  })
})
