import { expect } from 'bun:test'
import type { Tensor } from '@shumai/shumai'

export type ArrayLike = Float32Array | Float64Array | Uint8Array | number[]

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

export const isClose = (actual: number, expected: number, error = 0.001) => {
  const upper = expected + error,
    lower = expected - error
  if (actual < lower || actual > upper) {
    return false
  }
  return true
}

/* validates that actual && expected array are close (all values w/i given tolerance) */
const isCloseArr = (actual: ArrayLike, expected: ArrayLike, error: number) => {
  const expLength = expected.length
  if (actual.length !== expLength) return false

  for (let i = 0; i < expLength; i++) {
    if (!isClose(actual[i], expected[i], error)) return false
  }

  return true
}

export const expectArraysClose = (actual: ArrayLike, expected: ArrayLike, error = 0.001) =>
  expect(isCloseArr(actual, expected, error)).toBe(true)
