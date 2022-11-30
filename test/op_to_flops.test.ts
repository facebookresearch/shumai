import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'

describe('op_to_flops', () => {
  describe('default', () => {
    it('0 tensors', () => {
      const flops = sm.opToFlops('unknownOp', [], { elements: 0 } as sm.Tensor)
      expect(flops).toBe(0)
    })

    it('1 tensor', () => {
      const flops = sm.opToFlops('unknownOp', [{ elements: 100 }], { elements: 100 } as sm.Tensor)
      expect(flops).toBe(100)
    })

    it('2 tensors', () => {
      const flops = sm.opToFlops('unknownOp', [{ elements: 100 }, { elements: 200 }], {
        elements: 200
      } as sm.Tensor)
      expect(flops).toBe(200)
    })

    it('2 tensors + other args', () => {
      const flops = sm.opToFlops(
        'unknownOp',
        [{ elements: 100 }, { elements: 200 }, false, true, {}, 'yes'],
        { elements: 200 } as sm.Tensor
      )
      expect(flops).toBe(200)
    })
  })

  describe('matmul', () => {
    it('1d + scalar', () => {
      const flops = sm.opToFlops(
        'matmul',
        [
          { shape: [10], elements: 10 },
          { shape: [3], elements: 3 }
        ],
        { elements: 10 } as sm.Tensor
      )
      expect(flops).toBe(200)
    })

    it('1d tensors', () => {
      const flops = sm.opToFlops(
        'matmul',
        [
          { shape: [10], elements: 10 },
          { shape: [10], elements: 10 }
        ],
        { elements: 10 } as sm.Tensor
      )
      expect(flops).toBe(200)
    })

    it('scalar + 1d', () => {
      const flops = sm.opToFlops(
        'matmul',
        [
          { shape: [3], elements: 3 },
          { shape: [10], elements: 10 }
        ],
        { elements: 10 } as sm.Tensor
      )
      expect(flops).toBe(60)
    })

    it('2d + scalar', () => {
      const flops = sm.opToFlops(
        'matmul',
        [
          { shape: [10, 5], elements: 50 },
          { shape: [3], elements: 3 }
        ],
        { elements: 50 } as sm.Tensor
      )
      expect(flops).toBe(500)
    })

    it('2d tensors', () => {
      const flops = sm.opToFlops(
        'matmul',
        [
          { shape: [10, 5], elements: 50 },
          { shape: [10, 5], elements: 50 }
        ],
        { elements: 50 } as sm.Tensor
      )
      expect(flops).toBe(500)
    })

    it('scalar + 2d', () => {
      const flops = sm.opToFlops(
        'matmul',
        [
          { shape: [3], elements: 3 },
          { shape: [10, 5], elements: 50 }
        ],
        { elements: 50 } as sm.Tensor
      )
      expect(flops).toBe(300)
    })
  })
})
