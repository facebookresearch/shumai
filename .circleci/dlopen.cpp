/**
 * Attempt to dlopen a specified file. Implicitly checks recursive runtime
 * linking dependencies.
 */

#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdexcept>

int main(int argc, char** argv) {
  if (argc < 2) {
    throw std::invalid_argument("usage: ./dlopen [lib path]");
  }
  void* handle = dlopen(argv[1], RTLD_NOW);
  if (!handle) {
    fprintf(stderr, "%s\n", dlerror());
    exit(EXIT_FAILURE);
  }

  return 0;
}
