import * as sm from '@shumai/shumai'

const X = sm.randn([128, 8]).requireGrad()

sm.io.serve(
  {
    forward: async (u: sm.Tensor, input: sm.Tensor) => {
      const Y = input.matmul(X)
      // different optimizer per user
      u.opt = async (j?: sm.Tensor) => {
        sm.optim.sgd(await Y.backward(j), 1e-2)
      }
      return Y
    },
    optimize: (u, t: sm.Tensor) => {
      u.opt(t)
    },
    default: () => {
      return X
    }
  },
  { port: 3000 }
)
