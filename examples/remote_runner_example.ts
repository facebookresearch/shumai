import * as sm from '@shumai/shumai'

const rr = sm.util.remote_runner('127.0.0.1:3113')

const $ = rr.shell
console.log(await $`pwd`)

const f = await rr.load('./model.ts')
const x = sm.full([128], 1)
let y = await f(x)

const log = () => {
  return ` y[0] val: ${y.toFloat32()}`
}
for (const i of sm.util.viter(100000, log)) {
  y = await f(x)
  const ref = x.mul(sm.scalar(2))
  sm.loss.mse(y, ref).backward()
}

console.log(y.toFloat32())
