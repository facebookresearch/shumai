import * as sm from '@shumai/shumai'
import { it, expect, describe } from 'bun:test'

describe('range', () => {
  it('basic', () => {
    const a = []
    for (const i of sm.util.range(100)) {
      a.push(i)
    }
    expect(a.length).toBe(100)
  })

  it('should iterate between range', () => {
    const a = []
    for (const i of sm.util.range(2, 100)) {
      a.push(i)
    }
    expect(a.length).toBe(98)
  })

  it('should iterate by stride', () => {
    const a = []
    for (const i of sm.util.range(2, 100, 2)) {
      a.push(i)
    }
    expect(a.length).toBe(49)
  })
})

describe('shuffle', () => {
  it('basic', () => {
    const a = []
    for (const i of sm.util.range(100)) {
      a.push(i)
    }
    const b = sm.util.shuffle(a)
    expect(b.length).toBe(100)
  })

  it('same elemnts', () => {
    const a = []
    for (const i of sm.util.range(100)) {
      a.push(i)
    }
    const b = sm.util.shuffle(a)
    let total_a = 0
    let total_b = 0
    for (const i of sm.util.range(b.length)) {
      total_a += a[i]
      total_b += b[i]
    }
    expect(total_b).toBe(total_a)
  })
})
