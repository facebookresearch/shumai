#include <atomic>
#include <cstdlib>
#include <iostream>
#include "flashlight/fl/autograd/Functions.h"
#include "flashlight/fl/autograd/tensor/AutogradOps.h"
#include "flashlight/fl/nn/Init.h"
#include "flashlight/fl/runtime/Device.h"
#include "flashlight/fl/runtime/Stream.h"
#include "flashlight/fl/tensor/Compute.h"
#include "flashlight/fl/tensor/Index.h"
#include "flashlight/fl/tensor/Init.h"
#include "flashlight/fl/tensor/Random.h"

#if 0
#include <mutex>
static std::mutex g_op_mutex;
#define LOCK_GUARD std::lock_guard<std::mutex> guard(g_op_mutex);
#else
#define LOCK_GUARD
#endif

static std::atomic<size_t> g_bytes_used = 0;
static std::atomic<bool> g_row_major = true;

template <typename T>
std::vector<T> arrayArg(void* ptr, int len, bool reverse, int invert) {
  std::vector<T> out;
  out.reserve(len);
  for (auto i = 0; i < len; ++i) {
    const auto idx = reverse ? len - i - 1 : i;
    auto v = reinterpret_cast<int64_t*>(ptr)[idx];
    if (invert && v < 0) {
      v = -v - 1;
    } else if (invert) {
      v = invert - v - 1;
    }
    out.emplace_back(v);
  }
  return out;
}

uint32_t axisArg(int32_t axis, bool reverse, int ndim) {
  if (!reverse) {
    return static_cast<uint32_t>(axis);
  }
  if (axis >= 0) {
    return static_cast<uint32_t>(ndim - axis - 1);
  } else {
    return static_cast<uint32_t>(-axis - 1);
  }
}

extern "C" {

void init() {
  fl::init();
}

size_t bytesUsed() {
  return g_bytes_used;
}

void* createTensor(void* shape_ptr, int64_t shape_len) {
  LOCK_GUARD
  static_assert(sizeof(long long) == sizeof(int64_t));
  auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
  auto* t = new fl::Tensor(fl::Shape(shape));
  g_bytes_used += t->bytes();
  return t;
}

void* tensorFromFloat32Buffer(int64_t numel, void* ptr) {
  LOCK_GUARD
  auto* t = new fl::Tensor(
      fl::Tensor::fromBuffer({numel}, (float*)ptr, fl::MemoryLocation::Host));
  g_bytes_used += t->bytes();
  return t;
}

void* tensorFromFloat64Buffer(int64_t numel, void* ptr) {
  LOCK_GUARD
  auto* t = new fl::Tensor(
      fl::Tensor::fromBuffer({numel}, (double*)ptr, fl::MemoryLocation::Host));
  g_bytes_used += t->bytes();
  return t;
}

void* tensorFromInt8Buffer(int64_t numel, void* ptr) {
  LOCK_GUARD
  auto* t = new fl::Tensor(
      fl::Tensor::fromBuffer({numel}, (char*)ptr, fl::MemoryLocation::Host));
  g_bytes_used += t->bytes();
  return t;
}

void* tensorFromInt16Buffer(int64_t numel, void* ptr) {
  LOCK_GUARD
  auto* t = new fl::Tensor(
      fl::Tensor::fromBuffer({numel}, (int16_t*)ptr, fl::MemoryLocation::Host));
  g_bytes_used += t->bytes();
  return t;
}

void* tensorFromInt32Buffer(int64_t numel, void* ptr) {
  LOCK_GUARD
  auto* t = new fl::Tensor(
      fl::Tensor::fromBuffer({numel}, (int32_t*)ptr, fl::MemoryLocation::Host));
  g_bytes_used += t->bytes();
  return t;
}

void* tensorFromInt64Buffer(int64_t numel, void* ptr) {
  LOCK_GUARD
  auto* t = new fl::Tensor(
      fl::Tensor::fromBuffer({numel}, (int64_t*)ptr, fl::MemoryLocation::Host));
  g_bytes_used += t->bytes();
  return t;
}

void* tensorFromUint8Buffer(int64_t numel, void* ptr) {
  LOCK_GUARD
  auto* t = new fl::Tensor(
      fl::Tensor::fromBuffer({numel}, (uint8_t*)ptr, fl::MemoryLocation::Host));
  g_bytes_used += t->bytes();
  return t;
}

void* tensorFromUint16Buffer(int64_t numel, void* ptr) {
  LOCK_GUARD
  auto* t = new fl::Tensor(fl::Tensor::fromBuffer({numel}, (uint16_t*)ptr,
                                                  fl::MemoryLocation::Host));
  g_bytes_used += t->bytes();
  return t;
}

void* tensorFromUint32Buffer(int64_t numel, void* ptr) {
  LOCK_GUARD
  auto* t = new fl::Tensor(fl::Tensor::fromBuffer({numel}, (uint32_t*)ptr,
                                                  fl::MemoryLocation::Host));
  g_bytes_used += t->bytes();
  return t;
}

void* tensorFromUint64Buffer(int64_t numel, void* ptr) {
  LOCK_GUARD
  auto* t = new fl::Tensor(fl::Tensor::fromBuffer({numel}, (uint64_t*)ptr,
                                                  fl::MemoryLocation::Host));
  g_bytes_used += t->bytes();
  return t;
}

void destroyTensor(void* t, void* /*ignore*/) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  g_bytes_used -= tensor->bytes();
  delete tensor;
}

