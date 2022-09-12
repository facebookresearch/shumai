import * as sm from '../tensor'

export function sgd(tensors: sm.Tensor[], learning_rate: number) {
  const lr = sm.scalar(-learning_rate)
  const zero = sm.scalar(0)
  for (const t of tensors) {
    t.update(t.detach().add(t.grad.detach().mul(lr)))
    t.grad.update(t.grad.detach().mul(zero))
  }
}
