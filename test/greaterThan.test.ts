import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, isShape } from './utils'

describe('greaterThan', () => {
  it('basic (1D Binary Tensor)', () => {
    let a = sm.tensor(new Float32Array([1, 4, 5])),
      b = sm.tensor(new Float32Array([2, 3, 5])),
      r = sm.greaterThan(a, b)
    expect(isShape(r, [3])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 1, 0])

    a = sm.tensor(new Float32Array([2, 2, 2]))
    b = sm.tensor(new Float32Array([2, 2, 2]))
    r = a.greaterThan(b)
    expect(isShape(r, [3])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 0, 0])

    a = sm.tensor(new Float32Array([3, 3]))
    b = sm.tensor(new Float32Array([0, 0]))
    r = a.greaterThan(b)
    expect(isShape(r, [2])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [1, 1])

    a = sm.tensor(new Float32Array([1.1, 4.1, 5.1]))
    b = sm.tensor(new Float32Array([2.2, 3.2, 5.1]))
    r = a.greaterThan(b)
    expect(isShape(r, [3])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 1, 0])

    a = sm.tensor(new Float32Array([2.31, 2.31, 2.31]))
    b = sm.tensor(new Float32Array([2.31, 2.31, 2.31]))
    r = a.greaterThan(b)
    expect(isShape(r, [3])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 0, 0])

    a = sm.tensor(new Float32Array([3.123, 3.321]))
    b = sm.tensor(new Float32Array([0.45, 0.123]))
    r = a.greaterThan(b)
    expect(isShape(r, [2])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [1, 1])
  })
  it('1D Tensor with NaNs', () => {
    const a = sm.tensor(new Float32Array([1.1, NaN, 2.1]))
    const b = sm.tensor(new Float32Array([2.1, 3.1, NaN]))
    const r = sm.greaterThan(a, b)
    expect(isShape(r, [3])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 0, 0])
  })
  it('2D Tensor', () => {
    let a = sm.tensor(new Float32Array([1, 4, 5, 8, 9, 11])).reshape([2, 3]),
      b = sm.tensor(new Float32Array([2, 3, 6, 7, 10, 11])).reshape([2, 3]),
      r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 3])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 1, 0, 1, 0, 0])

    a = sm.tensor(new Float32Array([0, 0, 1, 1])).reshape([2, 2])
    b = sm.tensor(new Float32Array([0, 0, 1, 1])).reshape([2, 2])
    r = a.greaterThan(b)
    expect(isShape(r, [2, 2])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 0, 0, 0])

    a = sm.tensor(new Float32Array([1.1, 4.1, 5.1, 8.1, 9.1, 11.1])).reshape([2, 3])
    b = sm.tensor(new Float32Array([2.1, 3.1, 6.1, 7.1, 10.1, 11.1])).reshape([2, 3])
    r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 3])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 1, 0, 1, 0, 0])

    a = sm.tensor(new Float32Array([0.2, 0.2, 1.2, 1.2])).reshape([2, 2])
    b = sm.tensor(new Float32Array([0.2, 0.2, 1.2, 1.2])).reshape([2, 2])
    r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 2])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 0, 0, 0])
  })
  it('2D Tensor with NaNs', () => {
    const a = sm.tensor(new Float32Array([1.1, NaN, 0.1, NaN])).reshape([2, 2])
    const b = sm.tensor(new Float32Array([0.1, NaN, 1.1, NaN])).reshape([2, 2])
    const r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 2])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [1, 0, 0, 0])
  })
  it('3D Tensor', () => {
    let a = sm.tensor(new Float32Array([1, 4, 5, 8, 9, 11])).reshape([2, 3, 1]),
      b = sm.tensor(new Float32Array([2, 3, 6, 7, 10, 11])).reshape([2, 3, 1]),
      r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 3, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 1, 0, 1, 0, 0])

    a = sm.tensor(new Float32Array([0, 0, 0, 1, 1, 1])).reshape([2, 3, 1])
    b = sm.tensor(new Float32Array([0, 0, 0, 1, 1, 1])).reshape([2, 3, 1])
    r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 3, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 0, 0, 0, 0, 0])

    a = sm.tensor(new Float32Array([1.1, 4.1, 5.1, 8.1, 9.1, 11.1])).reshape([2, 3, 1])
    b = sm.tensor(new Float32Array([2.1, 3.1, 6.1, 7.1, 10.1, 11.1])).reshape([2, 3, 1])
    r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 3, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 1, 0, 1, 0, 0])

    a = sm.tensor(new Float32Array([0.1, 0.1, 0.1, 1.1, 1.1, 1.2])).reshape([2, 3, 1])
    b = sm.tensor(new Float32Array([0.1, 0.1, 0.1, 1.1, 1.1, 1.1])).reshape([2, 3, 1])
    r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 3, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 0, 0, 0, 0, 1])
  })
  it('3D Tensor with NaNs', () => {
    const a = sm.tensor(new Float32Array([1.1, NaN, 1.1, 0.1, 0.1, 0.1])).reshape([2, 3, 1])
    const b = sm.tensor(new Float32Array([0.1, 0.1, 1.1, 1.1, 0.1, NaN])).reshape([2, 3, 1])
    const r = a.greaterThan(b)
    expect(isShape(r, [2, 3, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [1, 0, 0, 0, 0, 0])
  })
  it('4D Tensor', () => {
    let a = sm.tensor(new Float32Array([1, 4, 5, 8])).reshape([2, 2, 1, 1]),
      b = sm.tensor(new Float32Array([2, 3, 6, 8])).reshape([2, 2, 1, 1]),
      r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 2, 1, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 1, 0, 0])

    a = sm.tensor(new Float32Array([0, 1, 2, 3])).reshape([2, 2, 1, 1])
    b = sm.tensor(new Float32Array([0, 1, 2, 3])).reshape([2, 2, 1, 1])
    r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 2, 1, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 0, 0, 0])

    a = sm.tensor(new Float32Array([2, 2, 2, 2])).reshape([2, 2, 1, 1])
    b = sm.tensor(new Float32Array([1, 1, 1, 1])).reshape([2, 2, 1, 1])
    r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 2, 1, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [1, 1, 1, 1])

    a = sm.tensor(new Float32Array([1.1, 4.1, 5.1, 8.1])).reshape([2, 2, 1, 1])
    b = sm.tensor(new Float32Array([2.1, 3.1, 6.1, 8.1])).reshape([2, 2, 1, 1])
    r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 2, 1, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 1, 0, 0])

    a = sm.tensor(new Float32Array([0.1, 1.1, 2.2, 3.3])).reshape([2, 2, 1, 1])
    b = sm.tensor(new Float32Array([0.1, 1.1, 2.2, 3.3])).reshape([2, 2, 1, 1])
    r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 2, 1, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [0, 0, 0, 0])

    a = sm.tensor(new Float32Array([1.1, 1.1, 1.1, 1.1])).reshape([2, 2, 1, 1])
    b = sm.tensor(new Float32Array([0.1, 0.1, 0.1, 0.1])).reshape([2, 2, 1, 1])
    r = sm.greaterThan(a, b)
    expect(isShape(r, [2, 2, 1, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [1, 1, 1, 1])
  })
  it('4D Tensor with NaNs', () => {
    const a = sm.tensor(new Float32Array([1.1, NaN, 0.1, 0.1])).reshape([2, 2, 1, 1])
    const b = sm.tensor(new Float32Array([0.1, 1.1, 1.1, NaN])).reshape([2, 2, 1, 1])
    const r = a.greaterThan(b)
    expect(isShape(r, [2, 2, 1, 1])).toBe(true)
    expectArraysClose(r.toFloat32Array(), [1, 0, 0, 0])
  })
  /* TODO: unit tests for gradients */
})