typedef void (*JSTypedArrayBytesDeallocator)(void* bytes,
                                             void* deallocatorContext);

JSTypedArrayBytesDeallocator genTensorDestroyer() {
  return destroyTensor;
}

void setRowMajor() {
  g_row_major = true;
}

void setColMajor() {
  g_row_major = false;
}

bool isRowMajor() {
  return g_row_major;
}

bool isColMajor() {
  return !g_row_major;
}

void _save(void* t, char* cstr) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  auto filename = std::string(cstr);
  fl::save(filename, *tensor);
}

void* load(char* cstr) {
  LOCK_GUARD
  auto filename = std::string(cstr);
  fl::Tensor tensor;
  fl::load(filename, tensor);
  auto* t = new fl::Tensor(tensor);
  g_bytes_used += t->bytes();
  return t;
}

void _eval(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  fl::eval(*tensor);
}

size_t _elements(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->elements();
}

size_t _bytes(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->bytes();
}

int _shape(void* t, void* out, int out_len) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  if (out_len != tensor->ndim()) {
    return -1;
  }
  for (auto i = 0; i < out_len; ++i) {
    const auto idx = g_row_major ? out_len - i - 1 : i;
    reinterpret_cast<int64_t*>(out)[i] = tensor->shape()[idx];
  }
  return 0;
}

int _ndim(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->ndim();
}

void* _astype(void* t, int type) {
  LOCK_GUARD
  auto dtype = static_cast<fl::dtype>(type);
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  auto new_tensor = tensor->astype(dtype);
  g_bytes_used += new_tensor.bytes();
  return new fl::Tensor(new_tensor);
}

int _dtype(void* t) {
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  auto dtype = static_cast<int>(tensor->type());
  return dtype;
}

int dtypeFloat16() {
  int dtype = static_cast<int>(fl::dtype::f16);
  return dtype;
}

int dtypeFloat32() {
  int dtype = static_cast<int>(fl::dtype::f32);
  return dtype;
}
int dtypeFloat64() {
  int dtype = static_cast<int>(fl::dtype::f64);
  return dtype;
}

int dtypeBoolInt8() {
  int dtype = static_cast<int>(fl::dtype::b8);
  return dtype;
}

int dtypeInt16() {
  int dtype = static_cast<int>(fl::dtype::s16);
  return dtype;
}

int dtypeInt32() {
  int dtype = static_cast<int>(fl::dtype::s32);
  return dtype;
}

int dtypeInt64() {
  int dtype = static_cast<int>(fl::dtype::s64);
  return dtype;
}

int dtypeUint8() {
  int dtype = static_cast<int>(fl::dtype::u8);
  return dtype;
}

int dtypeUint16() {
  int dtype = static_cast<int>(fl::dtype::u16);
  return dtype;
}

int dtypeUint32() {
  int dtype = static_cast<int>(fl::dtype::u32);
  return dtype;
}

int dtypeUint64() {
  int dtype = static_cast<int>(fl::dtype::u64);
  return dtype;
}

float* _float16Buffer(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->astype(fl::dtype::f16).host<float>();
}

float* _float32Buffer(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->astype(fl::dtype::f32).host<float>();
}

