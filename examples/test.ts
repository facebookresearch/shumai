import * as sm from '@shumai/shumai'

function genRand() {
  const out = new Float32Array(128)
  for (let i = 0; i < 128; ++i) {
    out[i] = Math.random()
  }
  return out
}

const t0 = performance.now() / 1e3
let m = 0
for (let i = 0; i < 10000; ++i) {
  const a = sm.rand([128])
  const b = new sm.Tensor(genRand())
  m += a.add(b).mean().toFloat32()
}
const t1 = performance.now() / 1e3
console.log(t1 - t0, 'seconds to calculate', m)
