#!/bin/bash

python scripts/gen_binding.py ffi > src/ffi/ffi_tensor_ops_gen.ts
python scripts/gen_binding.py js > src/tensor/tensor_ops_gen.ts
python scripts/gen_binding.py js_methods > src/tensor/tensor_ops_shim_gen.ts
python scripts/gen_binding.py js_ops_interface > src/tensor/tensor_ops_interface_gen.ts
python scripts/gen_binding.py c > src/cpp/binding_gen.inl
echo "beautifying javascript & formatting python"
bun format
