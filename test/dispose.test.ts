import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'

describe('dispose', () => {
  it('basic', () => {
    const start_bytes = sm.bytesUsed()
    for (let i = 0; i < 1000; i++) {
      const a = sm.tensor(new Float32Array(new Array(100).fill(Math.random())))
      a.dispose()
      expect(sm.bytesUsed()).toBe(start_bytes)
    }
    expect(sm.bytesUsed()).toBe(start_bytes)
  })
  it('tidy', () => {
    const N = 64
    const a = sm.randn([N, 64])
    const b = sm.identity(N)
    const c = sm.randn([N, 1])
    const start_bytes = sm.bytesUsed()

    const mm_pw_op = () => {
      let d = a
      for (let i = 0; i < 1000; ++i) {
        d = b.matmul(d)
        for (let j = 0; j < 10; ++j) {
          d = d.add(c)
        }
      }
      const o = d.sum().toFloat32()
      return o
    }
    const o = sm.util.tidy(mm_pw_op)
    expect(typeof o).toBe('number')
    expect(sm.bytesUsed()).toBe(start_bytes)
  })
})
