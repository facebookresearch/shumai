import * as sm from '@shumai/shumai'
import { it, describe } from 'bun:test'
import { expectArraysClose } from './utils'

describe('loss', () => {
  it('should be near zero', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3]))
    const b = sm.tensor(new Float32Array([1, 2, 3]))
    console.log(sm, sm.loss)
    const mse = sm.loss.mse(a, b)
    expectArraysClose(mse.toFloat32Array(), [0])
  })
  it('nonzero loss', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3]))
    const b = sm.tensor(new Float32Array([-1, -2, -3]))
    console.log(sm, sm.loss)
    const mse = sm.loss.mse(a, b)
    expectArraysClose(mse.toFloat32Array(), [18.666])
  })
})
