import * as sm from '../tensor'

export function sgd(tensors: sm.Tensor[], learning_rate = 1e-2) {
  const lr = sm.scalar(-learning_rate)
  for (const t of tensors) {
    if (t.requires_grad) {
      t.update(t.detach().add(t.grad.detach().mul(lr)))
    }
    t.grad = null
  }
}
