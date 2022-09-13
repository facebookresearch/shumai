import * as sm from '@shumai/shumai'

const b = sm.scalar(0)
b.requires_grad = true
const model = (t) => {
  return t.add(b)
}

sm.io.serve(
  {
    forward: (u, t) => {
      console.log(`fwd b ${b.toFloat32()}`)
      const Y = model(t)
      t.requires_grad = true
      u.backward = (j) => {
        return [Y.backward(j), t.grad]
      }
      return Y
    },
    optimize: (u, t) => {
      const [ts, grad] = u.backward(t)
      const ret = grad.detach()
      sm.optim.sgd(ts, 1e-2)
      console.log(`opt b ${b.toFloat32()}`)
      return ret
    },
    default: (_) => {
      return b
    }
  },
  { port: 3002 }
)
