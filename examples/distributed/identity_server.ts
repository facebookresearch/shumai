import * as sm from '@shumai/shumai'

function identity(x) {
  return x
}

sm.io.serve_model(identity)
