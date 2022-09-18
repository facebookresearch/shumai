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
std::vector<T> arrayArg(void *ptr, int len, bool reverse, int invert)
{
  std::vector<T> out;
  out.reserve(len);
  for (auto i = 0; i < len; ++i)
  {
    const auto idx = reverse ? len - i - 1 : i;
    auto v = reinterpret_cast<T *>(ptr)[idx];
    if (invert && v < 0)
    {
      v = -v - 1;
    }
    else if (invert)
    {
      v = invert - v - 1;
    }
    out.emplace_back(v);
  }
  return out;
}

uint32_t axisArg(int32_t axis, bool reverse, int ndim)
{
  if (!reverse)
  {
    return static_cast<uint32_t>(axis);
  }
  if (axis >= 0)
  {
    return static_cast<uint32_t>(ndim - axis - 1);
  }
  else
  {
    return static_cast<uint32_t>(-axis - 1);
  }
}

static std::atomic<size_t> g_bytes_used = 0;
static std::atomic<bool> g_row_major = true;

extern "C"
{

  void init() { fl::init(); }

  size_t bytesUsed() { return g_bytes_used; }

  void *createTensor(void *shape_ptr, int64_t shape_len)
  {
    static_assert(sizeof(long long) == sizeof(int64_t));
    auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
    auto *t = new fl::Tensor(fl::Shape(shape));
    g_bytes_used += t->bytes();
    return t;
  }

  void *tensorFromBuffer(int64_t numel, void *ptr)
  {
    auto *t = new fl::Tensor(
        fl::Tensor::fromBuffer({numel}, (float *)ptr, fl::MemoryLocation::Host));
    g_bytes_used += t->bytes();
    return t;
  }

  void destroyTensor(void *t, void * /*ignore*/)
  {
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

  void _eval(void *t)
  {
    auto *tensor = reinterpret_cast<fl::Tensor *>(t);
    fl::eval(*tensor);
  }

  size_t _elements(void *t)
  {
    auto *tensor = reinterpret_cast<fl::Tensor *>(t);
    return tensor->elements();
  }

  size_t _bytes(void *t)
  {
    auto *tensor = reinterpret_cast<fl::Tensor *>(t);
    return tensor->bytes();
  }

  int _shape(void *t, void *out, int out_len)
  {
    auto *tensor = reinterpret_cast<fl::Tensor *>(t);
    if (out_len != tensor->ndim())
    {
      return -1;
    }
    for (auto i = 0; i < out_len; ++i)
    {
      const auto idx = g_row_major ? out_len - i - 1 : i;
      reinterpret_cast<int64_t *>(out)[i] = tensor->shape()[idx];
    }
    return 0;
  }

  int _ndim(void *t)
  {
    auto *tensor = reinterpret_cast<fl::Tensor *>(t);
    return tensor->ndim();
  }

  float *_buffer(void *t)
  {
    auto *tensor = reinterpret_cast<fl::Tensor *>(t);
    return tensor->astype(fl::dtype::f32).host<float>();
  }

  float _scalar(void *t)
  {
    auto *tensor = reinterpret_cast<fl::Tensor *>(t);
    return tensor->scalar<float>();
  }

  void *_index(void *t, void *starts, int64_t starts_len, void *ends,
               int64_t ends_len, void *strides, int64_t strides_len)
  {
    auto start = arrayArg<int64_t>(starts, starts_len, g_row_major, false);
    auto end = arrayArg<int64_t>(ends, ends_len, g_row_major, false);
    auto stride = arrayArg<int64_t>(strides, strides_len, g_row_major, false);
    std::vector<fl::Index> indices;
    indices.reserve(start.size());
    for (auto i = 0; i < start.size(); ++i)
    {
      if (start[i] == -1 && end[i] == -1)
      {
        indices.emplace_back(fl::span);
      }
      else if (start[i] + 1 == end[i])
      {
        indices.emplace_back(start[i]);
      }
      else
      {
        indices.emplace_back(
            fl::range(start[i], end[i], strides_len ? stride[i] : 1));
      }
    }
    auto *tensor = reinterpret_cast<fl::Tensor *>(t);
    auto *new_tensor = new fl::Tensor(tensor->operator()(indices));
    g_bytes_used += new_tensor->bytes();
    return new_tensor;
  }

  void *_indexedAssign(void *t, void *other, void *starts, int64_t starts_len,
                       void *ends, int64_t ends_len, void *strides,
                       int64_t strides_len)
  {
    auto start = arrayArg<int64_t>(starts, starts_len, g_row_major, false);
    auto end = arrayArg<int64_t>(ends, ends_len, g_row_major, false);
    auto stride = arrayArg<int64_t>(strides, strides_len, g_row_major, false);
    std::vector<fl::Index> indices;
    indices.reserve(start.size());
    for (auto i = 0; i < start.size(); ++i)
    {
      if (start[i] == -1 && end[i] == -1)
      {
        indices.emplace_back(fl::span);
      }
      else if (start[i] + 1 == end[i])
      {
        indices.emplace_back(start[i]);
      }
      else
      {
        indices.emplace_back(
            fl::range(start[i], end[i], strides_len ? stride[i] : 1));
      }
    }
    auto *tensor = reinterpret_cast<fl::Tensor *>(t);
    auto *assign = reinterpret_cast<fl::Tensor *>(other);
    auto *new_tensor = new fl::Tensor((tensor->operator()(indices) = *assign));
    g_bytes_used += new_tensor->bytes();
    return new_tensor;
  }

  void *_flatten(void *t)
  {
    auto *tensor = reinterpret_cast<fl::Tensor *>(t);
    auto *new_tensor = new fl::Tensor(tensor->flatten());
    g_bytes_used += new_tensor->bytes();
    return new_tensor;
  }

  void *_asContiguousTensor(void *t)
  {
    auto *tensor = reinterpret_cast<fl::Tensor *>(t);
    auto *new_tensor = new fl::Tensor(tensor->asContiguousTensor());
    g_bytes_used += new_tensor->bytes();
    return new_tensor;
  }

  void *_copy(void *t)
  {
    auto *tensor = reinterpret_cast<fl::Tensor *>(t);
    auto *new_tensor = new fl::Tensor(tensor->copy());
    g_bytes_used += new_tensor->bytes();
    return new_tensor;
  }

#include "binding_gen.inl"
};
