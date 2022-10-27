import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('logicalOr', () => {
  it('1D Tensor', () => {
    let a = sm.tensor(new Float32Array([1, 0, 0]))
    let b = sm.tensor(new Float32Array([0, 1, 0]))
    expectArraysClose(sm.logicalOr(a, b).toFloat32Array(), [1, 1, 0])

    a = sm.tensor(new Float32Array([0, 0, 0]))
    b = sm.tensor(new Float32Array([0, 0, 0]))
    expectArraysClose(sm.logicalOr(a, b).toFloat32Array(), [0, 0, 0])

    a = sm.tensor(new Float32Array([1, 1]))
    b = sm.tensor(new Float32Array([1, 1]))
    expectArraysClose(sm.logicalOr(a, b).toFloat32Array(), [1, 1])
  })
  it('2D Tensor', () => {
    let a = sm.tensor(new Float32Array([1, 0, 1, 0, 0, 0])).reshape([2, 3])
    let b = sm.tensor(new Float32Array([0, 0, 0, 0, 1, 0])).reshape([2, 3])
    expectArraysClose(sm.logicalOr(a, b).toFloat32Array(), [1, 0, 1, 0, 1, 0])

    a = sm.tensor(new Float32Array([0, 0, 0, 1, 1, 1])).reshape([2, 3])
    b = sm.tensor(new Float32Array([0, 0, 0, 1, 1, 1])).reshape([2, 3])
    expectArraysClose(sm.logicalOr(a, b).toFloat32Array(), [0, 0, 0, 1, 1, 1])
  })
  it('broadcast 2D Tensor shapes', () => {
    const a = sm.tensor(new Float32Array([1, 0])).reshape([2, 1])
    const b = sm.tensor(new Float32Array([0, 0, 0, 0, 1, 0])).reshape([2, 3])
    expectArraysClose(sm.logicalOr(a, b).toFloat32Array(), [1, 1, 1, 0, 1, 0])
  })
  it('3D Tensor', () => {
    let a = sm.tensor(new Float32Array([1, 0, 1, 0, 0, 0])).reshape([2, 3, 1])
    let b = sm.tensor(new Float32Array([0, 0, 1, 1, 0, 0])).reshape([2, 3, 1])
    expectArraysClose(sm.logicalOr(a, b).toFloat32Array(), [1, 0, 1, 1, 0, 0])

    a = sm.tensor(new Float32Array([0, 0, 0, 1, 1, 1])).reshape([2, 3, 1])
    b = sm.tensor(new Float32Array([0, 0, 0, 1, 1, 1])).reshape([2, 3, 1])
    expectArraysClose(sm.logicalOr(a, b).toFloat32Array(), [0, 0, 0, 1, 1, 1])
  })
  it('broadcast 3D Tensor shapes', () => {
    const a = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0])).reshape([2, 3, 2])
    const b = sm.tensor(new Float32Array([0, 0, 1, 1, 0, 0])).reshape([2, 3, 1])
    expectArraysClose(sm.logicalOr(a, b).toFloat32Array(), [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0])
  })
  it('4D Tensor', () => {
    let a = sm.tensor(new Float32Array([1, 0, 1, 0])).reshape([2, 2, 1, 1])
    let b = sm.tensor(new Float32Array([0, 1, 0, 0])).reshape([2, 2, 1, 1])
    expectArraysClose(sm.logicalOr(a, b).toFloat32Array(), [1, 1, 1, 0])

    a = sm.tensor(new Float32Array([0, 0, 0, 0])).reshape([2, 2, 1, 1])
    b = sm.tensor(new Float32Array([0, 0, 0, 0])).reshape([2, 2, 1, 1])
    expectArraysClose(sm.logicalOr(a, b).toFloat32Array(), [0, 0, 0, 0])

    a = sm.tensor(new Float32Array([1, 1, 1, 1])).reshape([2, 2, 1, 1])
    b = sm.tensor(new Float32Array([1, 1, 1, 1])).reshape([2, 2, 1, 1])
    expectArraysClose(sm.logicalOr(a, b).toFloat32Array(), [1, 1, 1, 1])
  })
  it('broadcast 4D Tensor shapes', () => {
    const a = sm.tensor(new Float32Array([1, 0, 1, 0])).reshape([2, 2, 1, 1])
    const b = sm.tensor(new Float32Array([1, 0, 0, 0, 0, 0, 1, 1])).reshape([2, 2, 1, 2])
    expectArraysClose(sm.logicalOr(a, b).toFloat32Array(), [1, 1, 0, 0, 1, 1, 1, 1])
  })
  /* TODO: unit tests for gradients */
})
