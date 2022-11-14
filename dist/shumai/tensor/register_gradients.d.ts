import type { Tensor } from './tensor';
declare type ArgType = Tensor | number | number[] | BigInt64Array | boolean;
export interface GradContext {
    forward_inputs: [Tensor, ...ArgType[]];
    forward_output: Tensor;
    backward_input: Tensor;
    backward_output_index: number;
}
export {};
