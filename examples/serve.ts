import * as sm from '@shumai/shumai'

const X = sm.randn([128, 8])
X.requires_grad = true

sm.io.serve(
  {
    forward: (u, t) => {
      const Y = t.matmul(X)
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
