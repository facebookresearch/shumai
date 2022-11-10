import * as sm from '@shumai/shumai'

const W = sm.identity(2).mul(sm.scalar(2)).requireGrad().checkpoint()

function f(x) {
  return sm.matmul(x, W).relu()
}

const backward = sm.optim.sgd
const loss = sm.loss.mse

export { backward, f as default, loss }
