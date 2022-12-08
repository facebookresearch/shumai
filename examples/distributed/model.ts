import * as sm from '@shumai/shumai'

const model_a = sm.network.remote_model('0.0.0.0:3001')
const model_b = sm.network.remote_model('0.0.0.0:3002')

const model = async (t: sm.Tensor) => {
  let res: sm.network.TFetchResult
  res = await model_a(t)
  res = await model_b(res.tensor)
  return res.tensor
}

sm.network.serve_model(
  model,
  sm.optim.sgd,
  { port: 3000 },
  {
    statistics: async () => {
      const m_stat = await (await fetch('0.0.0.0:3001/statistics')).json()
      const b_stat = await (await fetch('0.0.0.0:3002/statistics')).json()
      return { m: m_stat, b: b_stat }
    }
  }
)
