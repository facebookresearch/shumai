import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose, isShape } from './utils'
describe('unsqueeze', () => {
  it('leading', () => {
    const a = sm.randn([4, 4])
    const b = a.unsqueeze(0)
    expect(isShape(b, [1, 4, 4])).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('trailing', () => {
    const a = sm.randn([4, 4])
    const b = a.unsqueeze(2)
    expect(isShape(b, [4, 4, 1])).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('negative', () => {
    const a = sm.randn([4, 4])
    const b = a.unsqueeze(-2)
    expect(isShape(b, [4, 1, 4])).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
})
describe('squeeze', () => {
  it('all dims', () => {
    const a = sm.randn([4, 1, 4, 1])
    const b = a.squeeze()
    expect(isShape(b, [4, 4])).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('positive dim', () => {
    const a = sm.randn([4, 1, 4, 1])
    const b = a.squeeze(1)
    expect(isShape(b, [4, 4, 1])).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
  it('negative dim', () => {
    const a = sm.randn([4, 1, 4, 1])
    const b = a.squeeze(-1)
    expect(isShape(b, [4, 1, 4])).toBe(true)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
})
