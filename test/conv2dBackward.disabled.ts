import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('conv2dBackwardData', () => {
  it('basic', () => {
    const grad_in = sm.full([1, 1, 2, 2], 1) // y.sum().backward()
    const x = sm.full([1, 1, 4, 4], 1) // x
    const w = sm.full([1, 1, 3, 3], 1) // w
    const b = sm.full([1, 1, 2, 2], 0) // b implicitly 0
    const [sx, sy] = [1, 1]
    const [px, py] = [0, 0]
    const [dx, dy] = [1, 1]
    const groups = 1

    const expected_output = sm
      .tensor(new Float32Array([1, 2, 2, 1, 2, 4, 4, 2, 2, 4, 4, 2, 1, 2, 2, 1]))
      .reshape([1, 1, 4, 4])

    const res = sm.conv2dBackwardData(grad_in, x, w, b, sx, sy, px, py, dx, dy, groups)

    expectArraysClose(res.toFloat32Array(), expected_output.toFloat32Array())
  })
})
