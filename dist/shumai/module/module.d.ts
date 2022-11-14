import type { Tensor } from '../tensor';
export declare class Module extends Function {
    private __self__;
    constructor();
    forward(...args: unknown[]): Tensor[] | Tensor;
}
