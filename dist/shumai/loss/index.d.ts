import * as sm from '../tensor';
export declare type LossFn = (a: sm.Tensor, b: sm.Tensor) => sm.Tensor;
export * from './mse';
