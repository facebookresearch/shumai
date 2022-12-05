import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { expectArraysClose } from './utils'

describe('scaler', () => {
  it('StandardScaler works', () => {
    const test_a = sm.tensor(new Float32Array([0, 0, 0, 0, 1, 1, 1, 1])).reshape([4, 2])
    const scaler = new sm.util.StandardScaler()
    scaler.fit(test_a)
    let transformed = scaler.transform(test_a)
    expect(transformed.dtype).toBe(test_a.dtype)
    expectArraysClose(transformed.valueOf(), [-1, -1, -1, -1, 1, 1, 1, 1])

    const test_b = sm.tensor(new Float64Array([2, 2]))
    transformed = scaler.transform(sm.tensor(test_b))
    expect(transformed.dtype).toBe(test_b.dtype)
    expectArraysClose(transformed.valueOf(), [3, 3])

    const test_c = sm.tensor(new Float32Array([8, 1, 6, 3, 5, 7, 4, 9, 2])).reshape([3, 3])
    scaler.fit(test_c)
    transformed = scaler.transform(test_c)
    expect(transformed.dtype).toBe(test_c.dtype)
    expectArraysClose(
      transformed.valueOf(),
      [1.1339, -1.0, 0.378, -0.7559, 0, 0.7559, -0.378, 1.0, -1.1339]
    )

    const test_d = sm.tensor(new Float32Array([100, 1000, 2000, 3000]))
    scaler.fit(test_d)
    transformed = scaler.transform(test_d)
    expect(transformed.dtype).toBe(test_d.dtype)
    expectArraysClose(
      transformed.valueOf(),
      [-1.3135592937469482, -0.4839428961277008, 0.4378530979156494, 1.3596490621566772]
    )
  })
})
