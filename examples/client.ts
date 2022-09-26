import * as sm from '@shumai/shumai'

const url = '0.0.0.0:3000'
const model = sm.io.remote_model(url)

const ref_weight = sm.full([128, 8], 1)
let loss
const upd = () => {
  if (loss) {
    return ` loss: ${loss.toFloat32()}`
  }
}

for (const _ of sm.util.viter(10000, upd)) {
  const input = sm.randn([128 * 4, 128])
  const ref_output = input.matmul(ref_weight)

  const output = await model(input)

  loss = sm.loss.mse(output, ref_output)
  await loss.backward()
  Bun.gc(true)
}
