import * as sm from '@shumai/shumai'

const t0 = performance.now()
const x = sm.randn([8, 128, 128])
for (const _i of sm.util.viter(1000)) {
  x.save('/tmp/tensor.sm')
  const _y = sm.tensor('/tmp/tensor.sm')
}
const t1 = performance.now()
console.log((t1 - t0) / 1e3)
