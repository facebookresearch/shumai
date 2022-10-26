import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, isShape } from './utils'

describe('pad', () => {
  it('basic', () => {
    const a = sm.full([3, 3], 1)
    const b = a.pad([
      [0, 0],
      [1, 1]
    ])
    expect(isShape(b, [3, 5])).toBe(true)
    expectArraysClose(
      b.toFloat32Array(),
      new Float32Array([0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0])
    )
  })
})
