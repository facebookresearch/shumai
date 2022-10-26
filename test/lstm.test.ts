import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { areSameShape } from './utils'

describe('lstm', () => {
  it('basic construction', () => {
    const x = sm.randn([1, 64])
    const h = sm.randn([1, 128])
    const c = sm.randn([1, 128])
    const l = sm.module.lstm(64, 128)
    const [hn, cn] = l(x, h, c)
    expect(areSameShape(hn, h)).toBe(true)
    expect(areSameShape(cn, c)).toBe(true)
  })
  it('gradient', () => {
    const x = sm.randn([1, 64])
    x.requires_grad = true
    const h = sm.full([1, 128], 0)
    const c = sm.full([1, 128], 0)
    const l = sm.module.lstm(64, 128)
    const [hn] = l(x, h, c)
    hn.sum().backward()
    expect(!!x.grad).toBe(true)
  })
})
