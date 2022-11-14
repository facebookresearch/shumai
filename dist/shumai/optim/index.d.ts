import type { Tensor } from '../tensor';
export declare type OptimizerFn = (grads: Record<string, {
    grad: Tensor;
    tensor: Tensor;
}>, learning_rate?: number) => Promise<void> | void;
export * from './sgd';
