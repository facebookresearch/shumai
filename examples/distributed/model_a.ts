import * as sm from '@shumai/shumai'

const m = sm.scalar(0)
m.requires_grad = true
const model = (t) => {
  return t.mul(m)
}

sm.io.serve(
  {
    forward: (u, t) => {
      console.log(`fwd m ${m.toFloat32()}`)
      const Y = model(t)
      u.opt = (j) => {
        sm.optim.sgd(Y.backward(j), 1e-2)
      }
      return Y
    },
    optimize: (u, t) => {
      u.opt(t)
      console.log(`opt m ${m.toFloat32()}`)
    },
    default: (_) => {
      return m
    }
  },
  { port: 3001 }
)
