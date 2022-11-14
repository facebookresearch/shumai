import { Tensor } from './tensor';
/**
 *
 *   Generate a uniform distribution.
 *
 *   @remarks
 *   For a normal (Gaussian) distribution, see {@link randn}.
 *
 *   @example
 *   ```javascript
 *   // 128x8 uniformly random tensor
 *   const t = sm.rand([128, 8])
 *   ```
 *
 *   @param shape - The shape of the output {@link Tensor}
 *
 *   @returns A new {@link Tensor} of uniformly random values
 */ export declare function rand(shape: BigInt64Array | number[]): Tensor;
/**
 *
 *   Generate a normal (Gaussian) distribution.
 *
 *   @remarks
 *   For a uniform distribution, see {@link rand}.
 *
 *   @example
 *   ```javascript
 *   // 128x8 gaussian tensor
 *   const t = sm.randn([128, 8])
 *   ```
 *
 *   @param shape - The shape of the output {@link Tensor}
 *
 *   @returns A new {@link Tensor} of random values sampled from a Gaussian distribution
 */ export declare function randn(shape: BigInt64Array | number[]): Tensor;
/**
 *
 *   Create a {@link Tensor} filled with a single value.
 *
 *   @example
 *   ```javascript
 *   // 128x8 tensor of all 1s
 *   const t = sm.full([128, 8], 1)
 *   ```
 *
 *   @param shape - The shape of the output {@link Tensor}
 *   @param val - The value used to fill the output
 *
 *   @returns A new {@link Tensor} of a single user specified value.
 */ export declare function full(shape: BigInt64Array | number[], val: number): Tensor;
/**
 *
 *   Create a square 2D identity {@link Tensor}.
 *
 *   @remarks
 *   This is similar to the `eye` API of other tensor frameworks.
 *
 *   @example
 *   ```javascript
 *   // 128x128 identity tensor
 *   const t = sm.identity(128)
 *   ```
 *
 *   @param dim - The dimension of the output {@link Tensor}
 *
 *   @returns A new identity {@link Tensor}.
 */ export declare function identity(dim: number): Tensor;
export declare function ident(dim: number): Tensor;
export declare function eye(dim: number): Tensor;
/**
 *
 *   Create a {@link Tensor} of evenly-spaced values in a given interval.
 *
 *   @example
 *   ```javascript
 *   // create a tensor of even values starting with 0: `[0,2,4,8]`
 *   const t = sm.arange(0, 10, 2)
 *   ```
 *
 *   @param start - The start of the interval (inclusive)
 *   @param end - The end of the interval (exclusive)
 *   @param step - An optional argument to stride the interval
 *
 *   @returns A new 1D {@link Tensor} containing the user defined interval.
 */ export declare function arange(start: number, end: number, step?: number): Tensor;
/**
 *
 *   Tile a {@link Tensor} of N-dimensionally shaped ranges.
 *
 *   @example
 *   ```javascript
 *   const t0 = sm.iota([2, 2], [2])
 *   // same as
 *   const t1 = sm.arange(0, 4).reshape([2, 2]).tile([2])
 *   ```
 *
 *   @param dims - The dimension of the intermediate (untiled tensor). This shape determines the range of the values within the output.
 *   @param tileDims - How to tile the intermediate tensor.
 *   @returns A new {@link Tensor}
 */ export declare function iota(dims: BigInt64Array | number[], tileDims?: BigInt64Array | number[]): Tensor;
/**
 *
 *   Reshape a {@link Tensor} without modifying the underlying data. There is a method version of this static function: {@link Tensor.reshape | Tensor.reshape }.
 *
 *   @remarks
 *   The resultant shape must contain the same number of elements as the base Tensor.
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([64])
 *
 *   // equivalent calls
 *   const a = t.reshape([8, 8])
 *   const b = sm.reshape(t, [8, 8])
 *   ```
 *
 *
 *   @param tensor - {@link Tensor} to reshape
 *   @param shape - The shape of the output {@link Tensor}
 */ export declare function reshape(tensor: Tensor, shape: BigInt64Array | number[]): Tensor;
