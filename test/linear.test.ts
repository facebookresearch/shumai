import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { isShape } from './utils'

describe('linear', () => {
  it('basic construction', () => {
    const x = sm.randn([1, 64])
    const l = sm.module.linear(64, 128)
    const y = l(x)
    expect(isShape(y, [1, 128])).toBe(true)
  })
  it('single sample', () => {
    const x = sm.randn([64])
    const l = sm.module.linear(64, 128)
    const y = l(x)
    expect(isShape(y, [128])).toBe(true)
  })
  it('batch', () => {
    const x = sm.randn([37, 64])
    const l = sm.module.linear(64, 128)
    const y = l(x)
    expect(isShape(y, [37, 128])).toBe(true)
  })
  it('gradient', () => {
    const x = sm.randn([2, 64])
    x.requires_grad = true
    const l = sm.module.linear(64, 128)
    const y = l(x)
    y.sum().backward()
    expect(!!x.grad).toBe(true)
  })
  it('single sample gradient', () => {
    const x = sm.randn([64])
    x.requires_grad = true
    const l = sm.module.linear(64, 128)
    const y = l(x)
    y.sum().backward()
    expect(!!x.grad).toBe(true)
  })
})
