import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { areSameShape, expectArraysClose, expectThrows } from './utils'

function stddev(vals: number[]): number {
  const mean = vals.reduce((r, c) => r + c, 0) / vals.length
  const variance = vals.reduce((r, c) => r + Math.pow(c - mean, 2), 0) / vals.length
  return Math.sqrt(variance)
}

describe('LayerNorm', () => {
  it('1D norm', () => {
    const module = new sm.module.LayerNorm([3])
    const vals = [2, 4, 9] // mean 5
    const std = stddev(vals)
    const tensor = sm.tensor(new Float32Array(vals))

    const result = module(tensor)
    const expected = [-3 / std, -1 / std, 4 / std]
    expectArraysClose(result.toFloat32Array(), expected)
    areSameShape(result, tensor)
  })
  it('1D norm on 2D tensor', () => {
    const module = new sm.module.LayerNorm([3])
    const vals = [2, 4, 9, 100, 200, 300]
    const std0 = stddev([2, 4, 9])
    const std1 = stddev([100, 200, 300])
    const tensor = sm.tensor(new Float32Array(vals)).reshape([2, 3])

    const result = module(tensor)
    const expected = [-3 / std0, -1 / std0, 4 / std0, -100 / std1, 0 / std1, 100 / std1]
    expectArraysClose(result.toFloat32Array(), expected)
    areSameShape(result, tensor)
  })
  it('2D norm', () => {
    const module = new sm.module.LayerNorm([3, 2])
    const vals = [2, 4, 9, 11, 13, 15] // mean 9
    const std = stddev(vals)
    const tensor = sm.tensor(new Float32Array(vals)).reshape([3, 2])

    const result = module(tensor)
    const expected = [-7 / std, -5 / std, 0 / std, 2 / std, 4 / std, 6 / std]
    expectArraysClose(result.toFloat32Array(), expected)
    areSameShape(result, tensor)
  })
  it('2D norm on 3D tensor', () => {
    const module = new sm.module.LayerNorm([3, 2])
    const vals0 = [2, 4, 9, 11, 13, 15] // mean 9
    const vals1 = [100, 200, 300, 400, 500, 600] // mean 350
    const std0 = stddev(vals0)
    const std1 = stddev(vals1)
    const tensor = sm.tensor(new Float32Array(vals0.concat(vals1))).reshape([2, 3, 2])

    const result = module(tensor)
    const expected0 = [-7 / std0, -5 / std0, 0 / std0, 2 / std0, 4 / std0, 6 / std0]
    const expected1 = [-250 / std1, -150 / std1, -50 / std1, 50 / std1, 150 / std1, 250 / std1]
    expectArraysClose(result.toFloat32Array(), expected0.concat(expected1))
    areSameShape(result, tensor)
  })
  it('single element norm', () => {
    const module = new sm.module.LayerNorm([1])
    const vals = [2, 4, 9]
    const tensor = sm.tensor(new Float32Array(vals)).reshape([3, 1])

    const result0 = module(tensor)
    const expected0 = [0, 0, 0]
    expectArraysClose(result0.toFloat32Array(), expected0)
    areSameShape(result0, tensor)
  })
  it('batch samples are independent', () => {
    const module = new sm.module.LayerNorm([3])

    const singleTensor = sm.tensor(new Float32Array([2, 4, 9]))
    const batchTensor = sm
      .tensor(new Float32Array([2, 4, 9].concat([Math.random(), Math.random(), Math.random()])))
      .reshape([2, 3])

    const singleResult = module(singleTensor)
    const batchResult = module(batchTensor)

    expectArraysClose(batchResult.index([0, ':']).toFloat32Array(), singleResult.toFloat32Array())
    areSameShape(batchResult.index([0, ':']), singleResult)
  })
  it('big eps', () => {
    const module = new sm.module.LayerNorm([3], 1)
    const vals = [2, 4, 9] // mean 5
    const std = stddev(vals)
    const bigEpsStd = Math.sqrt(std * std + 1)
    const tensor = sm.tensor(new Float32Array(vals))

    const result = module(tensor)
    const expected = [-3 / bigEpsStd, -1 / bigEpsStd, 4 / bigEpsStd]
    expectArraysClose(result.toFloat32Array(), expected)
    areSameShape(result, tensor)
  })
  it('invalid eps', () => {
    expectThrows(
      () => new sm.module.LayerNorm([3], sm.full([1], 1)),
      new RegExp('must be a number or scalar')
    )
    expectThrows(
      () => new sm.module.LayerNorm([3], sm.full([2, 3], 1)),
      new RegExp('must be a number or scalar')
    )
    expectThrows(() => new sm.module.LayerNorm([3], 0), new RegExp('must be greater than 0'))
    expectThrows(() => new sm.module.LayerNorm([3], -1), new RegExp('must be greater than 0'))
  })
  it('scalar is invalid', () => {
    expectThrows(() => new sm.module.LayerNorm([]), new RegExp('cannot be applied to scalars'))
  })
  it('invalid 1D shape', () => {
    const module = new sm.module.LayerNorm([3])

    expectThrows(
      () => module(sm.tensor(new Float32Array([2, 4]))),
      new RegExp('must match module dimensions')
    )
    expectThrows(
      () => module(sm.tensor(new Float32Array([2, 3, 4, 5])).reshape([2, 2])),
      new RegExp('must match module dimensions')
    )
    expectThrows(
      () => module(sm.tensor(new Float32Array([2, 3, 4])).reshape([3, 1])),
      new RegExp('must match module dimensions')
    )
  })
  it('invalid 2D shape', () => {
    const module = new sm.module.LayerNorm([3, 2])

    expectThrows(
      () => module(sm.tensor(new Float32Array([2, 3]))),
      new RegExp('must match module dimensions')
    )
    expectThrows(
      () => module(sm.tensor(new Float32Array([2, 3, 4, 5, 6, 7]))),
      new RegExp('must match module dimensions')
    )
    expectThrows(
      () => module(sm.tensor(new Float32Array([2, 3, 4, 5])).reshape([2, 2])),
      new RegExp('must match module dimensions')
    )
    expectThrows(
      () => module(sm.tensor(new Float32Array([2, 3, 4, 5, 6, 7, 8, 9, 10])).reshape([3, 3])),
      new RegExp('must match module dimensions')
    )
  })
  it('invalid shape for single element', () => {
    const module = new sm.module.LayerNorm([1, 1, 1])

    expectThrows(
      () => module(sm.tensor(new Float32Array([2])).reshape([1, 1])),
      new RegExp('must match module dimensions')
    )
    expectThrows(() => module(sm.scalar(2)), new RegExp('must match module dimensions'))
  })
  it('calculates gradient', () => {
    const module = new sm.module.LayerNorm([3])
    const tensor = sm.tensor(new Float32Array([2, 4, 9])).requireGrad()

    const result = module(tensor).sum()
    result.backward()
    expect(!!tensor.grad).toBe(true)
  })
})
