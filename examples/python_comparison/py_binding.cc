#include <nanobind/nanobind.h>

void no_op() {
}

int int_mul(int a, int b) {
  return a * b;
}

NB_MODULE(py_binding, m) {
  m.def("int_mul", int_mul);
  m.def("no_op", no_op);
}

