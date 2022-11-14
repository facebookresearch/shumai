import type { Tensor } from '../tensor';
import { Module } from './module';
export declare class LayerNorm extends Module {
    private dims;
    private axes;
    private eps;
    private gamma;
    private beta;
    constructor(dims: number[], eps?: number | Tensor);
    resetParameters(): void;
    forward(tensor: Tensor): Tensor;
}
