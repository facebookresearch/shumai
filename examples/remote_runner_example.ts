import * as sm from '@shumai/shumai'

const rr = sm.network.remote_runner('127.0.0.1:3113')

const $ = rr.shell
console.log(await $`hostname`)
console.log(await $`pwd`)
console.log(await $`ls -lah`)

const f = await rr.serve_model('./examples/model.ts')
const x = sm.full([128], 1)
x.requires_stats = true
let y = await f(x)

const log = () => {
  return ` y[0] val: ${y.toFloat32()}`
}
for (const _i of sm.util.viter(100000, log)) {
  y = await f(x)
  const ref = x.mul(sm.scalar(2))
  sm.loss.mse(y, ref).backward()
}

console.log(y.toFloat32())
