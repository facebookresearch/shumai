import { it, describe, expect } from 'bun:test'
import * as sm from 'shumaiml'
import { isClose } from './utils'

describe('norm', () => {
  it('scalar norm', () => {
    const a = sm.scalar(-22.0)
    const norm = sm.norm(a)
    expect(norm.valueOf()).toBe(22)
  })

  /* TODO: FIX - CURRENTLY FAILS (UNSUPPORTED) */
  it('vector inf norm', () => {
    const a = sm.tensor(new Float32Array([1, -2, 3, -4]))
    const norm = sm.norm(a, [0], Infinity)
    expect(norm.valueOf()).toBe(4)
  })

  /* TODO: FIX - CURRENTLY FAILS (UNSUPPORTED) */
  it('vector -inf norm', () => {
    const a = sm.tensor(new Float32Array([1, -2, 3, -4]))
    const norm = sm.norm(a, [0], -Infinity)
    expect(norm.valueOf()).toBe(1)
  })

  it('vector 1 norm', () => {
    const a = sm.tensor(new Float32Array([1, -2, 3, -4]))
    const norm = sm.norm(a, [0], 1)
    expect(norm.valueOf()).toBe(10)
  })

  it('vector 2 norm', () => {
    const a = sm.tensor(new Float32Array([1, -2, 3, -4]))
    const norm = sm.norm(a, [0], 2)
    expect(isClose(<number>norm.valueOf(), 5.4772)).toBe(true)
  })
})
