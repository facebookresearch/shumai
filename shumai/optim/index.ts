import type { Tensor } from '../tensor'
export type OptimizerFn = (tensors: Tensor[], learning_rate?: number) => Promise<void> | void
export * from './sgd'
