import type { Tensor } from '@shumai/shumai'
import { util } from '@shumai/shumai'
import { expect } from 'bun:test'

export const nativeError = new RegExp(
  '^Tensor returned.*is null; native code likely threw an error'
)

export const calcSizeFromShape = (arr: number[]) =>
  arr.reduce((acc, val, i) => (i === 0 ? val : acc * val), 0)

const logShape = (actual_shape: number[], expected_shape: number[]) =>
  console.log('actual_shape: ', actual_shape, '  ** vs **  ', 'expected_shape: ', expected_shape)

/**
 * exported helper functions to make up for bun's wiptest
 * lacking some features
 */
export const isShape = (t: Tensor, expectedShape: number[]) => {
  if (t.shape.length !== expectedShape.length) {
    logShape(t.shape, expectedShape)
    return false
  }
  for (let i = 0; i < t.shape.length; i++) {
    if (t.shape[i] !== expectedShape[i]) {
      logShape(t.shape, expectedShape)
      return false
    }
  }
  return true
}

export const areSameShape = (t1: Tensor, t2: Tensor) => {
  const count = t1.shape.length >= t2.shape.length ? t1.shape.length : t2.shape.length
  for (let i = 0; i <= count; i++) {
    if (t1.shape[i] !== t2.shape[i]) {
      return false
    }
  }
  return true
}

export const expectThrows = (
  fn: CallableFunction,
  exp?: Error['message'] | RegExp | CallableFunction,
  msg?: Error['message']
) => {
  let isErr = false
  if (!msg && typeof exp === 'string') {
    msg = exp
    exp = null
  }
  try {
    fn()
  } catch (err) {
    isErr = true

    if (typeof exp === 'function') {
      expect(exp(err)).toBe(true)
    } else if (exp instanceof RegExp) {
      expect(exp.test(err.message)).toBe(true)
    }
  }
  return expect(isErr).toBe(true)
}

export const isClose = (actual: number | bigint, expected: number | bigint, error = 0.001) => {
  if (typeof actual !== typeof expected) return false

  if (typeof actual === 'bigint' && typeof expected === 'bigint') {
    const factor = BigInt(10)
    while (error % 1 !== 0) {
      error *= 10
      actual *= factor
      expected *= factor
    }
    const upper = expected + BigInt(error),
      lower = expected - BigInt(error)
    if (actual < lower || actual > upper) {
      return false
    }
  } else if (typeof actual === 'number' && typeof expected === 'number') {
    const upper = (expected as number) + error,
      lower = expected - error
    if (actual < lower || actual > upper) {
      return false
    }
  }
  return true
}

/* validates that actual && expected array are close (all values w/i given tolerance) */
const isCloseArr = (actual: util.ArrayLike, expected: util.ArrayLike | number, error: number) => {
  if (typeof expected === 'number') expected = [expected]
  const expLength = expected.length,
    actualLength = actual.length
  if (actualLength !== expLength) {
    logShape([actualLength], [expLength])
    return false
  }

  for (let i = 0; i < expLength; i++) {
    if (!isClose(actual[i], expected[i], error)) {
      for (let j = 0; j < actualLength; j++) {
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
  expected: util.ArrayLike | number,
  error = 0.001
) => expect(isCloseArr(actual, expected, error)).toBe(true)
