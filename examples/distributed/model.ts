import * as sm from '@shumai/shumai'

const model = async (t, options) => {
  t = await sm.io.tfetch('localhost:3001/forward', t, options)
  t = await sm.io.tfetch('localhost:3002/forward', t, options)
  return t
}

sm.io.serve(
  {
    forward: async (u, t) => {
      console.log('forward pass')
      return await model(t, { id: u.id })
    },
    optimize: async (u, j) => {
      console.log('optimizing')
      j = await sm.io.tfetch('localhost:3002/optimize', j, { id: u.id })
      await sm.io.tfetch('localhost:3001/optimize', j, { id: u.id })
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
