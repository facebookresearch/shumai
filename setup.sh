#!/bin/bash

SHUMAI_DIR=$(cd $(dirname $0) && pwd)

# Config
ARRAYFIRE_INSTALL_PREFIX=/checkpoint/jacobkahn/usr/
FLASHLIGHT_INSTALL_PREFIX=$HOME/usr

# FAIR Cluster modules
module purge
module load cuda/11.4
module load cudnn/v8.4.1.50-cuda.11.6 # works with 11.4
module load NCCL/2.11.4-4-cuda.11.4
module load intel/mkl/2020.3.279

set -x

# Create build directory
cd ${SHUMAI_DIR} && mkdir -p build && cd build

# Clone and build FL
mkdir -p third_party && cd third_party
git clone https://github.com/flashlight/flashlight
cd flashlight && mkdir -p build && cd build
cmake .. \
      -DFL_USE_ARRAYFIRE=ON \
      -DFL_ARRAYFIRE_USE_CUDA=ON \
      -DFL_USE_ONEDNN=OFF \
      -DFL_BUILD_TESTS=OFF \
      -DFL_BUILD_EXAMPLES=OFF \
      -DBUILD_SHARED_LIBS=ON \
      -DCMAKE_BUILD_TYPE=RelWithDebInfo \
      -DCMAKE_INSTALL_PREFIX=${FLASHLIGHT_INSTALL_PREFIX} \
      -DArrayFire_DIR=${ARRAYFIRE_INSTALL_PREFIX}/share/ArrayFire/cmake
make -j80 && make install -j80
      
# Build bindings shim
cd ${SHUMAI_DIR} && mkdir -p build && cd build
cmake .. \
      -Dflashlight_DIR=$HOME/usr/share/flashlight/cmake \
      -DArrayFire_DIR=${ARRAYFIRE_INSTALL_PREFIX}/share/ArrayFire/cmake \
      -DBUILD_SHARED_LIBS=ON \
      -DCMAKE_BUILD_TYPE=RelWithDebInfo
make -j80

unset SHUMAI_DIR
unset ARRAYFIRE_INSTALL_PREFIX
unset FLASHLIGHT_INSTALL_PREFIX
