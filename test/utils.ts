import { expect } from 'bun:test'
import type { Tensor } from '@shumai/shumai'
import { util } from '@shumai/shumai'

export const calcSizeFromShape = (arr: number[]) =>
  arr.reduce((acc, val, i) => (i === 0 ? val : acc * val), 0)

/**
 * exported helper functions to make up for bun's wiptest
 * lacking some features
 */
export const isShape = (t: Tensor, expectedShape: number[]) => {
  if (t.shape.length !== expectedShape.length) return false
  for (let i = 0; i < t.shape.length; i++) {
    if (t.shape[i] !== expectedShape[i]) return false
  }
  return true
}

export const areSameShape = (t1: Tensor, t2: Tensor) => {
  const count = t1.shape.length >= t2.shape.length ? t1.shape.length : t2.shape.length
  for (let i = 0; i <= count; i++) {
    if (t1.shape[i] !== t2.shape[i]) return false
  }
  return true
}

export const isClose = (actual: number | bigint, expected: number | bigint, error = 0.001) => {
  if (typeof actual !== typeof expected) return false

  if (typeof actual === 'bigint' && typeof expected === 'bigint') {
    const upper = expected + BigInt(error),
      lower = expected - BigInt(error)
    if (actual < lower || actual > upper) {
      return false
    }
    return true
  } else if (typeof actual === 'number' && typeof expected === 'number') {
    const upper = (expected as number) + error,
      lower = expected - error
    if (actual < lower || actual > upper) {
      return false
    }
    return true
  }
}

/* validates that actual && expected array are close (all values w/i given tolerance) */
const isCloseArr = (actual: util.ArrayLike, expected: util.ArrayLike, error: number) => {
  const expLength = expected.length
  if (actual.length !== expLength) return false

  for (let i = 0; i < expLength; i++) {
    if (!isClose(actual[i], expected[i], error)) {
      for (let j = 0; j < actual.length; j++) {
        console.log(
          `expected[${j}]:`,
          expected[j].toString(),
          '  ** vs **  ',
          `actual[${j}]:`,
          actual[j].toString()
        )
      }
      return false
    }
  }
  return true
}

export const expectArraysClose = (
  actual: util.ArrayLike,
  expected: util.ArrayLike,
  error = 0.001
) => expect(isCloseArr(actual, expected, error)).toBe(true)
