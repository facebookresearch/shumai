import { it, describe } from 'bun:test'
import * as sm from 'shumaiml'
import { expectArraysClose } from './utils'

describe('negative', () => {
  it('basic', () => {
    const t = sm.tensor(new Float32Array([1, -3, 2, 7, -4]))
    const r = sm.negative(t)
    expectArraysClose(<Float32Array>r.valueOf(), [-1, 3, -2, -7, 4])

    const t2 = sm.tensor(new Float32Array([1, 10, -3405123, 230538, -2]))
    const r2 = t2.negative()
    expectArraysClose(<Float32Array>r2.valueOf(), [-1, -10, 3405123, -230538, 2])
  })

  /* TODO: FIX - CURRENTLY FAILS */
  it('should work with larger numbers', () => {
    const t2 = sm.tensor(new Float64Array([1, 10, -14512312309, 14512312309, -2]))
    const r2 = t2.negative()
    expectArraysClose(<Float32Array>r2.valueOf(), [-1, -10, 14512312309, -14512312309, 2])
  })

  it('propagates NaNs', () => {
    const t = sm.tensor(new Float32Array([1, -3, NaN, 7, -10234]))
    const r = sm.negative(t)
    expectArraysClose(<Float32Array>r.valueOf(), [-1, 3, NaN, -7, 10234])
  })

  /* TODO: unit tests for gradients once supported */
})
