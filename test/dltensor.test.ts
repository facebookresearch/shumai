import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { areSameShape, expectArraysClose } from './utils'

describe('dltensor', () => {
  it('float', () => {
    const a = sm.randn([4, 4])
    const dlt = a.toDLTensor()
    const b = sm.fromDLTensor(dlt)
    expectArraysClose(b.toFloat32Array(), a.toFloat32Array())
    expect(areSameShape(a, b)).toBe(true)
  })
  it('float big', () => {
    const a = sm.randn([128, 128, 128])
    const dlt = a.toDLTensor()
    const b = sm.fromDLTensor(dlt)
    expectArraysClose(b.toFloat32Array(), a.toFloat32Array())
    expect(areSameShape(a, b)).toBe(true)
  })
  it('int', () => {
    const a = sm.randn([4, 4]).mul(sm.scalar(100)).astype(sm.dtype.Int32)
    const dlt = a.toDLTensor()
    const b = sm.fromDLTensor(dlt)
    expectArraysClose(b.toInt32Array(), a.toInt32Array())
    expect(areSameShape(a, b)).toBe(true)
  })
  it('int big', () => {
    const a = sm.randn([128, 128, 128]).mul(sm.scalar(100)).astype(sm.dtype.Int32)
    const dlt = a.toDLTensor()
    const b = sm.fromDLTensor(dlt)
    expectArraysClose(b.toInt32Array(), a.toInt32Array())
    expect(areSameShape(a, b)).toBe(true)
  })
  it('double', () => {
    const a = sm.randn([4, 4]).mul(sm.scalar(100)).astype(sm.dtype.Float64)
    const dlt = a.toDLTensor()
    const b = sm.fromDLTensor(dlt)
    expectArraysClose(b.toFloat64Array(), a.toFloat64Array())
    expect(areSameShape(a, b)).toBe(true)
  })
  it('double big', () => {
    const a = sm.randn([128, 128, 128]).mul(sm.scalar(100)).astype(sm.dtype.Float64)
    const dlt = a.toDLTensor()
    const b = sm.fromDLTensor(dlt)
    expectArraysClose(b.toFloat64Array(), a.toFloat64Array())
    expect(areSameShape(a, b)).toBe(true)
  })
  it('long', () => {
    const a = sm.randn([4, 4]).mul(sm.scalar(100)).astype(sm.dtype.Int64)
    const dlt = a.toDLTensor()
    const b = sm.fromDLTensor(dlt)
    expectArraysClose(b.toBigInt64Array(), a.toBigInt64Array())
    expect(areSameShape(a, b)).toBe(true)
  })
  it('long big', () => {
    const a = sm.randn([128, 128, 128]).mul(sm.scalar(100)).astype(sm.dtype.Int64)
    const dlt = a.toDLTensor()
    const b = sm.fromDLTensor(dlt)
    expectArraysClose(b.toBigInt64Array(), a.toBigInt64Array())
    expect(areSameShape(a, b)).toBe(true)
  })
})
