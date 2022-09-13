import * as sm from '@shumai/shumai'

const X = sm.scalar(2)
X.requires_grad = true

sm.io.serve(
  {
    forward: (u, t) => {
      const Y = t.mul(X)
      // different optimizer per user
      u.opt = (j) => {
        sm.optim.sgd(Y.backward(j), 1e-2)
      }
      return Y
    },
    optimize: (u, t) => {
      u.opt(t)
    },
    default: (_) => {
      return X
    }
  },
  { port: 3000 }
)
