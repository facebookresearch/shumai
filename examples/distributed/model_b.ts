import * as sm from '@shumai/shumai'

const b = sm.scalar(0)
b.requires_grad = true
const model = (t: sm.Tensor) => {
  return t.add(b)
}

sm.io.serve_model(
  model,
  sm.optim.sgd,
  { port: 3002 },
  {
    statistics: () => {
      return { weight: b.toFloat32() }
    }
  }
)
