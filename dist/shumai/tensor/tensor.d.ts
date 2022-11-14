import type { OpStats } from '../network';
import { Float16Array } from '../util';
import { GradContext } from './register_gradients';
import { TensorOpsInterface } from './tensor_ops_interface_gen';
export { NATIVE_FILE } from '../ffi/ffi_flashlight';
export declare enum dtype {
    Float16,
    Float32,
    Float64,
    BoolInt8,
    Int16,
    Int32,
    Int64,
    BigInt64,
    Uint8,
    Uint16,
    Uint32,
    Uint64,
    BigUint64
}
/** @private */
export declare const gradient_functions: {
    [key: string]: CallableFunction;
};
/** @private */
export declare function wrapFLTensor(closure: CallableFunction, ...args: unknown[]): Tensor;
export declare function backward(base_t: Tensor, jacobian: Tensor): Record<string, {
    grad: Tensor;
    tensor: Tensor;
}> | Promise<Record<string, {
    grad: Tensor;
    tensor: Tensor;
}>>;
export declare class Tensor {
    private _underlying;
    private _ptr;
    private _deps;
    private _checkpoint_file;
    private _checkpoint_callback;
    requires_grad: boolean;
    requires_stats: boolean;
    stats: OpStats;
    provenance: any;
    grad: Tensor;
    op: string;
    grad_callback_async?: (grad?: GradContext) => Promise<void | Tensor>;
    /** @private */
    private _injest_ptr;
    backward(jacobian?: Tensor): Record<string, {
        grad: Tensor;
        tensor: Tensor;
    }> | Promise<Record<string, {
        grad: Tensor;
        tensor: Tensor;
    }>>;
    constructor(obj: any);
    update(tensor: Tensor): void;
    checkpoint(file?: (() => boolean) | any, callback?: () => boolean): this;
    save(filename: string): any;
    astype(dtype: dtype): Tensor;
    eval(): any;
    dispose(): void;
    get ptr(): number;
    get deps(): Tensor[];
    setDeps(deps: any): void;
    get ndim(): number;
    get dtype(): number;
    get shape(): number[];
    get shape64(): BigInt64Array;
    toString(): string;
    valueOf(): any;
    asContiguousTensor(): Tensor;
    copy(): Tensor;
    deepCopy(): Tensor;
    pad(paddings: Array<Array<number>>): Tensor;
    requireGrad(): Tensor;
    detach(): Tensor;
    get elements(): number;
    toFloat16Array(): Float16Array;
    toFloat32Array(): Float32Array;
    toFloat64Array(): Float64Array;
    toBoolInt8Array(): Int8Array;
    toInt16Array(): Int16Array;
    toInt32Array(): Int32Array;
    toBigInt64Array(): BigInt64Array;
    toUint8Array(): Uint8Array;
    toUint16Array(): Uint16Array;
    toUint32Array(): Uint32Array;
    toBigUint64Array(): BigUint64Array;
    toFloat16(): any;
    toFloat32(): number;
    toFloat64(): number;
    toBoolInt8(): number;
    toInt16(): number;
    toInt32(): number;
    toBigInt64(): bigint;
    toUint8(): number;
    toUint16(): number;
    toUint32(): number;
    toBigUint64(): bigint;
    /** @private */
    _index_args(args: any): any[][];
    index(args: any): Tensor;
    indexedAssign(t: any, args: any): Tensor;
    T(): Tensor;
    softmax(axis: number): Tensor;
    relu(): Tensor;
    leakyRelu(negative_slope: number): Tensor;
}
export interface Tensor extends TensorOpsInterface {
}
export declare function tensor(obj: any): Tensor;
/**
 * @returns The current number of bytes allocated and managed by Shumai.
 */
export declare function bytesUsed(): bigint;
export declare const conv2dBackwardData: (...args: any[]) => Tensor;
export declare const layout: {
    /** Set the framework layout to be row major (default). */
    setRowMajor: () => void;
    /** Set the framework layout to be column major. */
    setColMajor: () => void;
    /** Return true if the framework is currently row major. */
    isRowMajor: () => boolean;
    /** Return true if the framework is currently column major. */
    isColMajor: () => boolean;
};
