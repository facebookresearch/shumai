import type { Tensor } from '../tensor'
export type OptimizerFn = (
  grads: Record<
    string,
    {
      grad: Tensor
      tensor: Tensor
    }
  >,
  learning_rate?: number
) => Promise<void> | void
export * from './adam'
export * from './optim'
export * from './sgd'
