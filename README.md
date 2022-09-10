
<p align="center">
<img width="375" alt="shumai_logo_light" src="https://user-images.githubusercontent.com/4842908/187270063-250a42b0-475e-4eb2-bc1e-2b6a54182577.png#gh-light-mode-only">
<img width="375" alt="shumai_logo_dark" src="https://user-images.githubusercontent.com/4842908/187270061-99666d73-047c-4076-906c-f181c940244c.png#gh-dark-mode-only">

</p>

A fast differentiable tensor library for research in TypeScript and JavaScript.  Built with [bun](https://bun.sh) + [flashlight](https://github.com/flashlight/flashlight).
⚠️ *This is experimental software!* ⚠️

[![build](https://github.com/facebookresearch/shumai/actions/workflows/build.yml/badge.svg)](https://github.com/facebookresearch/shumai/actions/workflows/build.yml)
[![tests](https://circleci.com/gh/facebookresearch/shumai.svg?style=shield)](https://app.circleci.com/pipelines/github/facebookresearch/shumai)
[![npm](https://img.shields.io/npm/v/@shumai/shumai/latest)](https://www.npmjs.com/settings/shumai/packages)
[![Discord](https://img.shields.io/discord/1013580889940295730)](https://discord.com/channels/1013580889940295730/)
[![GitHub](https://img.shields.io/github/license/facebookresearch/shumai)](https://github.com/facebookresearch/shumai/blob/main/LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/facebookresearch/shumai)](https://github.com/facebookresearch/shumai/graphs/contributors)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/facebookresearch/shumai)
---


- [Usage](#usage)
- [Install](#install)
- [Build from source](#installing-local-build-from-source)
- [Contributing](#contributing)
- [Supported operations](#supported-operations)

## Quickstart
Install [Bun](https://bun.sh/) and [ArrayFire](https://github.com/arrayfire/arrayfire/wiki/Getting-ArrayFire), then run:
```
bun install @shumai/shumai
```
Only macOS and Linux are supported. Linux installs default to GPU computation with CUDA, and macOS to CPU. Detailed install instructions [below](#install).

*Install is work in progress*: [**please file an issue**](https://github.com/facebookresearch/shumai/issues) if you run into problems.

## Why build this?

With Shumai, we hope to make 

- **Creating datasets**
  - JavaScript, with native typed arrays and a JIT compiler, is perfect for twiddling with data before it can be made into big, flat GPU-compatible arrays.
- **Training small models**
  - FFI bindings in Bun are crazy fast (~3ns), so JS gets out of the way when training small models
- **Advanced/fine-grained training/inference logic**
  - Bun uses the JSC JIT compiler, meaning you can confidently write complex training logic without needing a native C++ implementation
- **Building applications**
  - JavaScript has a ~~large~~ [HUGE](https://survey.stackoverflow.co/2022/#section-most-popular-technologies-programming-scripting-and-markup-languages) ecosystem, which facilitates better application development

## Usage

shumai will always attempt to use an attached GPU or accelerator; although CPU computation will use the ArrayFire CPU backend, which is not well-optimized.

We hope to support the ArrayFire OpenCL backend and other non-ArrayFire tensor backends soon.

If shumai seems unusually slow, please file an issue!

**Standard array utilities:**


```javascript
import * as sm from "@shumai/shumai"

// create a 1024 by 1024 tensor, randomly filled with normal distribution
let X = sm.randn([1024, 1024])
let W = sm.identity(1024)
let Y = X.matmul(W)
console.log(Y.shape)
```

**Conversion to and from JavaScript native arrays:**

```javascript
const data : Float32Array = new Float32Array(128)
for (let i = 0; i < 128; ++i) {
  data = Math.random()
}

const X : Tensor = sm.tensor(data)
const pi = sm.scalar(3.14)
const Y = X.mul(pi)

// tensors can be converted back to native JavaScript
const Y_data = Y.toFloat32Array()

// scalar tensors can be converted to JavaScript numbers
const total : number = X.sum().toFloat32()
```

**Gradients:**

```javascript
const W = sm.randn([128, 128])
W.requires_grad = true

const X = sm.randn([128, 128])
const diff = X.sub(W)
const mse = diff.mul(diff).sum()
mse.backward()

W.grad // this gradient is now populated

// copy W without allowing gradient updates
const Y = W.detach()
Y.sum().backward() // nothing changes

```

Some more examples can be found [here](https://github.com/facebookresearch/shumai/tree/main/examples).

Supported operators can be found [here](#supported-operations).

## Install

**The install procedure is a work in progress!**
If you have any problems building or installing, we would
greatly appreciate filed issues. Please tell us about your platform/OS when you do.

**Prerequisites**:
- Ensure you have bun installed (https://bun.sh).
- Install [ArrayFire](https://github.com/arrayfire/arrayfire). *macOS users should install ArrayFire's CPU backend; Linux users should install the CUDA backend^.*
  - **macOS** --- ArrayFire can easily be installed with Homebrew:
  ```
  brew install arrayfire
  ```
- **Linux** --- instructions [can be found here](https://github.com/arrayfire/arrayfire/wiki/Getting-ArrayFire). On Ubuntu, ArrayFire can be installed via [package managers (e.g. `apt`)](https://github.com/arrayfire/arrayfire/wiki/Install-ArrayFire-From-Linux-Package-Managers).

Once `bun` and `ArrayFire` are installed, install the package and backing libs with `bun`:
```shell
bun install @shumai/shumai
```

^**Linux users can use the CPU backend** by swapping the required `package.json` dependency from `@shumai/linux_x64_shumai_flashlight` to `@shumai/linux_x64_shumai_flashlight_cpu`, i.e. running:
```shell
sed -i "s/linux_x64_shumai_flashlight/linux_x64_shumai_flashlight_cpu/g" package.json
```

## Building Native Libraries from Source

**Note:** *not required when developing TypeScript/Javascript library components locally.*

From source build instructions for:
- [macOS](#building-on-macos-from-source)
- [Linux](#building-on-linux-from-source)

This process will build the dependent ffi libraries (`libflashlight` and `libflashlight_binding`) and pack them using `npm pack` to generate a `@shumai/shumai_*.tgz`
package. You can then use `npm install $PATH_TO_SOURCE/@shumai/shumai-*.tgz` to install the package where you'd like.

### Building on macOS from Source

First, install ArrayFire CPU with `brew install arrayfire`.

Build and install [Flashlight](https://github.com/flashlight/flashlight#building-and-installing):
```bash
mkdir -p $HOME/usr/ # installing flashlight here
git clone --recursive --depth 1 https://github.com/flashlight/flashlight.git
cd flashlight
mkdir -p build
cd build
cmake .. \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo \ # or as specified
  -DFL_ARRAYFIRE_USE_CPU=ON \
  -DFL_ARRAYFIRE_USE_CUDA=OFF \
  -DFL_BUILD_DISTRIBUTED=OFF \
  -DFL_USE_ONEDNN=OFF \
  -DFL_BUILD_TESTS=OFF \
  -DFL_BUILD_EXAMPLES=OFF \
  -DFL_BUILD_SCRIPTS=OFF \
  -DCMAKE_INSTALL_PREFIX=$HOME/usr/
make -j$(nproc)
make install
```

Build Flashlight bindings for Shumai:
```bash
cd shumai
mkdir -p build
cd build
cmake .. -Dflashlight_DIR=$HOME/usr/share/flashlight/cmake/
make -j$(nproc)
```

#### Profiling

On macOS, you can record perf with `xcrun xctrace record --template "Time Profiler" --launch $(which bun) train.js`.

### Building on Linux from Source

First [install ArrayFire](https://github.com/arrayfire/arrayfire/wiki/Getting-ArrayFire). The Linux build for shumai uses the CUDA backend, but from source, you can build the CPU backend as well (OpenCL support coming soon).

Build and install [Flashlight](https://github.com/flashlight/flashlight#building-and-installing):
```bash
mkdir -p $HOME/usr/ # installing flashlight here
git clone --recursive --depth 1 https://github.com/flashlight/flashlight.git
cd flashlight
mkdir -p build
cd build
cmake .. \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo \ # or as specified
  -DFL_ARRAYFIRE_USE_CPU=OFF \
  \ # swap with the above to build for CPU
  -DFL_ARRAYFIRE_USE_CUDA=ON \ 
  -DFL_BUILD_DISTRIBUTED=OFF \
  -DFL_USE_ONEDNN=OFF \
  -DFL_BUILD_TESTS=OFF \
  -DFL_BUILD_EXAMPLES=OFF \
  -DFL_BUILD_SCRIPTS=OFF \
  -DCMAKE_INSTALL_PREFIX=$HOME/usr/
make -j$(nproc)
make install
```

Build bindings for shumai:
```bash
mkdir -p build && cd build
cmake .. \
    -DBUILD_SHARED_LIBS=ON \
    -DCMAKE_BUILD_TYPE=RelWithDebInfo \ # or as specified
    -Dflashlight_DIR=${FLASHLIGHT_INSTALL_PREFIX}/share/flashlight/cmake \
    -DArrayFire_DIR=${ARRAYFIRE_INSTALL_PREFIX}/share/ArrayFire/cmake # if built from source, else not needed
make -j$(nproc)
```

## Contributing

If you'd like to make changes to the core bindings or ffi, first [build from source](#installing-from-source).

All files ending in `*.inl` or `*_gen.ts` are generated.
These can be modified by editing [`scripts/gen_binding.py`](https://github.com/facebookresearch/shumai/blob/main/scripts/gen_binding.py)
and running [`./scripts/gen_all_binding.sh`](https://github.com/facebookresearch/shumai/blob/main/scripts/gen_all_binding.sh).

See the [CONTRIBUTING](CONTRIBUTING.md) file for style guidance and more info on how to help out. 😁


## Supported Operations

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


### License

shumai is MIT licensed, as found in the LICENSE file.



