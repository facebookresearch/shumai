import { rand, Tensor } from '@shumai/shumai'

function bench(description, f, iters = 1000) {
  const hist = new Float32Array(iters)
  for (let i = 0; i < iters; ++i) {
    const t0 = performance.now()
    f()
    const t1 = performance.now()
    hist[i] = 1e6 * (t1 - t0)
  }
  const t = new Tensor(hist)
  console.log(
    `${description} \t mean: ${Math.round(t.mean().toFloat32()) / 1e3}us    (min: ${
      Math.round(t.amin().toFloat32()) / 1e3
    }us, max: ${Math.round(t.amax().toFloat32()) / 1e3}us)`
  )
  Bun.gc(true)
}

for (const N of [10, 1000, 100000]) {
  console.log(`${N} elements...`)
  bench(`JS create 0 tensor     `, () => {
    const a = new Float32Array(N)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const t = new Tensor(a)
  })
  bench(`native create 0 tensor `, () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const t = new Tensor(N)
  })
  bench(`JS create random tensor`, () => {
    const a = new Float32Array(N)
    for (let i = 0; i < N; ++i) {
      a[i] = Math.random()
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const t = new Tensor(a)
  })
  bench(`native create random tensor`, () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const t = rand([N])
  })
}
