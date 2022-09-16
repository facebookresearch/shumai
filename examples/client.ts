import * as sm from '@shumai/shumai'

const url = 'localhost:3000'
const model = sm.io.remote_model(url)

const ref_weight = sm.full([128, 8], 1)

for (const _ of sm.util.range(200)) {
  const input = sm.randn([16, 128])
  const ref_output = input.matmul(ref_weight)

  const output = await model(input)

  const loss = sm.loss.mse(output, ref_output)
  await loss.backward()

  const learned_val = await sm.io.tfetch(`${url}`)
  console.log(`loss ${loss.toFloat32()} learned_val[0] ${learned_val.toFloat32()}`)
}
