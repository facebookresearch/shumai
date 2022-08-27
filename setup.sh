#!/bin/bash
#
# Build and install Flashlight and build and install Shumai
# bindings. Builds expects the ArrayFire CPU or CUDA backends
# to be installed. Change install and library paths accordingly.
#

SHUMAI_DIR=$(cd $(dirname $0) && pwd)

# Config
ARRAYFIRE_INSTALL_PREFIX=
FLASHLIGHT_INSTALL_PREFIX=
USE_CUDA=OFF # must be ON or OFF
USE_CPU=ON # must be ON or OFF

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
