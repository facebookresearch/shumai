<p align="center">
<img width="375" alt="shumai_logo_light" src="https://user-images.githubusercontent.com/4842908/187270063-250a42b0-475e-4eb2-bc1e-2b6a54182577.png#gh-light-mode-only">
<img width="375" alt="shumai_logo_dark" src="https://user-images.githubusercontent.com/4842908/187270061-99666d73-047c-4076-906c-f181c940244c.png#gh-dark-mode-only">

</p>

A fast differentiable tensor library for research in TypeScript and JavaScript.  Built with [bun](https://bun.sh) + [flashlight](https://github.com/flashlight/flashlight).

![shumai_big](https://user-images.githubusercontent.com/4842908/190880994-6e59dd90-22ef-4a6a-9129-5be04086b59a.gif)



⚠️ *This is experimental software!* ⚠️

[![docs](https://img.shields.io/badge/docs-available-blue)](https://facebookresearch.github.io/shumai/)
[![build](https://github.com/facebookresearch/shumai/actions/workflows/build.yml/badge.svg)](https://github.com/facebookresearch/shumai/actions/workflows/build.yml)
[![tests](https://circleci.com/gh/facebookresearch/shumai.svg?style=shield)](https://app.circleci.com/pipelines/github/facebookresearch/shumai)
[![npm](https://img.shields.io/npm/v/@shumai/shumai/latest)](https://www.npmjs.com/settings/shumai/packages)
[![Discord](https://img.shields.io/discord/1013580889940295730)](https://discord.com/channels/1013580889940295730/)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/facebookresearch/shumai)
[![GitHub](https://img.shields.io/github/license/facebookresearch/shumai)](https://github.com/facebookresearch/shumai/blob/main/LICENSE)

---


- [Usage](#usage)
- [Install](#install)
- [Build from source](#installing-local-build-from-source)
- [Contributing](#contributing)
- [Supported operations](#supported-operations)

## Quickstart
Install [Bun](https://bun.sh/) and [ArrayFire](https://github.com/arrayfire/arrayfire/wiki/Getting-ArrayFire)

<details><summary><strong>For MacOS users:</strong></summary>
  
You can use [Homebrew](https://brew.sh) to install ArrayFire:
  
```bash
curl https://bun.sh/install | bash
brew install arrayfire
```
  
</details>

<details><summary><strong>For Linux users:</strong></summary>
  
If you're running Ubuntu with **x86-64**, you can use the official distribution:
  
```bash
curl https://bun.sh/install | bash
sudo apt install -y gnupg2 ca-certificates
sudo apt-key adv --fetch-key https://repo.arrayfire.com/GPG-PUB-KEY-ARRAYFIRE-2020.PUB
echo "deb https://repo.arrayfire.com/debian all main" | sudo tee /etc/apt/sources.list.d/arrayfire.list
sudo apt update
sudo apt install -y arrayfire-cpu3-dev arrayfire-cpu3-openblas
```
  
If you're running Ubuntu with **ARMv8**, you'll need to build from source:

```bash
curl https://bun.sh/install | bash
sudo apt remove libarrayfire-dev libarrayfire-cpu3 libarrayfire-cpu-dev
sudo apt install -y libblas-dev liblapack-dev liblapacke-dev libfftw3-dev libboost-all-dev cmake make g++
cd /tmp
sudo rm -rf arrayfire
git clone https://github.com/arrayfire/arrayfire.git
cd arrayfire
cmake -Bbuild -DAF_BUILD_EXAMPLES=OFF -DCMAKE_BUILD_TYPE=Release -DAF_BUILD_UNIFIED=OFF -DAF_TEST_WITH_MTX_FILES=OFF -DBUILD_TESTING=OFF
make -j4 -Cbuild
sudo make install -Cbuild
```
  
Otherwise, see the official [ArrayFire installation guide.](https://github.com/arrayfire/arrayfire/wiki/Getting-ArrayFire)
</details>

then run:
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
  data[i] = Math.random()
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

### Windows Support

While not officially supported, Windows users have been successful leveraging [Docker](https://www.docker.com/) + [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) + Linux. Including CUDA support.


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
  -DCMAKE_BUILD_TYPE=Release \
  -DBUILD_SHARED_LIBS=ON  \
  -DCMAKE_INSTALL_PREFIX=$HOME/usr \
  -DFL_USE_ARRAYFIRE=ON \
  -DFL_ARRAYFIRE_USE_CPU=ON \
  -DFL_USE_ONEDNN=OFF \
  -DFL_BUILD_DISTRIBUTED=OFF \
  -DFL_BUILD_TESTS=OFF \
  -DFL_BUILD_EXAMPLES=OFF
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

### License

shumai is MIT licensed, as found in the LICENSE file.



