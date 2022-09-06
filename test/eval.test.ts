import * as sm from '@shumai/shumai'

import { it, describe, expect } from 'bun:test'
import { EvalTuner } from '../src/utils/eval_tuner'
import { logBenchmarkInfo } from './utils'
let bestIn: number | undefined = undefined

describe('eval (memtest)', () => {
  it('basic', () => {
    const eval_tuner = new EvalTuner()

    const a = sm.full([1024 * 8], 1)
    const iters = 100000
    const t0 = performance.now()
    let b = a
    eval_tuner.last_time = t0
    for (let i = 0; i < iters; i++) {
      b = b.add(a)
      eval_tuner.step(b, i, bestIn)
      if (!bestIn && eval_tuner.done) bestIn = eval_tuner.best_delta
    }
    const o = b.toFloat32Array()[0]
    const t1 = performance.now()
    b.eval()
    expect(typeof eval_tuner.best_delta).toBe('number')
    logBenchmarkInfo(t0, t1, iters, o)
  })

  it('basic using best_delta', () => {
    const eval_tuner = new EvalTuner()
    if (bestIn) eval_tuner.done = true

    const a = sm.full([1024 * 8], 1)
    const iters = 100000
    const t0 = performance.now()
    let b = a
    eval_tuner.last_time = t0
    for (let i = 0; i < iters; i++) {
      b = b.add(a)
      eval_tuner.step(b, i, bestIn)
    }
    const o = b.toFloat32Array()[0]
    const t1 = performance.now()
    b.eval()
    logBenchmarkInfo(t0, t1, iters, o)
  })

  it('basic using avg_best_delta', () => {
    const eval_tuner = new EvalTuner()

    const a = sm.full([1024 * 8], 1)
    const iters = 100000
    const t0 = performance.now()
    let b = a
    eval_tuner.last_time = t0
    for (let i = 0; i < iters; i++) {
      b = b.add(a)
      eval_tuner.step(b, i)
    }
    const o = b.toFloat32Array()[0]
    const t1 = performance.now()
    b.eval()
    logBenchmarkInfo(t0, t1, iters, o)
  })
})
