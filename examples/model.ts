import * as sm from '@shumai/shumai'

const w = sm.full([128, 128], 4).requireGrad()

function f(x) {
  return x.matmul(w).maximum(sm.scalar(0))
}

const options = { port: 3001 }
const backward = sm.optim.sgd

export { backward, f as default, options }
