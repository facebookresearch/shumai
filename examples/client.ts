import * as sm from '@shumai/shumai'

const ref_val = sm.scalar(14)
const url = 'localhost:3000'

for (const _ of sm.util.range(200)) {
  const input = sm.randn([1024])
  const ref_output = input.mul(ref_val)

  const backward = async (grad) => {
    await sm.io.tfetch(`${url}/optimize`, grad.grad_in)
  }

  const output = await sm.io.tfetch(`${url}/forward`, input, { grad_fn: backward })

  const loss = sm.loss.mse(output, ref_output)
  await loss.backward()

  const curr = await sm.io.tfetch(`${url}`)
  console.log(curr.toFloat32())
}