/**
 *
 *   Re-arrange the layout of the values within a {@link Tensor}. There is a method version of this static function: {@link Tensor.transpose | Tensor.transpose }.
 *
 *   @remarks
 *   The total number of elements of the tensor does not change.
 *
 *   @example
 *   ```javascript
 *   const t = sm.rand([128, 8])
 *
 *   // equivalent calls
 *   const a = t.transpose([1, 0])
 *   a.shape // [8, 128]
 *   const b = sm.transpose(t, [1, 0])
 *   b.shape // [8, 128]
 *   ```
 *
 *   @param tensor - {@link Tensor} to transpose
 *   @param axes - The new order of the indices of the current axes after tranposing
 *   @returns A new {@link Tensor}
 */ export declare function transpose(tensor: Tensor, axes: BigInt64Array | number[]): Tensor;
/**
 *
 *   Replicate a {@link Tensor} about its axes. There is a method version of this static function: {@link Tensor.tile | Tensor.tile }.
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.identity(4)
 *
 *   // equivalent calls
 *   const a = sm.tile(t, [2, 2])
 *   a.shape // [8, 8]
 *   const b = t.tile([2, 2])
 *   b.shape // [8, 8]
 *
 *   // tiling by 1 on all dims does nothing
 *   const no_op = t.tile([1, 1])
 *   ```
 *
 *   @param tensor - {@link Tensor} to tile
 *   @param shape - A shape describing the number of iterations to tile each axis.
 *   @returns A new {@link Tensor}
 */ export declare function tile(tensor: Tensor, shape: BigInt64Array | number[]): Tensor;
export declare function concatenate(tensors: Array<Tensor>, axis: number): Tensor;
export declare function concat(tensors: Array<Tensor>, axis: number): Tensor;
/**
 *
 *   Determine the indices of elements that are non-zero. There is a method version of this static function: {@link Tensor.nonzero | Tensor.nonzero }.
 *
 *   @remarks
 *
 *   Indices correspond to a flattened version of the input tensor.
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([100])
 *
 *   // equivalent calls
 *   const a = t.nonzero()
 *   const b = sm.nonzero(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will be used to find indices
 *   @returns - A new {@link Tensor} composed of the flattened indices of the non-zero elements in the input
 */ export declare function nonzero(tensor: Tensor): Tensor;
/**
 *
 *   Negate a tensor. There is a method version of this static function: {@link Tensor.negative | Tensor.negative }.
 *
 *   $$-x : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([100])
 *
 *   // equivalent calls
 *   const a = t.negative()
 *   const b = sm.negative(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will be negated
 *   @returns - A new {@link Tensor}
 */ export declare function negative(tensor: Tensor): Tensor;
export declare function negate(tensor: Tensor): Tensor;
/**
 *
 *   Take the logical `not` of every element in a tensor. There is a method version of this static function: {@link Tensor.logicalNot | Tensor.logicalNot }.
 *
 *   $$\neg x : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.rand([100]).greaterThan(sm.scalar(0.5))
 *
 *   // equivalent calls
 *   const a = t.logicalNot()
 *   const b = sm.logicalNot(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will be logically inverted
 *   @returns - A new {@link Tensor}
 */ export declare function logicalNot(tensor: Tensor): Tensor;
/**
 *
 *   Compute the exponential of each element in a tensor. There is a method version of this static function: {@link Tensor.exp | Tensor.exp }.
 *
 *   $$e^x : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([100])
 *
 *   // equivalent calls
 *   const a = t.exp()
 *   const b = sm.exp(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will be exponentiated
 *   @returns - A new {@link Tensor}
 */ export declare function exp(tensor: Tensor): Tensor;
/**
 *
 *   Compute the natural logarithm of each element in a tensor. There is a method version of this static function: {@link Tensor.log | Tensor.log }.
 *
 *   $$\ln(x) : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([100])
 *
 *   // equivalent calls
 *   const a = t.log()
 *   const b = sm.log(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their natural logarithm calculated
 *   @returns - A new {@link Tensor}
 */ export declare function log(tensor: Tensor): Tensor;
/**
 *
 *   Compute the natural logarithm of one plus each element in a tensor. There is a method version of this static function: {@link Tensor.log1p | Tensor.log1p }.
 *
 *   $$\ln(1 + x) : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([100])
 *
 *   // equivalent calls
 *   const a = t.log1p()
 *   const b = sm.log1p(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have one added before their natural logarithm is calculated
 *   @returns - A new {@link Tensor}
 */ export declare function log1p(tensor: Tensor): Tensor;
/**
 *
 *   Compute the sine function each element in a tensor. There is a method version of this static function: {@link Tensor.sin | Tensor.sin }.
 *
 *   $$\sin(x) : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.sin()
 *   const b = sm.sin(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their sine calculated
 *   @returns - A new {@link Tensor}
 */ export declare function sin(tensor: Tensor): Tensor;
