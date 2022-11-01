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
  it('tidy - basic', () => {
    const N = 64
    const a = sm.randn([N, 64])
    const b = sm.identity(N)
    const c = sm.randn([N, 1])
    const start_bytes = sm.bytesUsed()

    const mm_pw_op = () => {
      let d = a
      for (let i = 0; i < 128; i++) {
        d = b.matmul(d)
        for (let j = 0; j < 16; j++) {
          d = d.add(c)
        }
      }
      const o = d.sum().toFloat32()
      return o
    }
    const o = sm.util.tidy(mm_pw_op)
    expect(typeof o).toBe('number')
    expect(sm.bytesUsed()).toBe(start_bytes)
    a.dispose()
    b.dispose()
    c.dispose()
  })

  it('tidy => Tensor', () => {
    const N = 64
    const a = sm.randn([N, 64])
    const b = sm.identity(N)
    const c = sm.randn([N, 1])
    const start_bytes = sm.bytesUsed()

    const mm_pw_op = () => {
      let d = a
      for (let i = 0; i < 128; i++) {
        d = b.matmul(d)
        for (let j = 0; j < 16; j++) {
          d = d.add(c)
        }
      }
      return d.sum()
    }
    const o = sm.util.tidy(mm_pw_op)
    expect(o instanceof sm.Tensor).toBe(true)
    o.dispose()
    expect(sm.bytesUsed()).toBe(start_bytes)
    a.dispose()
    b.dispose()
    c.dispose()
  })

  it('tidy => Tensor[]', () => {
    const N = 64
    const a = sm.randn([N, 64])
    const b = sm.identity(N)
    const c = sm.randn([N, 1])
    const start_bytes = sm.bytesUsed()

    const mm_pw_op = () => {
      const out: sm.Tensor[] = []
      let iters = 0
      while (iters < 4) {
        let d = a
        for (let i = 0; i < 32 * iters; i++) {
          d = b.matmul(d)
          for (let j = 0; j < 4 * iters; j++) {
            d = d.add(c)
          }
        }
        out.push(d.sum())
        iters++
      }
      return out
    }
    const o = sm.util.tidy(mm_pw_op)
    for (let i = 0; i < o.length; i++) {
      expect(o[i] instanceof sm.Tensor).toBe(true)
    }
    expect(sm.bytesUsed()).toBe(start_bytes)
    a.dispose()
    b.dispose()
    c.dispose()
  })
})
