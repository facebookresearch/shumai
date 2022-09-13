import * as sm from '@shumai/shumai'

const X = sm.scalar(2)
X.requires_grad = true

let optimize = null

sm.io.serve(
  {
    forward: (_, t) => {
      const Y = t.mul(X)
      optimize = (j) => {
        sm.optim.sgd(Y.backward(j), 1e-2)
      }
      return Y
    },
    optimize: (_, t) => {
      optimize(t)
    },
    default: (_) => {
      return X
    }
  },
  { port: 3000 }
)
