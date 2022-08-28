import {
  expect
} from 'bun:test';
/**
 * exported helper functions to make up for bun's wiptest
 * lacking some features
 */

// validates that actual && expected array are close to (all values w/i given tolerance)
const isCloseArr = (actual: Float32Array | number[], expected: Float32Array | number[], error: number) => {

  const expLength = expected.length
  if (actual.length !== expLength) return false;

  for (let i = 0; i < expLength; i++) {
    const upper = expected[i] + error,
      lower = expected[i] - error;
    if (actual[i] <= lower && actual[i] >= upper)
      return false;
  }

  return true;
}

export const expectArraysClose = (actual: Float32Array | number[], expected: Float32Array | number[], error = 0.001) => expect(isCloseArr(actual, expected, error)).toBe(true);