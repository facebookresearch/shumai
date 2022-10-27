import * as sm from '@shumai/shumai'

const W = sm.randn([128, 8]).requireGrad()
const model = (x) => {
  return x.matmul(W)
}

sm.network.serve_model(model, sm.optim.sgd)
