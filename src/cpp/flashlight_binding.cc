#include "flashlight/fl/autograd/Functions.h"
#include "flashlight/fl/nn/Init.h"
#include "flashlight/fl/runtime/Device.h"
#include "flashlight/fl/runtime/Stream.h"
#include "flashlight/fl/tensor/Compute.h"
#include "flashlight/fl/tensor/Index.h"
#include "flashlight/fl/tensor/Init.h"
#include "flashlight/fl/tensor/Random.h"
#include <atomic>
#include <cstdlib>
#include <iostream>

template <typename T>
std::vector<T> arrayArg(void *ptr, int len, bool reverse, int invert) {
  std::vector<T> out;
  out.reserve(len);
  for (auto i = 0; i < len; ++i) {
    const auto idx = reverse ? len - i - 1 : i;
    auto v = reinterpret_cast<T *>(ptr)[idx];
    if (invert && v < 0) {
      v = -v - 1;
    } else if (invert) {
      v = invert - v - 1;
    }
    out.emplace_back(v);
  }
  return out;
}

static std::atomic<size_t> g_bytes_used = 0;
static std::atomic<bool> g_row_major = true;

extern "C" {

void init() { fl::init(); }

size_t bytesUsed() { return g_bytes_used; }

void *createTensor(void *shape_ptr, int shape_len) {
  static_assert(sizeof(long long) == sizeof(int64_t));
  auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
  auto *t = new fl::Tensor(fl::Shape(shape));
  g_bytes_used += t->bytes();
  return t;
}

void *tensorFromBuffer(int numel, void *ptr) {
  auto *t = new fl::Tensor(
      fl::Tensor::fromBuffer({numel}, (float *)ptr, fl::MemoryLocation::Host));
  g_bytes_used += t->bytes();
  return t;
}

void destroyTensor(void *t, void * /*ignore*/) {
  auto *tensor = reinterpret_cast<fl::Tensor *>(t);
  g_bytes_used -= tensor->bytes();
  delete tensor;
}

typedef void (*JSTypedArrayBytesDeallocator)(void *bytes,
                                             void *deallocatorContext);

JSTypedArrayBytesDeallocator genTensorDestroyer() { return destroyTensor; }

void setRowMajor() { g_row_major = true; }

void setColMajor() { g_row_major = false; }

bool isRowMajor() { return g_row_major; }

bool isColMajor() { return !g_row_major; }

void eval(void *t) {
  auto *tensor = reinterpret_cast<fl::Tensor *>(t);
  fl::eval(*tensor);
}

size_t elements(void *t) {
  auto *tensor = reinterpret_cast<fl::Tensor *>(t);
  return tensor->elements();
}

int shape(void *t, void *out, int out_len) {
  auto *tensor = reinterpret_cast<fl::Tensor *>(t);
  if (out_len != tensor->ndim()) {
    return -1;
  }
  for (auto i = 0; i < out_len; ++i) {
    const auto idx = g_row_major ? out_len - i - 1 : i;
    reinterpret_cast<int64_t *>(out)[i] = tensor->shape()[idx];
  }
  return 0;
}

int ndim(void *t) {
  auto *tensor = reinterpret_cast<fl::Tensor *>(t);
  return tensor->ndim();
}

float *buffer(void *t) {
  auto *tensor = reinterpret_cast<fl::Tensor *>(t);
  return tensor->host<float>();
}

float scalar(void *t) {
  auto *tensor = reinterpret_cast<fl::Tensor *>(t);
  return tensor->scalar<float>();
}

void *flatten(void *t) {
  auto *tensor = reinterpret_cast<fl::Tensor *>(t);
  auto *new_tensor = new fl::Tensor(tensor->flatten());
  g_bytes_used += new_tensor->bytes();
  return new_tensor;
}

void *asContiguousTensor(void *t) {
  auto *tensor = reinterpret_cast<fl::Tensor *>(t);
  auto *new_tensor = new fl::Tensor(tensor->asContiguousTensor());
  g_bytes_used += new_tensor->bytes();
  return new_tensor;
}

void *copy(void *t) {
  auto *tensor = reinterpret_cast<fl::Tensor *>(t);
  auto *new_tensor = new fl::Tensor(tensor->copy());
  g_bytes_used += new_tensor->bytes();
  return new_tensor;
}

#include "binding_gen.inl"
};
