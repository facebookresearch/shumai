/* GENERATED CODE (gen_binding.py) */
import {
  FFIType
} from "bun:ffi";
import {
  arrayArg
} from "../ffi/ffi_bind_utils";
import {
  fl
} from "../ffi/ffi_flashlight";
import {
  TensorInterface
} from "./tensor_interface";

export const gen_tensor_op_shim = (wrapFunc: Function) => {
  return {
    reshape(shape: number[]) {
      const t = wrapFunc(fl._reshape, this, ...arrayArg(shape, FFIType.i64));
      t.op = "reshape";
      t.grad_fn = null;
      return t;
    },

    transpose(axes: number[]) {
      const t = wrapFunc(fl._transpose, this, ...arrayArg(axes, FFIType.i64));
      t.op = "transpose";
      t.grad_fn = null;
      return t;
    },

    tile(shape: number[]) {
      const t = wrapFunc(fl._tile, this, ...arrayArg(shape, FFIType.i64));
      t.op = "tile";
      t.grad_fn = null;
      return t;
    },

    nonzero() {
      const t = wrapFunc(fl._nonzero, this);
      t.op = "nonzero";
      t.grad_fn = null;
      return t;
    },

    negative() {
      const t = wrapFunc(fl._negative, this);
      t.op = "negative";
      t.grad_fn = null;
      return t;
    },

    logicalNot() {
      const t = wrapFunc(fl._logicalNot, this);
      t.op = "logicalNot";
      t.grad_fn = null;
      return t;
    },

    exp() {
      const t = wrapFunc(fl._exp, this);
      t.op = "exp";
      t.grad_fn = null;
      return t;
    },

    log() {
      const t = wrapFunc(fl._log, this);
      t.op = "log";
      t.grad_fn = null;
      return t;
    },

    log1p() {
      const t = wrapFunc(fl._log1p, this);
      t.op = "log1p";
      t.grad_fn = null;
      return t;
    },

    sin() {
      const t = wrapFunc(fl._sin, this);
      t.op = "sin";
      t.grad_fn = null;
      return t;
    },

    cos() {
      const t = wrapFunc(fl._cos, this);
      t.op = "cos";
      t.grad_fn = null;
      return t;
    },

    sqrt() {
      const t = wrapFunc(fl._sqrt, this);
      t.op = "sqrt";
      t.grad_fn = null;
      return t;
    },

    tanh() {
      const t = wrapFunc(fl._tanh, this);
      t.op = "tanh";
      t.grad_fn = null;
      return t;
    },

    floor() {
      const t = wrapFunc(fl._floor, this);
      t.op = "floor";
      t.grad_fn = null;
      return t;
    },

    ceil() {
      const t = wrapFunc(fl._ceil, this);
      t.op = "ceil";
      t.grad_fn = null;
      return t;
    },

    rint() {
      const t = wrapFunc(fl._rint, this);
      t.op = "rint";
      t.grad_fn = null;
      return t;
    },

    absolute() {
      const t = wrapFunc(fl._absolute, this);
      t.op = "absolute";
      t.grad_fn = null;
      return t;
    },

    abs() {
      const t = wrapFunc(fl._abs, this);
      t.op = "abs";
      t.grad_fn = null;
      return t;
    },

    sigmoid() {
      const t = wrapFunc(fl._sigmoid, this);
      t.op = "sigmoid";
      t.grad_fn = null;
      return t;
    },

    erf() {
      const t = wrapFunc(fl._erf, this);
      t.op = "erf";
      t.grad_fn = null;
      return t;
    },

    flip(dim: number) {
      const t = wrapFunc(fl._flip, this, dim);
      t.op = "flip";
      t.grad_fn = null;
      return t;
    },

    clip(low: TensorInterface, high: TensorInterface) {
      const t = wrapFunc(fl._clip, this, low, high);
      t.op = "clip";
      t.grad_fn = null;
      return t;
    },

    roll(shift: number, axis: number) {
      const t = wrapFunc(fl._roll, this, shift, axis);
      t.op = "roll";
      t.grad_fn = null;
      return t;
    },

    isnan() {
      const t = wrapFunc(fl._isnan, this);
      t.op = "isnan";
      t.grad_fn = null;
      return t;
    },

    isinf() {
      const t = wrapFunc(fl._isinf, this);
      t.op = "isinf";
      t.grad_fn = null;
      return t;
    },

    sign() {
      const t = wrapFunc(fl._sign, this);
      t.op = "sign";
      t.grad_fn = null;
      return t;
    },

    tril() {
      const t = wrapFunc(fl._tril, this);
      t.op = "tril";
      t.grad_fn = null;
      return t;
    },

    triu() {
      const t = wrapFunc(fl._triu, this);
      t.op = "triu";
      t.grad_fn = null;
      return t;
    },

    where(x: TensorInterface, y: TensorInterface) {
      const t = wrapFunc(fl._where, this, x, y);
      t.op = "where";
      t.grad_fn = null;
      return t;
    },

    sort(dim: number) {
      const t = wrapFunc(fl._sort, this, dim);
      t.op = "sort";
      t.grad_fn = null;
      return t;
    },

    add(tensor: TensorInterface) {
      const t = wrapFunc(fl._add, this, tensor);
      t.op = "add";
      t.grad_fn = (grad) => {
        return grad.grad_in;
      };
      return t;
    },

    sub(tensor: TensorInterface) {
      const t = wrapFunc(fl._sub, this, tensor);
      t.op = "sub";
      t.grad_fn = (grad) => {
        if (grad.idx) {
          return grad.grad_in.negative();
        }
        return grad.grad_in;
      };
      return t;
    },

    mul(tensor: TensorInterface) {
      const t = wrapFunc(fl._mul, this, tensor);
      t.op = "mul";
      t.grad_fn = (grad) => {
        return grad.in[1 - grad.idx].mul(grad.grad_in);
      };
      return t;
    },

    div(tensor: TensorInterface) {
      const t = wrapFunc(fl._div, this, tensor);
      t.op = "div";
      t.grad_fn = (grad) => {
        const T = grad.in[0].constructor;
        const one = new T(new Float32Array([1]));
        const recip = one.div(grad.in[1]);
        const go = grad.grad_in.mul(recip);
        if (grad.idx === 0) {
          return go;
        } else if (grad.idx === 1) {
          return go.negate().mul(recip);
        }
      };
      return t;
    },

    eq(tensor: TensorInterface) {
      const t = wrapFunc(fl._eq, this, tensor);
      t.op = "eq";
      t.grad_fn = null;
      return t;
    },

    neq(tensor: TensorInterface) {
      const t = wrapFunc(fl._neq, this, tensor);
      t.op = "neq";
      t.grad_fn = null;
      return t;
    },

    lessThan(tensor: TensorInterface) {
      const t = wrapFunc(fl._lessThan, this, tensor);
      t.op = "lessThan";
      t.grad_fn = null;
      return t;
    },

    lessThanEqual(tensor: TensorInterface) {
      const t = wrapFunc(fl._lessThanEqual, this, tensor);
      t.op = "lessThanEqual";
      t.grad_fn = null;
      return t;
    },

    greaterThan(tensor: TensorInterface) {
      const t = wrapFunc(fl._greaterThan, this, tensor);
      t.op = "greaterThan";
      t.grad_fn = null;
      return t;
    },

    greaterThanEqual(tensor: TensorInterface) {
      const t = wrapFunc(fl._greaterThanEqual, this, tensor);
      t.op = "greaterThanEqual";
      t.grad_fn = null;
      return t;
    },

    logicalOr(tensor: TensorInterface) {
      const t = wrapFunc(fl._logicalOr, this, tensor);
      t.op = "logicalOr";
      t.grad_fn = null;
      return t;
    },

    logicalAnd(tensor: TensorInterface) {
      const t = wrapFunc(fl._logicalAnd, this, tensor);
      t.op = "logicalAnd";
      t.grad_fn = null;
      return t;
    },

    mod(tensor: TensorInterface) {
      const t = wrapFunc(fl._mod, this, tensor);
      t.op = "mod";
      t.grad_fn = null;
      return t;
    },

    bitwiseAnd(tensor: TensorInterface) {
      const t = wrapFunc(fl._bitwiseAnd, this, tensor);
      t.op = "bitwiseAnd";
      t.grad_fn = null;
      return t;
    },

    bitwiseOr(tensor: TensorInterface) {
      const t = wrapFunc(fl._bitwiseOr, this, tensor);
      t.op = "bitwiseOr";
      t.grad_fn = null;
      return t;
    },

    bitwiseXor(tensor: TensorInterface) {
      const t = wrapFunc(fl._bitwiseXor, this, tensor);
      t.op = "bitwiseXor";
      t.grad_fn = null;
      return t;
    },

    lShift(tensor: TensorInterface) {
      const t = wrapFunc(fl._lShift, this, tensor);
      t.op = "lShift";
      t.grad_fn = null;
      return t;
    },

    rShift(tensor: TensorInterface) {
      const t = wrapFunc(fl._rShift, this, tensor);
      t.op = "rShift";
      t.grad_fn = null;
      return t;
    },

    minimum(tensor: TensorInterface) {
      const t = wrapFunc(fl._minimum, this, tensor);
      t.op = "minimum";
      t.grad_fn = null;
      return t;
    },

    maximum(tensor: TensorInterface) {
      const t = wrapFunc(fl._maximum, this, tensor);
      t.op = "maximum";
      t.grad_fn = (grad) => {
        const a_idx = grad.idx;
        const b_idx = 1 - grad.idx;
        const mask = grad.in[a_idx].greaterThan(grad.in[b_idx]);
        return mask.mul(grad.grad_in);
      };
      return t;
    },

    power(tensor: TensorInterface) {
      const t = wrapFunc(fl._power, this, tensor);
      t.op = "power";
      t.grad_fn = null;
      return t;
    },

    matmul(tensor: TensorInterface) {
      const t = wrapFunc(fl._matmul, this, tensor);
      t.op = "matmul";
      t.grad_fn = (grad) => {
        if (grad.idx === 0) {
          const yT = grad.in[1].transpose([1, 0]);
          return grad.grad_in.matmul(yT);
        } else if (grad.idx === 1) {
          const xT = grad.in[0].transpose([1, 0]);
          return xT.matmul(grad.grad_in);
        }
      };
      return t;
    },

    amin(axes: number[] = [], keep_dims: boolean = false) {
      const t = wrapFunc(fl._amin, this, ...arrayArg(axes, FFIType.i32), keep_dims);
      t.op = "amin";
      t.grad_fn = null;
      return t;
    },

    amax(axes: number[] = [], keep_dims: boolean = false) {
      const t = wrapFunc(fl._amax, this, ...arrayArg(axes, FFIType.i32), keep_dims);
      t.op = "amax";
      t.grad_fn = null;
      return t;
    },

    argmin(axis: number, keep_dims: boolean = false) {
      const t = wrapFunc(fl._argmin, this, axis, keep_dims);
      t.op = "argmin";
      t.grad_fn = null;
      return t;
    },

    argmax(axis: number, keep_dims: boolean = false) {
      const t = wrapFunc(fl._argmax, this, axis, keep_dims);
      t.op = "argmax";
      t.grad_fn = null;
      return t;
    },

    sum(axes: number[] = [], keep_dims: boolean = false) {
      const t = wrapFunc(fl._sum, this, ...arrayArg(axes, FFIType.i32), keep_dims);
      t.op = "sum";
      t.grad_fn = (grad) => {
        return grad.grad_in.tile(grad.in[0].shape);
      };
      return t;
    },

    cumsum(axis: number) {
      const t = wrapFunc(fl._cumsum, this, axis);
      t.op = "cumsum";
      t.grad_fn = null;
      return t;
    },

    mean(axes: number[] = [], keep_dims: boolean = false) {
      const t = wrapFunc(fl._mean, this, ...arrayArg(axes, FFIType.i32), keep_dims);
      t.op = "mean";
      t.grad_fn = (grad) => {
        const T = grad.in[0].constructor;
        const num = new T(new Float32Array([grad.in[0].elements]));
        return grad.grad_in.tile(grad.in[0].shape).div(num);
      };
      return t;
    },

    median(axes: number[] = [], keep_dims: boolean = false) {
      const t = wrapFunc(fl._median, this, ...arrayArg(axes, FFIType.i32), keep_dims);
      t.op = "median";
      t.grad_fn = null;
      return t;
    },

    _var(axes: number[] = [], bias: boolean = false, keep_dims: boolean = false) {
      const t = wrapFunc(fl._var, this, ...arrayArg(axes, FFIType.i32), bias, keep_dims);
      t.op = "var";
      t.grad_fn = null;
      return t;
    },

    std(axes: number[] = [], keep_dims: boolean = false) {
      const t = wrapFunc(fl._std, this, ...arrayArg(axes, FFIType.i32), keep_dims);
      t.op = "std";
      t.grad_fn = null;
      return t;
    },

    norm(axes: number[] = [], p: number = 2, keep_dims: boolean = false) {
      const t = wrapFunc(fl._norm, this, ...arrayArg(axes, FFIType.i32), p, keep_dims);
      t.op = "norm";
      t.grad_fn = null;
      return t;
    },

    countNonzero(axes: number[] = [], keep_dims: boolean = false) {
      const t = wrapFunc(fl._countNonzero, this, ...arrayArg(axes, FFIType.i32), keep_dims);
      t.op = "countNonzero";
      t.grad_fn = null;
      return t;
    },

    any(axes: number[] = [], keep_dims: boolean = false) {
      const t = wrapFunc(fl._any, this, ...arrayArg(axes, FFIType.i32), keep_dims);
      t.op = "any";
      t.grad_fn = null;
      return t;
    },

    all(axes: number[] = [], keep_dims: boolean = false) {
      const t = wrapFunc(fl._all, this, ...arrayArg(axes, FFIType.i32), keep_dims);
      t.op = "all";
      t.grad_fn = null;
      return t;
    },
  };
}