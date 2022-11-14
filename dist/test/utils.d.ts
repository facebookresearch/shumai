import type { Tensor } from '@shumai/shumai';
import { util } from '@shumai/shumai';
export declare const nativeError: RegExp;
export declare const calcSizeFromShape: (arr: number[]) => number;
/**
 * exported helper functions to make up for bun's wiptest
 * lacking some features
 */
export declare const isShape: (t: Tensor, expectedShape: number[]) => boolean;
export declare const areSameShape: (t1: Tensor, t2: Tensor) => boolean;
export declare const expectThrows: (fn: CallableFunction, exp?: Error['message'] | RegExp | CallableFunction, msg?: Error['message']) => void;
export declare const isClose: (actual: number | bigint, expected: number | bigint, error?: number) => boolean;
export declare const expectArraysClose: (actual: util.ArrayLike, expected: util.ArrayLike | number, error?: number) => void;