float* _float64Buffer(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->astype(fl::dtype::f64).host<float>();
}

int* _int16Buffer(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->astype(fl::dtype::s16).host<int>();
}

int* _int32Buffer(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->astype(fl::dtype::s32).host<int>();
}

int* _int64Buffer(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->astype(fl::dtype::s64).host<int>();
}

unsigned* _uint8Buffer(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->astype(fl::dtype::u8).host<unsigned>();
}

unsigned* _uint16Buffer(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->astype(fl::dtype::u16).host<unsigned>();
}

unsigned* _uint32Buffer(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->astype(fl::dtype::u32).host<unsigned>();
}

unsigned* _uint64Buffer(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->astype(fl::dtype::u64).host<unsigned>();
}

float _scalar(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->scalar<float>();
}

void* _index(void* t,
             void* starts,
             int64_t starts_len,
             void* ends,
             int64_t ends_len,
             void* strides,
             int64_t strides_len) {
  LOCK_GUARD
  auto start = arrayArg<int64_t>(starts, starts_len, g_row_major, false);
  auto end = arrayArg<int64_t>(ends, ends_len, g_row_major, false);
  auto stride = arrayArg<int64_t>(strides, strides_len, g_row_major, false);
  std::vector<fl::Index> indices;
  indices.reserve(start.size());
  for (auto i = 0; i < start.size(); ++i) {
    if (start[i] == -1 && end[i] == -1) {
      indices.emplace_back(fl::span);
    } else if (start[i] + 1 == end[i]) {
      indices.emplace_back(start[i]);
    } else {
      indices.emplace_back(
          fl::range(start[i], end[i], strides_len ? stride[i] : 1));
    }
  }
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  auto* new_tensor = new fl::Tensor(tensor->operator()(indices));
  g_bytes_used += new_tensor->bytes();
  return new_tensor;
}

void* _indexedAssign(void* t,
                     void* other,
                     void* starts,
                     int64_t starts_len,
                     void* ends,
                     int64_t ends_len,
                     void* strides,
                     int64_t strides_len) {
  LOCK_GUARD
  auto start = arrayArg<int64_t>(starts, starts_len, g_row_major, false);
  auto end = arrayArg<int64_t>(ends, ends_len, g_row_major, false);
  auto stride = arrayArg<int64_t>(strides, strides_len, g_row_major, false);
  std::vector<fl::Index> indices;
  indices.reserve(start.size());
  for (auto i = 0; i < start.size(); ++i) {
    if (start[i] == -1 && end[i] == -1) {
      indices.emplace_back(fl::span);
    } else if (start[i] + 1 == end[i]) {
      indices.emplace_back(start[i]);
    } else {
      indices.emplace_back(
          fl::range(start[i], end[i], strides_len ? stride[i] : 1));
    }
  }
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  auto new_t = tensor->copy();
  auto* assign = reinterpret_cast<fl::Tensor*>(other);
  new_t(indices) *= 0;
  new_t(indices) += *assign;
  auto* new_tensor = new fl::Tensor(new_t);
  g_bytes_used += new_tensor->bytes();
  return new_tensor;
}

void* _flatten(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  auto* new_tensor = new fl::Tensor(tensor->flatten());
  g_bytes_used += new_tensor->bytes();
  return new_tensor;
}

void* _asContiguousTensor(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  auto* new_tensor = new fl::Tensor(tensor->asContiguousTensor());
  g_bytes_used += new_tensor->bytes();
  return new_tensor;
}

void* _copy(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  auto* new_tensor = new fl::Tensor(tensor->copy());
  g_bytes_used += new_tensor->bytes();
  return new_tensor;
}

void* _pad(void* t,
           void* before,
           int64_t before_len,
           void* after,
           int64_t after_len) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  auto before_vec = arrayArg<int64_t>(before, before_len, g_row_major, false);
  auto after_vec = arrayArg<int64_t>(after, after_len, g_row_major, false);
  std::vector<std::pair<int, int>> pair_vec;
  pair_vec.reserve(after_vec.size());
  for (auto i = 0; i < after_vec.size(); ++i) {
    pair_vec.emplace_back(before_vec[i], after_vec[i]);
  }
  auto* new_tensor = new fl::Tensor(fl::pad(*tensor, pair_vec));
  g_bytes_used += new_tensor->bytes();
  return new_tensor;
}

#include "binding_gen.inl"
};
