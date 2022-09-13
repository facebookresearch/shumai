import * as sm from '../tensor'

export function sgd(tensors: sm.Tensor[], learning_rate: number) {
  const lr = sm.scalar(-learning_rate)
  for (const t of tensors) {
    t.update(t.detach().add(t.grad.detach().mul(lr)))
    t.grad = null
  }
}
