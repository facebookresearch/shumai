import * as sm from '@shumai/shumai'

const m_ref = sm.scalar(4)
const b_ref = sm.scalar(-7)
const model_ref = (t) => {
  return t.mul(m_ref).add(b_ref)
}

const url = '0.0.0.0:3000'
const model = sm.io.remote_model(url)

for (const _ of sm.util.viter(100)) {
  const input = sm.randn([128])
  input.requires_stats = true
  const out_ref = model_ref(input)

  const out = await model(input)

  const loss = sm.loss.mse(out_ref, out)
  await loss.backward()
}

const res = await fetch(`${url}/statistics`)
const stat = await res.json()
console.log(`${stat.m.weight} x + ${stat.b.weight}`)
