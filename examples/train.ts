import * as sm from '@shumai/shumai'

class Model extends sm.module.Module {
  constructor() {
    super()
    const first = sm.module.linear(1, 8)
    const layers = []
    for (const i of sm.util.range(3)) {
      const l = sm.module.linear(8, 8)
      layers.push((x) => l(x).relu())
    }
    const last = sm.module.linear(8, 1)
    this.layers = sm.module.sequential((x) => first(x).relu(), ...layers, last)
  }

  forward(x: sm.Tensor) {
    return this.layers(x)
  }
}

// target function
const f = (x) => x.sin()
// model learning that function
const m = new Model()

const opt = sm.optim.sgd
let ema_loss = 1e9
for (const i of sm.util.viter(100000, () => ema_loss)) {
  const x = sm.randn([10, 1])
  const y = f(x)
  const y_hat = m(x)
  const loss = sm.loss.mse(y, y_hat)
  ema_loss = loss.toFloat32() * 0.05 + ema_loss * 0.95
  opt(loss.backward())
}
