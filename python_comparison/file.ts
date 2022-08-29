import fs from 'node:fs'

const t0 = performance.now()
fs.readFile('input.txt', 'utf8', function (err, data) {
  if (err) throw err
  const out = []
  for (const line of data.trim().split('\n')) {
    const [a, b, c] = line.split(',').map(Number)
    const n = a * b + c
    if (out.length && out[out.length - 1] > n) {
      out.push(n - out[out.length - 1])
    }
    out.push(n)
  }
  console.log((performance.now() - t0) / 1e3, 'seconds')
})
