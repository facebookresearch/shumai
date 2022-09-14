import * as sm from '@shumai/shumai'

const model_a = sm.io.connect('localhost:3001/forward', 'localhost:3001/optimize')
const model_b = sm.io.connect('localhost:3002/forward', 'localhost:3002/optimize')

const model = async (t) => {
  t = await model_a(t)
  t = await model_b(t)
  return t
}

sm.io.serve(
  {
    forward: async (u, t) => {
      const out = await model(t)
      u.opt = async (jacobian) => {
        await out.backward(jacobian)
      }
      return out
    },
    optimize: async (u, j) => {
      await u.opt(j)
    },
    m: async (_) => {
      return await sm.io.tfetch('localhost:3001/')
    },
    b: async (_) => {
      return await sm.io.tfetch('localhost:3002/')
    }
  },
  { port: 3000 }
)
