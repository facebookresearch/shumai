import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose } from './utils'

const { Float16Array } = sm.util

describe('Float16Array', () => {
  it('basic', () => {
    let a = sm.scalar(6)
    a = a.astype(sm.dtype.Float16)
    expect(a.dtype).toBe(sm.dtype.Float16)
    expect(a.valueOf()).toBe(6)

    a = sm.tensor(new Float16Array([1, 2, 3, 4, 5, 6, 7, 8]))
    expect(a.dtype).toBe(sm.dtype.Float16)
    expectArraysClose(a.valueOf(), [1, 2, 3, 4, 5, 6, 7, 8])

    a = sm.tensor(new Float32Array(new Array(100).fill(Math.random())))
    expect(a.dtype).toBe(sm.dtype.Float32)
    const b = a.astype(sm.dtype.Float16)
    expect(b.dtype).toBe(sm.dtype.Float16)
    expectArraysClose(a.toFloat16Array(), b.valueOf())
  })

  it('can be tested using `instanceof`', () => {
    const og = new Float16Array(new Array(100).fill(Math.random()))
    expect(og instanceof Float16Array).toBe(true)
    const a = sm.tensor(og)
    expect(a.valueOf() instanceof Float16Array).toBe(true)
  })
})
