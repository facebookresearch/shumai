import * as sm from '@shumai/shumai'
import { noInline, startSamplingProfiler } from 'bun:jsc'

startSamplingProfiler(Bun.main + '.prof', 10)

const r = (v) => {
  return Math.round(v * 1e3) / 1e3
}

function baseline_mm_pw(size: number, iters: number, warmup: number) {
  const N = size
  const a = sm.randn([N, 64])
  const b = sm.identity(N)
  const c = sm.randn([N, 1])

  const op = (K) => {
    let d = a
    for (let i = 0; i < K; ++i) {
      d = b.matmul(d)
      for (let j = 0; j < 5; ++j) {
        d = d.add(c)
      }
    }
    const o = d.sum().toFloat32()
    return o
  }

  op(warmup)
  const t0 = performance.now()
  op(iters)
  const t1 = performance.now()

  const kitersec = iters / (t1 - t0)
  console.log(`${r(kitersec)}K iter/s`)
}
noInline(baseline_mm_pw)

baseline_mm_pw(64, 1000, 100)
