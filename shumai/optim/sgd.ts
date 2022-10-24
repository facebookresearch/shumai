import * as sm from '../tensor'

export function sgd(
  grads: Record<string, { grad: sm.Tensor; tensor: sm.Tensor }>,
  learning_rate = 1e-3
) {
  const lr = sm.scalar(-learning_rate)
  for (const [, v] of Object.entries(grads)) {
    const { tensor: t, grad: g } = v
    if (t.requires_grad) {
      t.update(t.detach().add(g.detach().mul(lr)))
    }
    t.grad = null
  }
}
