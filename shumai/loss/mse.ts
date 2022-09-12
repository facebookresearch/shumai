import * as sm from '../tensor'

export function mse(a: sm.Tensor, b: sm.Tensor) {
  const diff = a.sub(b)
  return diff.mul(diff).mean()
}
