#!/bin/bash

# generate dataset
FILE="input.txt"
if [ ! -f "$FILE" ]; then
  echo "$FILE does not exist, generating..."
  python3 -c 'import random; print("\n".join(f"{random.random()},{random.random()},{random.random()}" for i in range(1000000)))' > $FILE
fi

echo "running file read benchmark:"
echo -n "  Python version "
python3 file.py
echo -n "  JavaScript version "
bun file.ts
echo "running numeric benchmark:"
echo -n "  Python version "
python3 number.py
echo -n "  JavaScript version "
bun number.ts
echo "running recursive function overhead benchmark:"
echo -n "  Python version "
python3 fib.py
echo -n "  JavaScript version "
bun fib.ts
echo "running FFI overhead benchmark (marshall int32):"
if [ ! -d "nanobind" ]; then
  echo "nanobind not found, downloading..."
  git clone --recursive https://github.com/wjakob/nanobind.git
fi
mkdir -p build &> /dev/null
cmake . -Bbuild &> /dev/null
make -C build &> /dev/null
echo -n "  Python version "
python3 ffi.py
echo -n "  JavaScript version "
bun ffi.ts
echo "running FFI overhead benchmark (no_op):"
echo -n "  Python version "
python3 ffi.py noop
echo -n "  JavaScript version "
bun ffi.ts noop
echo "running FFI overhead benchmark (no_op wrapped in lambda):"
echo -n "  Python version "
python3 ffi.py wrapped_noop
echo -n "  JavaScript version "
bun ffi.ts wrapped_noop
