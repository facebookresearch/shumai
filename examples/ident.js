import * as sm from '@shumai/shumai'

const N = 1024
const D = 5
const iters = 100

const ws = []
for (let i = 0; i < D; ++i) {
  ws.push(sm.identity(N))
}

for (let i = 0; i < iters; ++i) {
  let X = sm.randn([N, N])
  for (let w of ws) {
    X = X.matmul(w)
  }
}

function foo() {
  let X = sm.randn([N, N])
  let zero = sm.full([1, N], 0)
  X.requires_stats = true
  const t0 = performance.now()
  for (let i = 0; i < iters; ++i) {
    for (let w of ws) {
      X = sm.matmul(X, w)
      X = X.add(zero)
    }
  }
  const t1 = performance.now()
  for (let key of Object.keys(X.stats)) {
    console.log(key, X.stats[key])
  }
  console.log((D * Math.pow(N, 3) * 2 * iters) / (t1 - t0) / 1e6, 'gflops')
}

for (let i = 0; i < 100; ++i) {
  foo()
}
