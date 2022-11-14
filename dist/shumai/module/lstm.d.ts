import type { Tensor } from '../tensor';
import { Module } from './module';
export declare class LSTM extends Module {
    W_f: Tensor;
    U_f: Tensor;
    b_f: Tensor;
    W_i: Tensor;
    U_i: Tensor;
    b_i: Tensor;
    W_o: Tensor;
    U_o: Tensor;
    b_o: Tensor;
    W_c: Tensor;
    U_c: Tensor;
    b_c: Tensor;
    constructor(inp_dim: number, out_dim: number);
    forward(x: Tensor, h: Tensor, c: Tensor): [Tensor, Tensor];
}
export declare function lstm(inp_dim: any, out_dim: any): LSTM;
