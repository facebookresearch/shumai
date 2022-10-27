import * as sm from '@shumai/shumai'

const m_ref = sm.scalar(4)
const b_ref = sm.scalar(-7)
const model_ref = (t) => {
  return t.mul(m_ref).add(b_ref).maximum(sm.scalar(0))
}

const url = '0.0.0.0:3000'
const model = sm.network.remote_model(url)

let loss: sm.Tensor = null
const loss_print = () => {
  if (loss) {
    return ` ${loss.toFloat32()}`
  }
}

for (const _ of sm.util.viter(10000, loss_print)) {
  const input = sm.randn([1, 8])
  input.requires_stats = true
  const out_ref = model_ref(input)

  const out = await model(input)

  loss = sm.loss.mse(out_ref, out)
  await loss.backward()
}

const res = await fetch(`${url}/statistics`)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stat = await res.json()
