import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('mse', () => {
  it('should be near zero', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3]))
    const b = sm.tensor(new Float32Array([1, 2, 3]))
    const mse = sm.loss.mse(a, b)
    expectArraysClose(mse.toFloat32Array(), [0])
  })
  it('nonzero loss', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3]))
    const b = sm.tensor(new Float32Array([-1, -2, -3]))
    const mse = sm.loss.mse(a, b)
    expectArraysClose(mse.toFloat32Array(), [18.666])
  })
})

describe('mae', () => {
  it('should be near zero', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3]))
    const b = sm.tensor(new Float32Array([1, 2, 3]))
    const loss = sm.loss.mae()
    const mae = loss(a, b)
    expectArraysClose(mae.toFloat32Array(), [0])
  })
  it('nonzero loss', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3]))
    const b = sm.tensor(new Float32Array([-1, -2, -3]))
    const loss = sm.loss.mae()
    const mae = loss(a, b)
    expectArraysClose(mae.toFloat32Array(), [4])
  })
})

describe('crossEntropy', () => {
  it('zero loss', () => {
    const a = tableToTensor([
      [0, 1, 0],
      [0, 0, 1]
    ])
    const b = tableToTensor([
      [0, 1, 0],
      [0, 0, 1]
    ])
    const loss = sm.loss.crossEntropy()
    expectArraysClose(loss(a, b).toFloat32Array(), [0])
  })
  it('nonzero loss', () => {
    const a = tableToTensor([
      [0, 1, 0],
      [0, 0, 1]
    ])
    const b = tableToTensor([
      [0.05, 0.95, 0],
      [0.1, 0.8, 0.1]
    ])
    const loss = sm.loss.crossEntropy()
    expectArraysClose(loss(a, b).toFloat32Array(), [1.177])
  })
})

describe('binaryCrossEntropy', () => {
  it('zero loss', () => {
    const a = sm.tensor(new Float32Array([0, 1, 0, 1]))
    const b = sm.tensor(new Float32Array([0, 1, 0, 1]))
    const loss = sm.loss.binaryCrossEntropy()
    expectArraysClose(loss(a, b).toFloat32Array(), [0])
  })
  it('nonzero loss', () => {
    const a = sm.tensor(new Float32Array([0, 1, 0, 1]))
    const b = sm.tensor(new Float32Array([0.2, 0.9, 0.5, 0.4]))
    const loss = sm.loss.binaryCrossEntropy()
    expectArraysClose(loss(a, b).toFloat32Array(), [0.484486])
  })
})

const tableToTensor = (table: number[][]): sm.Tensor =>
  sm.tensor(new Float32Array(table.flat())).reshape([table.length, table[0].length])