/**
 *
 *   Compute the cosine function each element in a tensor. There is a method version of this static function: {@link Tensor.cos | Tensor.cos }.
 *
 *   $$\cos(x) : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.cos()
 *   const b = sm.cos(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their cosine calculated
 *   @returns - A new {@link Tensor}
 */ export declare function cos(tensor: Tensor): Tensor;
/**
 *
 *   Compute the square root of each element in a tensor. There is a method version of this static function: {@link Tensor.sqrt | Tensor.sqrt }.
 *
 *   $$\sqrt x : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.sqrt()
 *   const b = sm.sqrt(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their square root calculated
 *   @returns - A new {@link Tensor}
 */ export declare function sqrt(tensor: Tensor): Tensor;
/**
 *
 *   Compute the hyperbolic tangent function each element in a tensor. There is a method version of this static function: {@link Tensor.tanh | Tensor.tanh }.
 *
 *   $$\tanh(x) : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.tanh()
 *   const b = sm.tanh(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their hyperbolic tangent calculated
 *   @returns - A new {@link Tensor}
 */ export declare function tanh(tensor: Tensor): Tensor;
/**
 *
 *   Compute the mathematical floor (round down) of each element in a tensor. There is a method version of this static function: {@link Tensor.floor | Tensor.floor }.
 *
 *   $$\lfloor x \rfloor : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.floor()
 *   const b = sm.floor(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their mathematical floor calculated
 *   @returns - A new {@link Tensor}
 */ export declare function floor(tensor: Tensor): Tensor;
/**
 *
 *   Compute the mathematical ceiling (round up) of each element in a tensor. There is a method version of this static function: {@link Tensor.ceil | Tensor.ceil }.
 *
 *   $$\lceil x \rceil : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.ceil()
 *   const b = sm.ceil(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their mathematical ceiling calculated
 *   @returns - A new {@link Tensor}
 */ export declare function ceil(tensor: Tensor): Tensor;
/**
 *
 *   Round each element in a tensor to the nearest integer. There is a method version of this static function: {@link Tensor.rint | Tensor.rint }.
 *
 *   $$
 *   x =
 *   \begin\{cases\}
 *       \lfloor x \rfloor,& \text\{if \} x - \lfloor x \rfloor \leq \frac\{1\}\{2\}\\\\
 *       \lceil x \rceil,& \text\{otherwise\}
 *   \end\{cases\}
 *   \forall x \in T
 *   $$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.rint()
 *   const b = sm.rint(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will be rounded to the nearest integer
 *   @returns - A new {@link Tensor}
 */ export declare function rint(tensor: Tensor): Tensor;
/**
 *
 *   Calculate the absolute value for every element in a {@link Tensor}. There is a method version of this static function: {@link Tensor.absolute | Tensor.absolute }.
 *
 *   $$|x| : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([128, 128])
 *
 *   // equivalent calls
 *   const a = t.absolute()
 *   const b = sm.absolute(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their absolute value calculated
 *   @returns - A new {@link Tensor}
 */ export declare function absolute(tensor: Tensor): Tensor;
export declare function abs(tensor: Tensor): Tensor;
/**
 *
 *   Calculate the sigmoid (logistic function) for each element in a {@link Tensor}. There is a method version of this static function: {@link Tensor.sigmoid | Tensor.sigmoid }.
 *
 *   $$\frac\{1\}\{1 + e^\{-x\}\} : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([1337])
 *
 *   // equivalent calls
 *   const a = t.sigmoid()
 *   const b = sm.sigmoid(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their sigmoid calculated
 *   @returns - A new {@link Tensor}
 */ export declare function sigmoid(tensor: Tensor): Tensor;
/**
 *
 *   Calculate the error function ({@link https://en.wikipedia.org/wiki/Error_function | Wikipedia entry}) for each element in a {@link Tensor}. There is a method version of this static function: {@link Tensor.erf | Tensor.erf }.
 *
 *   $$\frac\{2\}\{\sqrt\{\pi\}\}\int_0^\{x\} e^\{-t^2\} dt : \forall x \in T$$
 *
 *   @example
 *
 *   ```javascript
 *   const t = sm.randn([1337])
 *
 *   // equivalent calls
 *   const a = t.erf()
 *   const b = sm.erf(t)
 *   ```
 *
 *   @param tensor - {@link Tensor} whose values will have their error function calculated
 *   @returns - A new {@link Tensor}
 */ export declare function erf(tensor: Tensor): Tensor;
