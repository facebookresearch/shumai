import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('logicalNot', () => {
  it('1D Tensor', () => {
    let a = sm.tensor(new Float32Array([1, 0, 0]))
    expectArraysClose(sm.logicalNot(a).toFloat32Array(), [0, 1, 1])

    a = sm.tensor(new Float32Array([0, 0, 0]))
    expectArraysClose(sm.logicalNot(a).toFloat32Array(), [1, 1, 1])

    a = sm.tensor(new Float32Array([1, 1]))
    expectArraysClose(sm.logicalNot(a).toFloat32Array(), [0, 0])
  })
  it('1D Tensor, chaining', () => {
    let a = sm.tensor(new Float32Array([1, 0, 0]))
    expectArraysClose(a.logicalNot().toFloat32Array(), [0, 1, 1])

    a = sm.tensor(new Float32Array([0, 0, 0]))
    expectArraysClose(a.logicalNot().toFloat32Array(), [1, 1, 1])

    a = sm.tensor(new Float32Array([1, 1]))
    expectArraysClose(a.logicalNot().toFloat32Array(), [0, 0])
  })
  it('2D Tensor', () => {
    let a = sm.tensor(new Float32Array([1, 0, 1, 0, 0, 0])).reshape([2, 3])
    expectArraysClose(sm.logicalNot(a).toFloat32Array(), [0, 1, 0, 1, 1, 1])

    a = sm.tensor(new Float32Array([0, 0, 0, 1, 1, 1])).reshape([2, 3])
    expectArraysClose(sm.logicalNot(a).toFloat32Array(), [1, 1, 1, 0, 0, 0])
  })
  it('3D Tensor', () => {
    let a = sm.tensor(new Float32Array([1, 0, 1, 0, 0, 0])).reshape([2, 3, 1])
    expectArraysClose(sm.logicalNot(a).toFloat32Array(), [0, 1, 0, 1, 1, 1])

    a = sm.tensor(new Float32Array([0, 0, 0, 1, 1, 1])).reshape([2, 3, 1])
    expectArraysClose(sm.logicalNot(a).toFloat32Array(), [1, 1, 1, 0, 0, 0])
  })
  it('4D Tensor', () => {
    let a = sm.tensor(new Float32Array([1, 0, 1, 0])).reshape([2, 2, 1, 1])
    expectArraysClose(sm.logicalNot(a).toFloat32Array(), [0, 1, 0, 1])

    a = sm.tensor(new Float32Array([0, 0, 0, 0])).reshape([2, 2, 1, 1])
    expectArraysClose(sm.logicalNot(a).toFloat32Array(), [1, 1, 1, 1])

    a = sm.tensor(new Float32Array([1, 1, 1, 1])).reshape([2, 2, 1, 1])
    expectArraysClose(sm.logicalNot(a).toFloat32Array(), [0, 0, 0, 0])
  })
  /* TODO: FIX - CURRENTLY FAILS (Throws C++ Exception)
    it('6D Tensor', () => {
      const a = sm.tensor(new Float32Array([1, 0, 1, 0])).reshape([2, 2, 1, 1, 1, 1])
      expectArraysClose(sm.logicalNot(a).toFloat32Array(), [0, 1, 0, 1])
    })
  */
  /* TODO: unit tests for gradients */
})
