import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('StandardScaler', () => {
  it('fit, transform, & fitTransform work', () => {
    const test_a = sm.tensor(new Float32Array([0, 0, 0, 0, 1, 1, 1, 1])).reshape([4, 2])
    const scaler = new sm.preprocess.StandardScaler()
    scaler.fit(test_a)
    let transformed = scaler.transform(test_a)
    // expect(transformed.dtype).toBe(test_a.dtype)
    expectArraysClose(transformed.valueOf(), [-1, -1, -1, -1, 1, 1, 1, 1])

    const test_b = sm.tensor(new Float32Array([2, 2]))
    transformed = scaler.transform(test_b)
    expect(transformed.dtype).toBe(test_b.dtype)
    expectArraysClose(transformed.valueOf(), [3, 3])

    const test_c = sm.tensor(new Float32Array([100, 1000, 2000, 3000]))
    transformed = scaler.fitTransform(test_c)
    expect(transformed.dtype).toBe(test_c.dtype)
    expectArraysClose(
      transformed.valueOf(),
      [-1.3135592937469482, -0.4839428961277008, 0.4378530979156494, 1.3596490621566772]
    )
  })

  it('inverseTransform works', () => {
    const test_a = sm.tensor(new Float32Array([0, 0, 0, 0, 1, 1, 1, 1])).reshape([4, 2])
    const scaler = new sm.preprocess.StandardScaler()
    let transformed = scaler.fitTransform(test_a)
    expectArraysClose(scaler.inverseTransform(transformed).valueOf(), test_a.valueOf())

    const test_b = sm.tensor(new Float32Array([2, 2]))
    transformed = scaler.transform(test_b)
    expectArraysClose(scaler.inverseTransform(transformed).valueOf(), test_b.valueOf())

    const test_c = sm.tensor(new Float32Array([100, 1000, 2000, 3000]))
    transformed = scaler.fitTransform(test_c)
    expectArraysClose(scaler.inverseTransform(transformed).valueOf(), test_c.valueOf())
  })
})
