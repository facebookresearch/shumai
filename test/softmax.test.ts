import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, expectThrows, isClose, isShape, nativeError } from './utils'

describe('softmax', () => {
  it('scalar positive any axis', () => {
    const tensor = sm.scalar(3)

    const result0 = sm.softmax(tensor, 0)
    expect(isClose(result0.toFloat32(), 1)).toBe(true)
    expect(isShape(result0, tensor.shape)).toBe(true)

    const result1 = sm.softmax(tensor, 1)
    expect(isClose(result1.toFloat32(), 1)).toBe(true)
    expect(isShape(result1, tensor.shape)).toBe(true)

    const resultn = sm.softmax(tensor, -1)
    expect(isClose(resultn.toFloat32(), 1)).toBe(true)
    expect(isShape(resultn, tensor.shape)).toBe(true)
  })
  it('scalar zero any axis', () => {
    const tensor = sm.scalar(0)

    const result0 = sm.softmax(tensor, 0)
    expect(isClose(result0.toFloat32(), 1)).toBe(true)
    expect(isShape(result0, tensor.shape)).toBe(true)

    const result1 = sm.softmax(tensor, 1)
    expect(isClose(result1.toFloat32(), 1)).toBe(true)
    expect(isShape(result1, tensor.shape)).toBe(true)

    const resultn = sm.softmax(tensor, -1)
    expect(isClose(resultn.toFloat32(), 1)).toBe(true)
    expect(isShape(resultn, tensor.shape)).toBe(true)
  })
  it('scalar negative any axis', () => {
    const tensor = sm.scalar(-3)

    const result0 = sm.softmax(tensor, 0)
    expect(isClose(result0.toFloat32(), 1)).toBe(true)
    expect(isShape(result0, tensor.shape)).toBe(true)

    const result1 = sm.softmax(tensor, 1)
    expect(isClose(result1.toFloat32(), 1)).toBe(true)
    expect(isShape(result1, tensor.shape)).toBe(true)

    const resultn = sm.softmax(tensor, -1)
    expect(isClose(resultn.toFloat32(), 1)).toBe(true)
    expect(isShape(resultn, tensor.shape)).toBe(true)
  })
  it('1D tensor', () => {
    const values = [-2, -1, 0, 1, 2]
    const tensor = sm.tensor(new Float32Array(values))

    const result = sm.softmax(tensor, 0)
    const resultArray = result.toFloat32Array()
    const expSum = values.reduce((r, c) => r + Math.exp(c), 0)
    const expectedArray = values.map((x) => Math.exp(x) / expSum)
    expectArraysClose(resultArray, expectedArray)
    expect(isShape(result, tensor.shape)).toBe(true)

    const resultSum = resultArray.reduce((r, c) => r + c, 0)
    expect(isClose(resultSum, 1))
  })
  it('1D zeros', () => {
    const values = [0, 0, 0, 0, 0]
    const tensor = sm.tensor(new Float32Array(values))

    const result = sm.softmax(tensor, 0)
    const resultArray = result.toFloat32Array()
    const expectedArray = values.map(() => 1 / 5)
    expectArraysClose(resultArray, expectedArray)
    expect(isShape(result, tensor.shape)).toBe(true)
  })
  it('1D tensor invalid axis', () => {
    const values = [-2, -1, 0, 1, 2]
    const tensor = sm.tensor(new Float32Array(values))

    expectThrows(() => sm.softmax(tensor, 1), nativeError)
  })
  it('1D tensor negative axis', () => {
    const values = [-2, -1, 0, 1, 2]
    const tensor = sm.tensor(new Float32Array(values))

    const result = sm.softmax(tensor, -1)
    const resultArray = result.toFloat32Array()
    const expSum = values.reduce((r, c) => r + Math.exp(c), 0)
    const expectedArray = values.map((x) => Math.exp(x) / expSum)
    expectArraysClose(resultArray, expectedArray)
    expect(isShape(result, tensor.shape)).toBe(true)

    const resultSum = resultArray.reduce((r, c) => r + c, 0)
    expect(isClose(resultSum, 1))
  })
  it('2D tensor', () => {
    const values = [-2, -1, 0, 0, 1, 2]
    const tensor = sm.tensor(new Float32Array(values)).reshape([2, 3])

    const result0 = sm.softmax(tensor, 0)
    const resultArray0 = result0.toFloat32Array()
    const expSums0 = [
      Math.exp(-2) + Math.exp(0),
      Math.exp(-1) + Math.exp(1),
      Math.exp(0) + Math.exp(2)
    ]
    const expectedArray0 = values.map((x, i) => Math.exp(x) / expSums0[i % 3])
    expectArraysClose(resultArray0, expectedArray0)
    expect(isShape(result0, tensor.shape)).toBe(true)
    const resultSums0 = [
      resultArray0[0] + resultArray0[3],
      resultArray0[1] + resultArray0[4],
      resultArray0[2] + resultArray0[5]
    ]
    expectArraysClose(resultSums0, [1, 1, 1])

    const result1 = sm.softmax(tensor, 1)
    const resultArray1 = result1.toFloat32Array()
    const expSums1 = [
      Math.exp(-2) + Math.exp(-1) + Math.exp(0),
      Math.exp(0),
      Math.exp(1) + Math.exp(2)
    ]
    const expectedArray1 = values.map((x, i) => Math.exp(x) / expSums1[i - (i % 3) / 3])
    expectArraysClose(resultArray1, expectedArray1)
    expect(isShape(result1, tensor.shape)).toBe(true)
    const resultSums1 = [
      resultArray1[0] + resultArray1[1] + resultArray1[2],
      resultArray1[3] + resultArray1[4] + resultArray1[5]
    ]
    expectArraysClose(resultSums1, [1, 1])
  })
  it('2D zeros', () => {
    const values = [0, 0, 0, 0, 0, 0]
    const tensor = sm.tensor(new Float32Array(values)).reshape([2, 3])

    const result0 = sm.softmax(tensor, 0)
    const expectedArray0 = values.map(() => 1 / 2)
    expectArraysClose(result0.toFloat32Array(), expectedArray0)
    expect(isShape(result0, tensor.shape)).toBe(true)

    const result1 = sm.softmax(tensor, 1)
    const expectedArray1 = values.map(() => 1 / 3)
    expectArraysClose(result1.toFloat32Array(), expectedArray1)
    expect(isShape(result1, tensor.shape)).toBe(true)
  })
  it('2D tensor invalid axis', () => {
    const values = [-2, -1, 0, 0, 1, 2]
    const tensor = sm.tensor(new Float32Array(values)).reshape([2, 3])

    expectThrows(() => sm.softmax(tensor, 2), nativeError)
  })
  it('2D tensor negative axis', () => {
    const values = [-2, -1, 0, 0, 1, 2]
    const tensor = sm.tensor(new Float32Array(values)).reshape([2, 3])

    const result0 = sm.softmax(tensor, -2)
    const resultArray0 = result0.toFloat32Array()
    const expSums0 = [
      Math.exp(-2) + Math.exp(0),
      Math.exp(-1) + Math.exp(1),
      Math.exp(0) + Math.exp(2)
    ]
    const expectedArray0 = values.map((x, i) => Math.exp(x) / expSums0[i % 3])
    expectArraysClose(resultArray0, expectedArray0)
    expect(isShape(result0, tensor.shape)).toBe(true)
    const resultSums0 = [
      resultArray0[0] + resultArray0[3],
      resultArray0[1] + resultArray0[4],
      resultArray0[2] + resultArray0[5]
    ]
    expectArraysClose(resultSums0, [1, 1, 1])

    const result1 = sm.softmax(tensor, -1)
    const resultArray1 = result1.toFloat32Array()
    const expSums1 = [
      Math.exp(-2) + Math.exp(-1) + Math.exp(0),
      Math.exp(0),
      Math.exp(1) + Math.exp(2)
    ]
    const expectedArray1 = values.map((x, i) => Math.exp(x) / expSums1[i - (i % 3) / 3])
    expectArraysClose(resultArray1, expectedArray1)
    expect(isShape(result1, tensor.shape)).toBe(true)
    const resultSums1 = [
      resultArray1[0] + resultArray1[1] + resultArray1[2],
      resultArray1[3] + resultArray1[4] + resultArray1[5]
    ]
    expectArraysClose(resultSums1, [1, 1])
  })
  it('chained', () => {
    const values = [-2, -1, 0, 0, 1, 2]
    const tensor = sm.tensor(new Float32Array(values)).reshape([2, 3])

    const result = tensor.softmax(0)
    const resultArray = result.toFloat32Array()
    const expSums = [
      Math.exp(-2) + Math.exp(0),
      Math.exp(-1) + Math.exp(1),
      Math.exp(0) + Math.exp(2)
    ]
    const expectedArray = values.map((x, i) => Math.exp(x) / expSums[i % 3])
    expectArraysClose(resultArray, expectedArray)
    expect(isShape(result, tensor.shape)).toBe(true)
    const resultSums = [
      resultArray[0] + resultArray[3],
      resultArray[1] + resultArray[4],
      resultArray[2] + resultArray[5]
    ]
    expectArraysClose(resultSums, [1, 1, 1])
  })
  it('propagates NaNs', () => {
    const tensor = sm.tensor(new Float32Array([1, 2, 3, NaN, 5, 6])).reshape([2, 3])
    const result0 = tensor.softmax(0)
    expectArraysClose(result0.index([':', 0]).toFloat32Array(), [NaN, NaN])
  })
})
