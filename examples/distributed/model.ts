import * as sm from '@shumai/shumai'

const model_a = sm.io.connect('localhost:3001/forward', 'localhost:3001/optimize')
const model_b = sm.io.connect('localhost:3002/forward', 'localhost:3002/optimize')

const model = async (t) => {
  t = await model_a(t)
  t = await model_b(t)
  return t
}

sm.io.serve_model(
  model,
  sm.optim.sgd,
  { port: 3000 },
  {
    statistics: async (_) => {
      const m_stat = await (await fetch('localhost:3001/statistics')).json()
      const b_stat = await (await fetch('localhost:3002/statistics')).json()
      return { m: m_stat, b: b_stat }
    }
  }
)
