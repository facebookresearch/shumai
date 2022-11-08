import * as sm from '@shumai/shumai'

function identity(x: sm.Tensor) {
  return x
}

sm.network.serve_model(identity)
