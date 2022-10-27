import * as sm from '@shumai/shumai'

class MLP extends sm.module.Module {
  constructor() {
    super()
    this.l0 = sm.module.linear(8, 8)
    this.l1 = sm.module.linear(8, 8)
    this.l2 = sm.module.linear(8, 8)
  }

  forward(x) {
    x = this.l0(x).maximum(sm.scalar(0))
    x = this.l1(x).maximum(sm.scalar(0))
    x = this.l2(x)
    return x
  }
}

const model = new MLP()

sm.network.serve_model(model, (ts) => sm.optim.sgd(ts, 1e-4), { port: 3001 })
