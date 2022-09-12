import * as sm from '@shumai/shumai'

const X = sm.scalar(2)
X.requires_grad = true

let optimize = null

export default {
  port: 3000,
  async fetch(request: Request) {
    if (request.url.endsWith('forward')) {
      const t = await sm.io.decode(request)

      const Y = t.mul(X)
      optimize = (j) => {
        sm.optim.sgd(Y.backward(j), 1e-3)
      }
      return new Response(sm.io.encode(Y))
    } else if (optimize && request.url.endsWith('optimize')) {
      const t = await sm.io.decode(request)

      optimize(t)
      return new Response() // doesn't return a value
    }

    return new Response(sm.io.encode(X))
  }
}
