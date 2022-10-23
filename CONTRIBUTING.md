# Formatting

Typescript and Javascript files are formatted using Prettier/ESLint; please use black for Python files

```
bun format
black $(find . -name "*.py")
```

When working on the generated code and executing `bash scripts/gen_all_binding.sh`, the script internally calls the above as well as `clang-format` (>=v14.0.0) for C++ files

```
clang-format -i shumai/cpp/binding_gen.inl shumai/cpp/flashlight_binding.cc
```
