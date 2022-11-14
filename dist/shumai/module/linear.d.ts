import type { Tensor } from '../tensor';
import { Module } from './module';
export declare class Linear extends Module {
    weight: Tensor;
    bias: Tensor;
    constructor(inp_dim: number, out_dim: number);
    forward(x: Tensor): Tensor;
}
export declare function linear(inp_dim: any, out_dim: any): Linear;
