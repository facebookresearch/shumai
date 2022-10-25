import * as sm from '@shumai/shumai'

const w = sm.randn([128]).requireGrad()

const f = (x) => {
  return x.mul(w)
}

sm.io.serve_model(f, sm.optim.sgd, { port: 3001 })
