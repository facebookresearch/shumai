import {
  ptr
} from "bun:ffi";

interface TensorInterface {
  new(...args: any[]): TensorInterface;
  ptr: ptr;
  ndim: Number
  shape: BigInt64Array;
  toString: Function;
  asContiguousTensor: Function;
  elements: Number;
  toFloat32Array: Function;
  toFloat32: Function;
}

export {
  TensorInterface
};