export declare function flip(tensor: Tensor, dim: number): Tensor;
export declare function clip(tensor: Tensor, low: Tensor, high: Tensor): Tensor;
export declare function roll(tensor: Tensor, shift: number, axis: number): Tensor;
export declare function isnan(tensor: Tensor): Tensor;
export declare function isinf(tensor: Tensor): Tensor;
export declare function sign(tensor: Tensor): Tensor;
export declare function tril(tensor: Tensor): Tensor;
export declare function triu(tensor: Tensor): Tensor;
export declare function where(cond: Tensor, x: Tensor, y: Tensor): Tensor;
export declare function sort(tensor: Tensor, dim: number): Tensor;
export declare function add(tensor: Tensor, other: Tensor): Tensor;
export declare function sub(tensor: Tensor, other: Tensor): Tensor;
export declare function mul(tensor: Tensor, other: Tensor): Tensor;
export declare function div(tensor: Tensor, other: Tensor): Tensor;
export declare function eq(tensor: Tensor, other: Tensor): Tensor;
export declare function neq(tensor: Tensor, other: Tensor): Tensor;
export declare function lessThan(tensor: Tensor, other: Tensor): Tensor;
export declare function lt(tensor: Tensor, other: Tensor): Tensor;
export declare function lessThanEqual(tensor: Tensor, other: Tensor): Tensor;
export declare function lte(tensor: Tensor, other: Tensor): Tensor;
export declare function greaterThan(tensor: Tensor, other: Tensor): Tensor;
export declare function gt(tensor: Tensor, other: Tensor): Tensor;
export declare function greaterThanEqual(tensor: Tensor, other: Tensor): Tensor;
export declare function gte(tensor: Tensor, other: Tensor): Tensor;
export declare function logicalOr(tensor: Tensor, other: Tensor): Tensor;
export declare function logicalAnd(tensor: Tensor, other: Tensor): Tensor;
export declare function mod(tensor: Tensor, other: Tensor): Tensor;
export declare function bitwiseAnd(tensor: Tensor, other: Tensor): Tensor;
export declare function bitwiseOr(tensor: Tensor, other: Tensor): Tensor;
export declare function bitwiseXor(tensor: Tensor, other: Tensor): Tensor;
export declare function lShift(tensor: Tensor, other: Tensor): Tensor;
export declare function rShift(tensor: Tensor, other: Tensor): Tensor;
export declare function minimum(tensor: Tensor, other: Tensor): Tensor;
export declare function maximum(tensor: Tensor, other: Tensor): Tensor;
export declare function power(tensor: Tensor, other: Tensor): Tensor;
export declare function matmul(tensor: Tensor, other: Tensor): Tensor;
export declare function mm(tensor: Tensor, other: Tensor): Tensor;
export declare function conv2d(tensor: Tensor, weights: Tensor, sx?: number, sy?: number, px?: number, py?: number, dx?: number, dy?: number, groups?: number): Tensor;
export declare function amin(tensor: Tensor, axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor;
export declare function amax(tensor: Tensor, axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor;
export declare function argmin(tensor: Tensor, axis: number, keep_dims?: boolean): Tensor;
export declare function argmax(tensor: Tensor, axis: number, keep_dims?: boolean): Tensor;
export declare function sum(tensor: Tensor, axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor;
export declare function cumsum(tensor: Tensor, axis: number): Tensor;
export declare function mean(tensor: Tensor, axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor;
export declare function median(tensor: Tensor, axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor;
export declare function _var(tensor: Tensor, axes?: BigInt64Array | number[], bias?: boolean, keep_dims?: boolean): Tensor;
export declare function variance(tensor: Tensor, axes?: BigInt64Array | number[], bias?: boolean, keep_dims?: boolean): Tensor;
export declare function std(tensor: Tensor, axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor;
export declare function norm(tensor: Tensor, axes?: BigInt64Array | number[], p?: number, keep_dims?: boolean): Tensor;
export declare function normalize(tensor: Tensor, axes?: BigInt64Array | number[], p?: number, keep_dims?: boolean): Tensor;
export declare function countNonzero(tensor: Tensor, axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor;
export declare function any(tensor: Tensor, axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor;
export declare function all(tensor: Tensor, axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor;
