import * as sm from '../tensor';
export declare function sgd(grads: Record<string, {
    grad: sm.Tensor;
    tensor: sm.Tensor;
}>, learning_rate?: number): void;
