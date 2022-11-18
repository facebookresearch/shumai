import * as sm from '@shumai/shumai'

class Model extends sm.module.Module {
  constructor() {
    super()
    const first = sm.module.linear(1, 128)
    const layers = []
    for (const i of sm.util.range(1)) {
      const l = sm.module.linear(128, 128)
      layers.push((x) => l(x).relu())
    }
    const last = sm.module.linear(128, 1)
    this.layers = sm.module.sequential((x) => first(x).relu(), ...layers, last)
  }

  forward(x: sm.Tensor) {
    return this.layers(x).sigmoid()
  }
}

// target function
const f = (x) => x.sin()
// model learning that function
const m = new Model()

const opt = new sm.optim.Adam()
let loss = sm.scalar(1e9)
for (const i of sm.util.viter(100000, () => loss.toFloat32())) {
  const x = sm.randn([10, 1])
  const y = f(x)
  const y_hat = m(x)
  loss = sm.loss.mse(y, y_hat)
  opt(loss.backward())
}
