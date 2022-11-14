import { Tensor } from '../tensor';
import { Module } from './module';
export declare class Sequential extends Module {
    private _modules;
    constructor(...modules: CallableFunction[]);
    get length(): number;
    get modules(): CallableFunction[];
    forward(...inputs: unknown[]): Tensor | Tensor[];
}
