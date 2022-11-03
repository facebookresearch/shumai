import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, isShape } from './utils'

describe('triu', () => {
  it('basic', () => {
    const tensor = sm.full([3, 3], 1).triu()
    expect(isShape(tensor, [3, 3])).toBe(true)
    expectArraysClose(tensor.toFloat32Array(), new Float32Array([1, 1, 1, 0, 1, 1, 0, 0, 1]))
  })
})

describe('tril', () => {
  it('basic', () => {
    const tensor = sm.full([3, 3], 1).tril()
    expect(isShape(tensor, [3, 3])).toBe(true)
    expectArraysClose(tensor.toFloat32Array(), new Float32Array([1, 0, 0, 1, 1, 0, 1, 1, 1]))
  })
})
