const t0 = performance.now()

const N = 1024 * 1024 * 8
const arr = new Float32Array(N)
// manuall construct in JS
for (let i = 0; i < arr.length; ++i) {
  arr[i] = i
}
// scan and then sum
for (let i = 1; i < arr.length; ++i) {
  arr[i] = arr[i - 1] + arr[i]
}
let total = 0
for (let i = 0; i < arr.length; ++i) {
  total += arr[i]
}
console.log((performance.now() - t0) / 1e3, 'seconds')
