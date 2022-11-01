import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('activations', () => {
  it('relu negative', () => {
    expectArraysClose(sm.relu(sm.scalar(-10)).toFloat32Array(), [0])
  })
  it('relu positive', () => {
    expectArraysClose(sm.relu(sm.scalar(13)).toFloat32Array(), [13])
  })
  it('leakyRelu negative', () => {
    expectArraysClose(sm.leakyRelu(sm.scalar(-10), 0.1).toFloat32Array(), [-1])
  })
  it('leakyRelu positive', () => {
    expectArraysClose(sm.leakyRelu(sm.scalar(11), 0.1).toFloat32Array(), [11])
  })
  it('swish negative', () => {
    expectArraysClose(sm.swish(sm.scalar(-10)).toFloat32Array(), [-4.975])
  })
  it('swish positive', () => {
    expectArraysClose(sm.swish(sm.scalar(10)).toFloat32Array(), [5.025])
  })
  it('elu negative', () => {
    expectArraysClose(sm.elu(sm.scalar(-10)).toFloat32Array(), [-1])
  })
  it('elu positive', () => {
    expectArraysClose(sm.elu(sm.scalar(10)).toFloat32Array(), [10])
  })
  it('thresholdRelu negative', () => {
    expectArraysClose(sm.thresholdRelu(sm.scalar(-5)).toFloat32Array(), [0])
  })
  it('thresholdRelu positive', () => {
    expectArraysClose(sm.thresholdRelu(sm.scalar(5)).toFloat32Array(), [5])
  })
  it('relu6 negative', () => {
    expectArraysClose(sm.relu6(sm.scalar(-5)).toFloat32Array(), [0])
  })
  it('relu6 positive', () => {
    expectArraysClose(sm.relu6(sm.scalar(5)).toFloat32Array(), [5])
  })
  it('hardTanh negative', () => {
    expectArraysClose(sm.hardTanh(sm.scalar(-5)).toFloat32Array(), [-1])
  })
  it('hardTanh positive', () => {
    expectArraysClose(sm.hardTanh(sm.scalar(5)).toFloat32Array(), [1])
  })
})
