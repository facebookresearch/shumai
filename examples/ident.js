import * as sm from "shumaiml";

const N = 1024;
const D = 5;
const iters = 100;

const ws = [];
for (let i = 0; i < D; ++i) {
  ws.push(sm.identity(N));
}

for (let i = 0; i < iters; ++i) {
  let X = sm.randn([N, N]);
  for (let w of ws) {
    X = X.matmul(w);
  }
}

function foo() {
  let X = sm.randn([N, N]);
  const t0 = performance.now();
  for (let i = 0; i < iters; ++i) {
    for (let w of ws) {
      X = sm.matmul(X, w);
    }
  }
  const t1 = performance.now();
  console.log(D * Math.pow(N, 3) * 2 * iters / (t1 - t0) / 1e6, "gflops");
}

for (let i = 0; i < 100; ++i) {
  foo();
}