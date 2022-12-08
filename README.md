<img width="1276" alt="Shumai" src="https://user-images.githubusercontent.com/4842908/204894855-a1e697af-ea42-4f1f-9c2e-07a5da26f582.png">

---

A [fast](#benchmarks), [network-connected](https://facebookresearch.github.io/shumai/modules/network.html), differentiable tensor library for TypeScript (and JavaScript).  Built with [bun](https://bun.sh) + [flashlight](https://github.com/flashlight/flashlight) for software engineers and researchers alike.

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
- [Build from source](#building-native-libraries-from-source)
- [Benchmarks](#benchmarks)
- [Contributing](#contributing)

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



## Why build this?

With Shumai, we hope to make 

- **Creating datasets easier**
  - JavaScript, with native typed arrays and a JIT compiler, is perfect for twiddling with data before it can be made into big, flat GPU-compatible arrays.
- **Training small models faster**
  - FFI bindings in Bun are crazy fast (~3ns), so JS gets out of the way when training small models
- **Advanced/fine-grained training/inference logic more expressive**
  - Bun uses the JSC JIT compiler, meaning you can confidently write complex training logic without needing a native C++ implementation
- **Building applications enoyable**
  - JavaScript has a ~~large~~ [HUGE](https://survey.stackoverflow.co/2022/#section-most-popular-technologies-programming-scripting-and-markup-languages) ecosystem, which facilitates better application development
  
  
## Benchmarks

Benchmark data is collected from https://github.com/shumai-org/benchmarks

On an Apple M1 Pro:

| Benchmark     | Shumai (bun)  | TF.js (node)  | Difference |
| ------------- |---------------| --------------| -----------|
| 32-wide addition | 624.78K iter/s | 195.627K iter/s | 3.19x |
| 1024-wide addition | 460.008K iter/s | 94.945K iter/s | 4.84x |
| 32768-wide addition | 57.929K iter/s | 40.484K iter/s | 1.43x |
| 64-wide square matmul | 43 GFlop/s | 28.533 GFlop/s | 1.51x |
| 128-wide square matmul | 518.704 GFlop/s | 58.764 GFlop/s | 8.83x |
| 1024-wide square matmul | 2,147.771 GFlop/s | 318.826 GFlop/s | 6.74x |
| B=64, 64-wide hidden layer + 5x pointwise |41.344K iter/s| 16.679K iter/s | 2.48x|
| B=64, 128-wide hidden layer + 5x pointwise |24.554K iter/s| 8.563K iter/s | 2.87x|
| B=64, 1024-wide hidden layer + 5x pointwise |2.716K iter/s| 0.969K iter/s | 2.80x|

On an Nvidia GP100:

| Benchmark     | Shumai (bun)  | TF.js (node)  | Difference |
| ------------- |---------------| --------------| -----------|
| 32-wide addition | 243.217K iter/s | 34.539K iter/s | 7.04x |
| 1024-wide addition | 144.771K iter/s | 18.006K iter/s | 8.04x |
| 32768-wide addition | 71.793K iter/s | 17.071K iter/s | 4.21x |
| 64-wide square matmul | 63.239 GFlop/s | 12.749 GFlop/s | 4.96x |
| 128-wide square matmul | 435.565 GFlop/s | 104.885 GFlop/s | 4.15x |
| 1024-wide square matmul | 7,165.062 GFlop/s | 6,470.793 GFlop/s | 1.11x |
| B=64, 64-wide hidden layer + 5x pointwise |25.507K iter/s| 5.192K iter/s | 4.91x|
| B=64, 128-wide hidden layer + 5x pointwise |22.529K iter/s| 4.861K iter/s | 4.63x|
| B=64, 1024-wide hidden layer + 5x pointwise |11.568K iter/s| 2.854K iter/s | 4.05x|


## Memory Usage

While the out of the box memory management may suffice in many cases, tuning memory
usage can greatly improve performance by reducing unnecessary overhead from the
Garbage Collector.

```
import { util } from '@shumai/shumai'

util.memoryOptions({
  lowerBoundThreshold: 100e6, // 100MB
  upperBoundThreshold: 5e9, // 5GB
  delayBetweenGCs: 1000 // 1s
})
```

Pay special attention to `upperBoundThreshold` which if exceeded will force GC
for every allocated tensor, ignoring `delayBetweenGCs`. Supplying a value that
will fully utilize your hardware can greatly improve performance.


## Statistics

```mermaid
graph TD
  OpA(Op A) --> statsA{{"stats A"}};
  OpB(Op B) --> statsA;
  statsA --> LoggerA{{"LoggerConsole A"}};
  LoggerA --> Stdout(("Stdout"));
  OpC(Op C) --> statsA;
  OpD(Op D) --> statsA;
  statsA --> LoggerB("LoggerCustom B");
  LoggerB --> Disk(("Disk"));
```

Basic usage of gathering statistics is as simple adding
a collector using the default `StatsLoggerConsole`.

```
import { stats, StatsLoggerConsole, rand, matmul } from '@shumai/shumai'

stats.enabled = true // all ops following will capture stats

// perform ops...

stats.enabled = false // all ops following will no longer capture stats
```

While the above examples may suffice for simple use cases, if you're
looking to capture stats across multiple threads, processes, and/or hosts,
`StatsLoggerHttp` has you covered.

```mermaid
graph TD
  subgraph Host C
    Processor("LoggerHttp Processor")
    style Processor stroke:#222,stroke-width:4px,stroke-dasharray:5 5
  end
  subgraph Host A
    OpA(Op A) --> statsA{{"stats A"}};
    OpB(Op B) --> statsA;
    statsA --> LoggerA{{"LoggerHttp A"}};
    LoggerA --> Processor;
  end
  subgraph Host B
    OpC(Op C) --> statsB{{"stats B"}};
    OpD(Op D) --> statsB;
    statsB --> LoggerB{{"LoggerHttp B"}};
    LoggerB --> Processor;
  end
```

```
import { StatsLoggerHttp } from '@shumai/shumai'

stats.logger = new StatsLoggerHttp({ url: 'http://localhost:4242' })
```

For more custom needs you can supply your own logger:

```
import { StatsLogger, StatsLoggerData } from '@shumai/shumai'

class CustomLogger implements StatsLogger {
  async process(data: StatsLoggerData): Promise<void> {
    const summary = data.collector.getSummary()
    console.log('Collector stats:', summary)
  }
}

stats.logger = new CustomLogger()
```

By default stack tracing is disabled as it adds 50%+ overhead, but can be enabled via `stats.collectStacks = true`.

### Scoped Statistics

If you wish to isolate stats profiling you can do this as well:

```
import { collectStats } from '@shumai/shumai'

const scopedStats = collectStats(() => {
  // perform ops...
}/*, StatsCollectorOptions | StatsLogger */)
console.log(scopedStats.getSummary())
```


## Contributing

If you'd like to make changes to the core bindings or ffi, first [build from source](#installing-from-source).

All files ending in `*.inl` or `*_gen.ts` are generated.
These can be modified by editing [`scripts/gen_binding.py`](https://github.com/facebookresearch/shumai/blob/main/scripts/gen_binding.py)
and running [`./scripts/gen_all_binding.sh`](https://github.com/facebookresearch/shumai/blob/main/scripts/gen_all_binding.sh).

See the [CONTRIBUTING](CONTRIBUTING.md) file for style guidance and more info on how to help out. 😁

### License

shumai is MIT licensed, as found in the LICENSE file.



