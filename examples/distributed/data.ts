import * as sm from '@shumai/shumai'

const m_ref = sm.scalar(4)
const b_ref = sm.scalar(-7)
const model_ref = (t) => {
  return t.mul(m_ref).add(b_ref)
}

const url = 'localhost:3000'

const t0 = performance.now()
for (const _ of sm.util.viter(50)) {
  const inp = sm.randn([128])
  const t = await sm.io.tfetch(`${url}/forward`, inp)
  t.requires_grad = true

  const loss = sm.loss.mse(t, model_ref(inp))
  loss.backward()
  await sm.io.tfetch(`${url}/optimize`, t.grad)
}
const t1 = performance.now()

const m = await sm.io.tfetch(`${url}/m`)
const b = await sm.io.tfetch(`${url}/b`)
console.log(
  'learned:',
  m.toFloat32(),
  'x +',
  b.toFloat32(),
  `in ${(t1 - t0) / 1e3 / 50} sec per iter`
)
