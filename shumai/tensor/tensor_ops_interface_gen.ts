/* GENERATED CODE (gen_binding.py) */
import type { Tensor } from './tensor'
/** @private */
interface TensorOpsInterface {
  /**
   *
   *   Reshape a {@link Tensor} without modifying the underlying data. There is a static function version of this method: {@link reshape}.
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
   *   @param shape - The shape of the output {@link Tensor}
   */
  reshape(shape: BigInt64Array | number[]): Tensor
  /**
   *
   *   Re-arrange the layout of the values within a {@link Tensor}. There is a static function version of this method: {@link transpose}.
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
   *   @param axes - The new order of the indices of the current axes after tranposing
   *   @returns A new {@link Tensor}
   */
  transpose(axes: BigInt64Array | number[]): Tensor
  /**
   *
   *   Replicate a {@link Tensor} about its axes. There is a static function version of this method: {@link tile}.
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
   *   @param shape - A shape describing the number of iterations to tile each axis.
   *   @returns A new {@link Tensor}
   */
  tile(shape: BigInt64Array | number[]): Tensor
  /**
   *
   *   Determine the indices of elements that are non-zero. There is a static function version of this method: {@link nonzero}.
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
   *   @returns - A new {@link Tensor} composed of the flattened indices of the non-zero elements in the input
   */
  nonzero(): Tensor
  /**
   *
   *   Negate a tensor. There is a static function version of this method: {@link negative}.
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
   *   @returns - A new {@link Tensor}
   */
  negative(): Tensor
  negate(): Tensor
  /**
   *
   *   Take the logical `not` of every element in a tensor. There is a static function version of this method: {@link logicalNot}.
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
   *   @returns - A new {@link Tensor}
   */
  logicalNot(): Tensor
  /**
   *
   *   Compute the exponential of each element in a tensor. There is a static function version of this method: {@link exp}.
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
   *   @returns - A new {@link Tensor}
   */
  exp(): Tensor
  /**
   *
   *   Compute the natural logarithm of each element in a tensor. There is a static function version of this method: {@link log}.
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
   *   @returns - A new {@link Tensor}
   */
  log(): Tensor
  /**
   *
   *   Compute the natural logarithm of one plus each element in a tensor. There is a static function version of this method: {@link log1p}.
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
   *   @returns - A new {@link Tensor}
   */
  log1p(): Tensor
  /**
   *
   *   Compute the sine function each element in a tensor. There is a static function version of this method: {@link sin}.
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
   *   @returns - A new {@link Tensor}
   */
  sin(): Tensor
  /**
   *
   *   Compute the cosine function each element in a tensor. There is a static function version of this method: {@link cos}.
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
   *   @returns - A new {@link Tensor}
   */
  cos(): Tensor
  /**
   *
   *   Compute the square root of each element in a tensor. There is a static function version of this method: {@link sqrt}.
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
   *   @returns - A new {@link Tensor}
   */
  sqrt(): Tensor
  /**
   *
   *   Compute the hyperbolic tangent function each element in a tensor. There is a static function version of this method: {@link tanh}.
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
   *   @returns - A new {@link Tensor}
   */
  tanh(): Tensor
  /**
   *
   *   Compute the mathematical floor (round down) of each element in a tensor. There is a static function version of this method: {@link floor}.
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
   *   @returns - A new {@link Tensor}
   */
  floor(): Tensor
  /**
   *
   *   Compute the mathematical ceiling (round up) of each element in a tensor. There is a static function version of this method: {@link ceil}.
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
   *   @returns - A new {@link Tensor}
   */
  ceil(): Tensor
  /**
   *
   *   Round each element in a tensor to the nearest integer. There is a static function version of this method: {@link rint}.
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
   *   @returns - A new {@link Tensor}
   */
  rint(): Tensor
  /**
   *
   *   Calculate the absolute value for every element in a {@link Tensor}. There is a static function version of this method: {@link absolute}.
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
   *   @returns - A new {@link Tensor}
   */
  absolute(): Tensor
  abs(): Tensor
  /**
   *
   *   Calculate the sigmoid (logistic function) for each element in a {@link Tensor}. There is a static function version of this method: {@link sigmoid}.
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
   *   @returns - A new {@link Tensor}
   */
  sigmoid(): Tensor
  /**
   *
   *   Calculate the error function ({@link https://en.wikipedia.org/wiki/Error_function | Wikipedia entry}) for each element in a {@link Tensor}. There is a static function version of this method: {@link erf}.
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
   *   @returns - A new {@link Tensor}
   */
  erf(): Tensor
  flip(dim: number): Tensor
  clip(low: Tensor, high: Tensor): Tensor
  roll(shift: number, axis: number): Tensor
  isnan(): Tensor
  isinf(): Tensor
  sign(): Tensor
  tril(): Tensor
  triu(): Tensor
  where(x: Tensor, y: Tensor): Tensor
  sort(dim: number): Tensor
  add(other: Tensor): Tensor
  sub(other: Tensor): Tensor
  mul(other: Tensor): Tensor
  div(other: Tensor): Tensor
  eq(other: Tensor): Tensor
  neq(other: Tensor): Tensor
  lessThan(other: Tensor): Tensor
  lt(other: Tensor): Tensor
  lessThanEqual(other: Tensor): Tensor
  lte(other: Tensor): Tensor
  greaterThan(other: Tensor): Tensor
  gt(other: Tensor): Tensor
  greaterThanEqual(other: Tensor): Tensor
  gte(other: Tensor): Tensor
  logicalOr(other: Tensor): Tensor
  logicalAnd(other: Tensor): Tensor
  mod(other: Tensor): Tensor
  bitwiseAnd(other: Tensor): Tensor
  bitwiseOr(other: Tensor): Tensor
  bitwiseXor(other: Tensor): Tensor
  lShift(other: Tensor): Tensor
  rShift(other: Tensor): Tensor
  minimum(other: Tensor): Tensor
  maximum(other: Tensor): Tensor
  power(other: Tensor): Tensor
  matmul(other: Tensor): Tensor
  mm(other: Tensor): Tensor
  conv2d(
    weights: Tensor,
    sx?: number,
    sy?: number,
    px?: number,
    py?: number,
    dx?: number,
    dy?: number,
    groups?: number
  ): Tensor
  amin(axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor
  amax(axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor
  argmin(axis: number, keep_dims?: boolean): Tensor
  argmax(axis: number, keep_dims?: boolean): Tensor
  sum(axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor
  cumsum(axis: number): Tensor
  mean(axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor
  median(axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor
  _var(axes?: BigInt64Array | number[], bias?: boolean, keep_dims?: boolean): Tensor
  variance(axes?: BigInt64Array | number[], bias?: boolean, keep_dims?: boolean): Tensor
  std(axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor
  norm(axes?: BigInt64Array | number[], p?: number, keep_dims?: boolean): Tensor
  normalize(axes?: BigInt64Array | number[], p?: number, keep_dims?: boolean): Tensor
  countNonzero(axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor
  any(axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor
  all(axes?: BigInt64Array | number[], keep_dims?: boolean): Tensor
}
export { TensorOpsInterface }
