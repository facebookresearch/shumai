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
      o[i].dispose()
    }
    expect(sm.bytesUsed()).toBe(start_bytes)
    a.dispose()
    b.dispose()
    c.dispose()
  })
  it('tidy => Record<string, Tensor>', () => {
    const N = 64
    const a = sm.randn([N, 64])
    const b = sm.identity(N)
    const c = sm.randn([N, 1])
    const start_bytes = sm.bytesUsed()

    const mm_pw_op = () => {
      const out: Record<number, sm.Tensor> = {}
      let iters = 0
      while (iters < 4) {
        let d = a
        for (let i = 0; i < 32 * iters; i++) {
          d = b.matmul(d)
          for (let j = 0; j < 4 * iters; j++) {
            d = d.add(c)
          }
        }
        out[iters] = d.sum()
        iters++
      }
      return out
    }
    const o = sm.util.tidy(mm_pw_op)
    const o_keys = Object.keys(o)
    for (let i = 0; i < o_keys.length; i++) {
      expect(o[o_keys[i]] instanceof sm.Tensor).toBe(true)
      if (o[o_keys[i]] instanceof sm.Tensor) o[o_keys[i]].dispose()
    }
    expect(sm.bytesUsed()).toBe(start_bytes)
    a.dispose()
    b.dispose()
    c.dispose()
  })
  it('tidy => Record<string, Tensor>[]', () => {
    const N = 64
    const a = sm.randn([N, 64])
    const b = sm.identity(N)
    const c = sm.randn([N, 1])
    const start_bytes = sm.bytesUsed()

    const mm_pw_op = () => {
      const out: Record<number, sm.Tensor>[] = []
      for (let i = 0; i < 4; i++) {
        let iters = 0
        const record: Record<number, sm.Tensor> = {}
        while (iters < 4) {
          let d = a
          for (let j = 0; j < 8 * iters; j++) {
            d = b.matmul(d)
            for (let k = 0; k < 1 * iters; k++) {
              d = d.add(c)
            }
          }
          record[d.ptr] = d.sum()
          iters++
        }
        out.push(record)
      }
      return out
    }
    const o = sm.util.tidy(mm_pw_op)
    for (let i = 0; i < o.length; i++) {
      const keys = Object.keys(o[i])
      for (let j = 0; j < keys.length; j++) {
        expect(o[i][keys[j]] instanceof sm.Tensor).toBe(true)
        if (o[i][keys[j]] instanceof sm.Tensor) o[i][keys[j]].dispose()
      }
    }
    expect(sm.bytesUsed()).toBe(start_bytes)
    a.dispose()
    b.dispose()
    c.dispose()
  })
  it('tidy => nested object with circular refs', () => {
    const N = 64
    const a = sm.randn([N, 64])
    const b = sm.identity(N)
    const c = sm.randn([N, 1])
    const start_bytes = sm.bytesUsed()

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const mm_pw_op = (): [Record<string, any>, sm.Tensor[]] => {
      const out: Record<string, any> = {}
      /* eslint-enable @typescript-eslint/no-explicit-any */
      for (let i = 0; i < 4; i++) {
        let iters = 0
        const record: Record<number, sm.Tensor> = {}
        while (iters < 4) {
          let d = a
          for (let j = 0; j < 8 * iters; j++) {
            d = b.matmul(d)
            for (let k = 0; k < 1 * iters; k++) {
              d = d.add(c)
            }
          }
          record[d.ptr] = d.sum()
          iters++
        }
        out[i.toString()] = record
      }
      const out_tensors: sm.Tensor[] = []
      const out_keys = Object.keys(out)
      for (let i = 0; i < out_keys.length; i++) {
        const keys = Object.keys(out[out_keys[i]])
        for (let j = 0; j < keys.length; j++) {
          if (out[out_keys[i]][keys[j]] instanceof sm.Tensor)
            out_tensors.push(out[out_keys[i]][keys[j]])
        }
      }
      out['2'][1] = out['1']
      out['1'][199] = out['2']
      return [out, out_tensors]
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [, tensors] = sm.util.tidy<[Record<string, any>, sm.Tensor[]]>(mm_pw_op)
    for (let i = 0; i < tensors.length; i++) {
      expect(tensors[i] instanceof sm.Tensor).toBe(true)
      tensors[i].dispose()
    }
    expect(sm.bytesUsed()).toBe(start_bytes)
    a.dispose()
    b.dispose()
    c.dispose()
  })
})
