import { it, describe } from 'bun:test'
import * as sm from '@shumai/shumai'
import { expectArraysClose } from './utils'

describe('activations', () => {
  it('relu negative', () => {
    console.log(sm.relu(sm.scalar(-10)).toFloat32Array())
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
})
