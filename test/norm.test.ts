import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { isClose } from './utils'

describe('norm', () => {
  it('scalar norm', () => {
    const a = sm.scalar(-22.0)
    const norm = sm.norm(a)
    expect(norm.valueOf()).toBe(22)
  })
  it('vector inf norm', () => {
    const a = sm.tensor(new Float32Array([1, -2, 3, -4]))
    const norm = sm.norm(a, [0], Infinity)
    expect(norm.toFloat32()).toBe(4)
  })
  it('vector -inf norm', () => {
    const a = sm.tensor(new Float32Array([1, -2, 3, -4]))
    const norm = sm.norm(a, [0], -Infinity)
    expect(norm.toFloat32()).toBe(1)
  })
  it('vector 1 norm', () => {
    const a = sm.tensor(new Float32Array([1, -2, 3, -4]))
    const norm = sm.norm(a, [0], 1)
    expect(norm.toFloat32()).toBe(10)
  })
  it('vector 2 norm', () => {
    const a = sm.tensor(new Float32Array([1, -2, 3, -4]))
    const norm = sm.norm(a, [0], 2)
    expect(isClose(norm.toFloat32(), 5.4772)).toBe(true)
  })
})
