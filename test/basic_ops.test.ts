import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { areSameShape, expectArraysClose, isShape } from './utils'

describe('ops', () => {
  it('should reshape', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    const b = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])
    expect(areSameShape(a, b)).toBe(true)
  })
  it('should reshape with gradient', () => {
    const tensor = sm.tensor(new Float32Array([1, 2, 3, 4])).requireGrad()
    expect(isShape(tensor, [4])).toBe(true)
    const reshaped = tensor.reshape([2, 2])
    const final = reshaped.sum()
    final.backward()
    expect(isShape(reshaped.grad, [2, 2])).toBe(true)
    expectArraysClose(reshaped.grad.toFloat32Array(), [1, 1, 1, 1])
    expect(isShape(tensor.grad, [4])).toBe(true)
    expectArraysClose(tensor.grad.toFloat32Array(), [1, 1, 1, 1])
  })
  it('should work for negative', () => {
    const a = sm.tensor(new Float32Array([1, -3, 2, 7, -4]))
    const r = sm.negative(a)
    expectArraysClose(r.toFloat32Array(), [-1, 3, -2, -7, 4])
  })
  it('should support basic math operators (add, sub, mul, div)', () => {
    const a = sm.scalar(4)
    const b = sm.scalar(2)
    expect(sm.add(a, b).toFloat32()).toBe(6)
    expect(sm.sub(a, b).toFloat32()).toBe(2)
    expect(sm.mul(a, b).toFloat32()).toBe(8)
    expect(sm.div(a, b).toFloat32()).toBe(2)
  })
  it('should work for exp', () => {
    const a = sm.tensor(new Float32Array([1, 2, 0]))
    const r = sm.exp(a)
    expectArraysClose(r.toFloat32Array(), [Math.exp(1), Math.exp(2), 1])
  })
  it('should work for log', () => {
    const a = sm.tensor(new Float32Array([1, 2]))
    const r = sm.log(a)
    expectArraysClose(r.toFloat32Array(), [Math.log(1), Math.log(2)])
  })
  it('should work for floor', () => {
    const a = sm.tensor(new Float32Array([1.5, 2.1, -1.4]))
    const r = sm.floor(a)
    expectArraysClose(r.toFloat32Array(), [1, 2, -2])
  })
  it('should work for ceil', () => {
    const a = sm.tensor(new Float32Array([1.5, 2.1, -1.4]))
    const r = sm.ceil(a)
    expectArraysClose(r.toFloat32Array(), [2, 3, -1])
  })
  it('should work for abs', () => {
    const a = sm.tensor(new Float32Array([1, -2, 0, 3, -0.1]))
    const r = sm.abs(a)
    expectArraysClose(r.toFloat32Array(), [1, 2, 0, 3, 0.1])
  })
  it('should work for minimum', () => {
    const a = sm.tensor(new Float32Array([0.5, 3, -0.1, -4]))
    const b = sm.tensor(new Float32Array([0.2, 0.4, 0.25, 0.15]))
    const r = sm.minimum(a, b)
    expectArraysClose(r.toFloat32Array(), [0.2, 0.4, -0.1, -4])
  })
  it('should work for maximum', () => {
    const a = sm.tensor(new Float32Array([0.5, 3, -0.1, -4]))
    const b = sm.tensor(new Float32Array([0.2, 0.4, 0.25, 0.15]))
    const r = sm.maximum(a, b)
    expectArraysClose(r.toFloat32Array(), [0.5, 3, 0.25, 0.15])
  })
  it('should work for mul', () => {
    const shape = [2, 2]
    const a = sm.tensor(new Float32Array([1, 2, -3, -4])).reshape(shape)
    const b = sm.tensor(new Float32Array([5, 3, 4, -7])).reshape(shape)
    const r = sm.mul(a, b)

    for (let i = 0; i < a.shape.length; i++) {
      expect(r.shape[i]).toBe(shape[i])
    }
    expectArraysClose(r.toFloat32Array(), [5, 6, -12, 28])
  })
  it('should copy', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4]))
    const b = a.copy()
    const aVal = a.toFloat32Array(),
      bVal = b.toFloat32Array(),
      length = a.elements
    for (let i = 0; i < length; i++) {
      expect(aVal[i]).toBe(bVal[i])
    }
  })
})
