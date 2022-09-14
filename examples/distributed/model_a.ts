import * as sm from '@shumai/shumai'

const m = sm.scalar(0)
m.requires_grad = true
const model = (t) => {
  return t.mul(m)
}

sm.io.serve(
  {
    forward: async (u, t) => {
      console.log(`fwd m ${m.toFloat32()}`)
      const Y = model(t)
      await new Promise((r) => setTimeout(r, 20))
      u.opt = async (j) => {
        await new Promise((r) => setTimeout(r, 20))
        sm.optim.sgd(Y.backward(j), 1e-2)
      }
      return Y
    },
    optimize: async (u, t) => {
      await u.opt(t)
      console.log(`opt m ${m.toFloat32()}`)
    },
    default: (_) => {
      return m
    }
  },
  { port: 3001 }
)
