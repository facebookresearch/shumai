import * as sm from '@shumai/shumai'

const m = sm.scalar(0)
m.requires_grad = true
const model = (t) => {
  return t.mul(m)
}

sm.io.serve_model(
  model,
  sm.optim.sgd,
  { port: 3001 },
  {
    statistics: (_) => {
      return { weight: m.toFloat32() }
    }
  }
)
