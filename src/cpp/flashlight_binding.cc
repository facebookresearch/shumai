#include "flashlight/fl/nn/Init.h"
#include "flashlight/fl/runtime/Device.h"
#include "flashlight/fl/runtime/Stream.h"
#include "flashlight/fl/tensor/Compute.h"
#include "flashlight/fl/tensor/Index.h"
#include "flashlight/fl/tensor/Init.h"
#include "flashlight/fl/tensor/Random.h"
#include "flashlight/fl/autograd/Functions.h"
#include <atomic>
#include <cstdlib>
#include <iostream>

template <typename T> std::vector<T> arrayArg(void *ptr, int len) {
  std::vector<T> out;
  out.reserve(len);
  for (auto i = 0; i < len; ++i) {
    out.emplace_back(reinterpret_cast<T *>(ptr)[i]);
  }
  return out;
}

static std::atomic<size_t> g_bytes_used;

extern "C" {

void init() { fl::init(); }

size_t bytesUsed() {
  return g_bytes_used;
}

void *createTensor(void *shape_ptr, int shape_len) {
  static_assert(sizeof(long long) == sizeof(int64_t));
  auto shape = arrayArg<long long>(shape_ptr, shape_len);
  auto* t = new fl::Tensor(fl::Shape(shape));
  g_bytes_used += t->bytes();
  return t;
}

void *tensorFromBuffer(int numel, void *ptr) {
  auto* t = new fl::Tensor(
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
    reinterpret_cast<int64_t *>(out)[i] = tensor->shape()[i];
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
