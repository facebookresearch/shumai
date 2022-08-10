### shumai: fast ML in JS with bun + flashlight

---

But, why?

- **Creating new datasets**
  - JavaScript, with native typed arrays and a JIT compiler, is perfect for twiddling with data before it can be made into a big flat GPU-compatible array
- **Small models**
  - FFI bindings in Bun are crazy fast (~3ns), so JS gets out of the way when training small models
- **Advanced/fine-grained training/inference logic**
  - Bun uses the JSC JIT compiler, meaning you can confidently write complex training logic without needing a native C++ implementation
- **Applications**
  - JavaScript has a ~~large~~ HUGE ecosystem, which makes application development a lot easier

## MacOS Install

Ensure you have bun installed (https://bun.sh), and then use `brew` and `npm` to get everything built.

```bash
brew tap bwasti/flashlight
brew install --build-from-source flashlight
npm install shumaiml
```

## Install from source

The following are required:
- A compiler with good C++17 support (eg. gcc >= 7)
- CMake >= 3.10

### MacOS from source

Install flashlight
```bash
mkdir -p $HOME/usr/ # installing flashlight here
brew install arrayfire
git clone --recursive --depth 1 https://github.com/bwasti/flashlight.git
cd flashlight
mkdir -p build
cd build
cmake .. -DFL_ARRAYFIRE_USE_CPU=ON -DFL_BUILD_DISTRIBUTED=OFF -DFL_USE_ONEDNN=OFF -DFL_BUILD_TESTS=OFF -DFL_BUILD_EXAMPLES=OFF -DFL_BUILD_SCRIPTS=OFF -DCMAKE_INSTALL_PREFIX=$HOME/usr/
make -j$(nproc)
make install
```

Build bindings for shumai
```bash
cd shumai
mkdir -p build
cd build
cmake .. -Dflashlight_DIR=$HOME/usr/share/flashlight/cmake/
make -j$(nproc)
```

(you can record perf stuff with `xcrun xctrace record --template "Time Profiler" --launch $(which bun) train.js`)

### Automated Setup

`setup.sh` is a FAIR Cluster-specific script that sets up dependencies given some specified `FLASHLIGHT_INSTALL_PREFIX`. [ArrayFire](https://github.com/arrayfire/arrayfire) CUDA is assumed to be installed specify its location with `ARRAYFIRE_INSTALL_PREFIX`. Modify those variables before running.

### Environment Setup

To ensure bun can properly `dlopen` the bindings lib and dependent libs, export an `LD_LIBRARY_PATH` that includes the following:
```shell
export LD_LIBRARY_PATH="${LD_LIBRARY_PATH}:${ARRAYFIRE_INSTALL_PREFIX}/lib:${FLASHLIGHT_INSTALL_PREFIX}/lib:$(pwd)"
```

### Generating Binding Code

To generate TypeScript and C++ binding code, run `gen_all_binding.sh`. This will populate TypeScript and inline C++ files with bindings code based on the operator schema found in `gen_binding.py`. For bindings to be up to date, C++ shims must be rebuilt: see the below section.

### Compiling C++ Shims

#### With CMake

To build the C++ shims from scratch given an existing Flashlight and ArrayFire installation, run:
```shell
mkdir -p build && cd build
cmake .. \
    -DBUILD_SHARED_LIBS=ON \
    -DCMAKE_BUILD_TYPE=RelWithDebInfo \ # or as specified
    -Dflashlight_DIR=${FLASHLIGHT_INSTALL_PREFIX}/share/flashlight/cmake \
    -DArrayFire_DIR=${ARRAYFIRE_INSTALL_PREFIX}/share/ArrayFire/cmake
make -j$(nproc)
```

To recompile C++ shims simply run `make -j$(nproc)` from your build directory. `libflashlight_bindings` will be placed in the project root.

#### With Make

See `Makefile`.

## Supported operations

Some operations are supported as both static functions and methods on existing tensors.

Operation | Function | Tensor Method (`t : Tensor`)
---|---|---
rand | `rand(shape: number[]) : Tensor` |
randn | `randn(shape: number[]) : Tensor` |
full | `full(shape: number[], val: number) : Tensor` |
identity | `identity(dim: number) : Tensor` |
arange | `arange(start: number, end: number, step: number = 1) : Tensor` |
iota | `iota(dims: number[], tileDims: number[] = [1]) : Tensor` |
reshape | `reshape(tensor: Tensor, shape: number[]) : Tensor` |`t.reshape(shape: number[]) : Tensor`
transpose | `transpose(tensor: Tensor, axes: number[]) : Tensor` |`t.transpose(axes: number[]) : Tensor`
tile | `tile(tensor: Tensor, shape: number[]) : Tensor` |`t.tile(shape: number[]) : Tensor`
nonzero | `nonzero(tensor: Tensor) : Tensor` |`t.nonzero() : Tensor`
negative | `negative(tensor: Tensor) : Tensor` |`t.negative() : Tensor`
logicalNot | `logicalNot(tensor: Tensor) : Tensor` |`t.logicalNot() : Tensor`
exp | `exp(tensor: Tensor) : Tensor` |`t.exp() : Tensor`
log | `log(tensor: Tensor) : Tensor` |`t.log() : Tensor`
log1p | `log1p(tensor: Tensor) : Tensor` |`t.log1p() : Tensor`
sin | `sin(tensor: Tensor) : Tensor` |`t.sin() : Tensor`
cos | `cos(tensor: Tensor) : Tensor` |`t.cos() : Tensor`
sqrt | `sqrt(tensor: Tensor) : Tensor` |`t.sqrt() : Tensor`
tanh | `tanh(tensor: Tensor) : Tensor` |`t.tanh() : Tensor`
floor | `floor(tensor: Tensor) : Tensor` |`t.floor() : Tensor`
ceil | `ceil(tensor: Tensor) : Tensor` |`t.ceil() : Tensor`
rint | `rint(tensor: Tensor) : Tensor` |`t.rint() : Tensor`
absolute | `absolute(tensor: Tensor) : Tensor` |`t.absolute() : Tensor`
abs | `abs(tensor: Tensor) : Tensor` |`t.abs() : Tensor`
sigmoid | `sigmoid(tensor: Tensor) : Tensor` |`t.sigmoid() : Tensor`
erf | `erf(tensor: Tensor) : Tensor` |`t.erf() : Tensor`
flip | `flip(tensor: Tensor, dim: number) : Tensor` |`t.flip(dim: number) : Tensor`
clip | `clip(tensor: Tensor, low: Tensor, high: Tensor) : Tensor` |`t.clip(low: Tensor, high: Tensor) : Tensor`
roll | `roll(tensor: Tensor, shift: number, axis: number) : Tensor` |`t.roll(shift: number, axis: number) : Tensor`
isnan | `isnan(tensor: Tensor) : Tensor` |`t.isnan() : Tensor`
isinf | `isinf(tensor: Tensor) : Tensor` |`t.isinf() : Tensor`
sign | `sign(tensor: Tensor) : Tensor` |`t.sign() : Tensor`
tril | `tril(tensor: Tensor) : Tensor` |`t.tril() : Tensor`
triu | `triu(tensor: Tensor) : Tensor` |`t.triu() : Tensor`
where | `where(cond: Tensor, x: Tensor, y: Tensor) : Tensor` |`t.where(x: Tensor, y: Tensor) : Tensor`
sort | `sort(tensor: Tensor, dim: number) : Tensor` |`t.sort(dim: number) : Tensor`
add | `add(tensor: Tensor, other: Tensor) : Tensor` |`t.add(other: Tensor) : Tensor`
sub | `sub(tensor: Tensor, other: Tensor) : Tensor` |`t.sub(other: Tensor) : Tensor`
mul | `mul(tensor: Tensor, other: Tensor) : Tensor` |`t.mul(other: Tensor) : Tensor`
div | `div(tensor: Tensor, other: Tensor) : Tensor` |`t.div(other: Tensor) : Tensor`
eq | `eq(tensor: Tensor, other: Tensor) : Tensor` |`t.eq(other: Tensor) : Tensor`
neq | `neq(tensor: Tensor, other: Tensor) : Tensor` |`t.neq(other: Tensor) : Tensor`
lessThan | `lessThan(tensor: Tensor, other: Tensor) : Tensor` |`t.lessThan(other: Tensor) : Tensor`
lessThanEqual | `lessThanEqual(tensor: Tensor, other: Tensor) : Tensor` |`t.lessThanEqual(other: Tensor) : Tensor`
greaterThan | `greaterThan(tensor: Tensor, other: Tensor) : Tensor` |`t.greaterThan(other: Tensor) : Tensor`
greaterThanEqual | `greaterThanEqual(tensor: Tensor, other: Tensor) : Tensor` |`t.greaterThanEqual(other: Tensor) : Tensor`
logicalOr | `logicalOr(tensor: Tensor, other: Tensor) : Tensor` |`t.logicalOr(other: Tensor) : Tensor`
logicalAnd | `logicalAnd(tensor: Tensor, other: Tensor) : Tensor` |`t.logicalAnd(other: Tensor) : Tensor`
mod | `mod(tensor: Tensor, other: Tensor) : Tensor` |`t.mod(other: Tensor) : Tensor`
bitwiseAnd | `bitwiseAnd(tensor: Tensor, other: Tensor) : Tensor` |`t.bitwiseAnd(other: Tensor) : Tensor`
bitwiseOr | `bitwiseOr(tensor: Tensor, other: Tensor) : Tensor` |`t.bitwiseOr(other: Tensor) : Tensor`
bitwiseXor | `bitwiseXor(tensor: Tensor, other: Tensor) : Tensor` |`t.bitwiseXor(other: Tensor) : Tensor`
lShift | `lShift(tensor: Tensor, other: Tensor) : Tensor` |`t.lShift(other: Tensor) : Tensor`
rShift | `rShift(tensor: Tensor, other: Tensor) : Tensor` |`t.rShift(other: Tensor) : Tensor`
minimum | `minimum(tensor: Tensor, other: Tensor) : Tensor` |`t.minimum(other: Tensor) : Tensor`
maximum | `maximum(tensor: Tensor, other: Tensor) : Tensor` |`t.maximum(other: Tensor) : Tensor`
power | `power(tensor: Tensor, other: Tensor) : Tensor` |`t.power(other: Tensor) : Tensor`
matmul | `matmul(tensor: Tensor, other: Tensor) : Tensor` |`t.matmul(other: Tensor) : Tensor`
amin | `amin(tensor: Tensor, axes: number[] = [], keep_dims: boolean = false) : Tensor` |`t.amin(axes: number[] = [], keep_dims: boolean = false) : Tensor`
amax | `amax(tensor: Tensor, axes: number[] = [], keep_dims: boolean = false) : Tensor` |`t.amax(axes: number[] = [], keep_dims: boolean = false) : Tensor`
argmin | `argmin(tensor: Tensor, axis: number, keep_dims: boolean = false) : Tensor` |`t.argmin(axis: number, keep_dims: boolean = false) : Tensor`
argmax | `argmax(tensor: Tensor, axis: number, keep_dims: boolean = false) : Tensor` |`t.argmax(axis: number, keep_dims: boolean = false) : Tensor`
sum | `sum(tensor: Tensor, axes: number[] = [], keep_dims: boolean = false) : Tensor` |`t.sum(axes: number[] = [], keep_dims: boolean = false) : Tensor`
cumsum | `cumsum(tensor: Tensor, axis: number) : Tensor` |`t.cumsum(axis: number) : Tensor`
mean | `mean(tensor: Tensor, axes: number[] = [], keep_dims: boolean = false) : Tensor` |`t.mean(axes: number[] = [], keep_dims: boolean = false) : Tensor`
median | `median(tensor: Tensor, axes: number[] = [], keep_dims: boolean = false) : Tensor` |`t.median(axes: number[] = [], keep_dims: boolean = false) : Tensor`
var | `var(tensor: Tensor, axes: number[] = [], bias: boolean = false, keep_dims: boolean = false) : Tensor` |`t.var(axes: number[] = [], bias: boolean = false, keep_dims: boolean = false) : Tensor`
std | `std(tensor: Tensor, axes: number[] = [], keep_dims: boolean = false) : Tensor` |`t.std(axes: number[] = [], keep_dims: boolean = false) : Tensor`
norm | `norm(tensor: Tensor, axes: number[] = [], p: number = 2, keep_dims: boolean = false) : Tensor` |`t.norm(axes: number[] = [], p: number = 2, keep_dims: boolean = false) : Tensor`
countNonzero | `countNonzero(tensor: Tensor, axes: number[] = [], keep_dims: boolean = false) : Tensor` |`t.countNonzero(axes: number[] = [], keep_dims: boolean = false) : Tensor`
any | `any(tensor: Tensor, axes: number[] = [], keep_dims: boolean = false) : Tensor` |`t.any(axes: number[] = [], keep_dims: boolean = false) : Tensor`
all | `all(tensor: Tensor, axes: number[] = [], keep_dims: boolean = false) : Tensor` |`t.all(axes: number[] = [], keep_dims: boolean = false) : Tensor`

### Contributing

See the [CONTRIBUTING](CONTRIBUTING.md) file for how to help out.

### License

shumai is MIT licensed, as found in the LICENSE file.


