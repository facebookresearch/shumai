#!/bin/bash

python scripts/gen_binding.py ffi > shumai/ffi/ffi_tensor_ops_gen.ts
python scripts/gen_binding.py js > shumai/tensor/tensor_ops_gen.ts
python scripts/gen_binding.py js_methods > shumai/tensor/tensor_ops_shim_gen.ts
python scripts/gen_binding.py js_ops_interface > shumai/tensor/tensor_ops_interface_gen.ts
python scripts/gen_binding.py c > shumai/cpp/binding_gen.inl
echo "beautifying javascript & formatting python"
bun format
clang-format -i shumai/cpp/binding_gen.inl shumai/cpp/flashlight_binding.cc
