import * as sm from '@shumai/shumai'
import { it, expect, describe } from 'bun:test'
import { isShape, isClose } from './utils'

describe('index', () => {
  it('single element 1D', () => {
    const t = sm.randn([128])
    const ref = t.toFloat32Array()[7]
    const s = t.index([7])
    const check = s.toFloat32()
    expect(isClose(ref, check)).toBe(true)
  })
  it('single element 2D', () => {
    const t = sm.randn([128, 8])
    const ref = t.toFloat32Array()[9]
    const s = t.index([1, 1])
    const check = s.toFloat32()
    expect(isClose(ref, check)).toBe(true)
  })
  it('range 1D', () => {
    const t = sm.randn([128])
    const s = t.index([':'])
    expect(isShape(s, [128])).toBe(true)
  })
  it('range 2D', () => {
    const t = sm.randn([128, 128])
    const s = t.index([':', 1])
    expect(isShape(s, [128])).toBe(true)
  })
})
describe('indexedAssign', () => {
  it('single element 1D', () => {
    const t = sm.randn([128])
    const o = sm.randn([1])
    const ref = o.toFloat32()
    const s = t.indexedAssign(o, [7])
    const check = s.toFloat32()
    expect(isClose(ref, check)).toBe(true)
  })
  /* TODO: FIX - CURRENTLY FAILS */
  it('range 2D', () => {
    const t = sm.randn([128, 8])
    const o = sm.randn([128])
    const ref = o.toFloat32Array()
    const s = t.indexedAssign(o, [':', 2])
    for (let i = 0; i < 128; ++i) {
      const check = s.toFloat32Array()[2 * 128 + i]
      expect(isClose(ref[i], check)).toBe(true)
    }
  })
})
