const t0 = performance.now()

const fib = (n: number): number => {
  if (n === 1 || n === 0) return 1
  return fib(n - 1) + fib(n - 2)
}

const N = 35
const out = fib(N)

console.log((performance.now() - t0) / 1e3, 'seconds')
