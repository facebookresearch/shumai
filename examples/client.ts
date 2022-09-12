import * as sm from '@shumai/shumai'

const reference_val = sm.scalar(14)
const url = 'localhost:3000'

for (let i of sm.util.range(1000)) {
  const inp = sm.randn([128])

  const t = await sm.io.tfetch(`${url}/forward`, inp)
  t.requires_grad = true
  const loss = sm.loss.mse(t, inp.mul(reference_val))
  loss.backward()
  await sm.io.tfetch(`${url}/optimize`, t.grad)

  const curr = await sm.io.tfetch(`${url}/query`));
  console.log(curr.toFloat32())
}

