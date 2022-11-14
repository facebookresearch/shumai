import { Tensor } from '../tensor/tensor';
export declare let _tidyTracker: Map<number, Tensor>;
export declare function tidy<T>(fn: (...args: any[]) => T, args?: any | any[]): T;
