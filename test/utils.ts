import {
  expect
} from 'bun:test';

/**
 * exported helper functions to make up for bun's wiptest
 * lacking some features
 */
export const isClose = (actual: number, expected: number, error = 0.001) => {
  const upper = expected + error,
    lower = expected - error;
  if (actual < lower || actual > upper) {
    return false
  }
  return true;
}

// validates that actual && expected array are close to (all values w/i given tolerance)
const isCloseArr = (actual: Float32Array | number[], expected: Float32Array | number[], error: number) => {
  const expLength = expected.length
  if (actual.length !== expLength) return false;

  for (let i = 0; i < expLength; i++) {
    if (!isClose(actual[i], expected[i], error)) return false
  }

  return true;
}

export const expectArraysClose = (actual: Float32Array | number[], expected: Float32Array | number[], error = 0.001) => expect(isCloseArr(actual, expected, error)).toBe(true);
