import * as sm from '@shumai/shumai'

import { it, describe, expect } from 'bun:test'
import { EvalTuner, EvalTunerType } from '../src/utils/eval_tuner'
import { logBenchmarkInfo } from './utils'

describe('eval (memtest)', () => {
  it('basic', () => {
    const eval_tuner = new EvalTuner(EvalTunerType.HILLCLIMB)
    const a = sm.full([1024 * 8], 1)
    const iters = 10000
    const t0 = performance.now()
    let b = a
    for (let i = 0; i < iters; i++) {
      b = b.add(a)
      const isDone = eval_tuner.step(b, i)
      if (isDone) break
    }
    const o = b.toFloat32Array()[0]
    const t1 = performance.now()
    expect(typeof eval_tuner.best_delta).toBe('number')
    logBenchmarkInfo(t0, t1, iters, o)
  })
})
