
#include <atomic>
#include <cstdlib>
#include <iostream>
#include "flashlight/fl/autograd/Functions.h"
#include "flashlight/fl/autograd/tensor/AutogradExtension.h"
#include "flashlight/fl/autograd/tensor/AutogradOps.h"
#include "flashlight/fl/common/DynamicBenchmark.h"
#include "flashlight/fl/nn/Init.h"
#include "flashlight/fl/runtime/Device.h"
#include "flashlight/fl/runtime/Stream.h"
#include "flashlight/fl/tensor/Compute.h"
#include "flashlight/fl/tensor/Index.h"
#include "flashlight/fl/tensor/Init.h"
#include "flashlight/fl/tensor/Random.h"
#include "flashlight/fl/tensor/TensorAdapter.h"

#define FMT_RESET "\033[0m"
#define FMT_RED "\033[31m"
#define FMT_GRAY "\033[90m"
#define FMT_YELLOW "\033[33m"
#define FMT_CYAN "\033[36m"
#define FMT_BOLD_WHITE "\033[1m\033[97m"
#define FMT_BOLD_ITALIC_WHITE "\033[1m\033[3m\033[97m"

#define HANDLE_EXCEPTION(what)                                         \
  {                                                                    \
    std::cerr << FMT_RED << "native code error" << FMT_GRAY << ": "    \
              << FMT_BOLD_WHITE << what << FMT_RESET << FMT_GRAY       \
              << "\n                  at " << FMT_BOLD_ITALIC_WHITE    \
              << __func__ << FMT_RESET << FMT_GRAY << " (" << FMT_CYAN \
              << __FILE__ << FMT_GRAY << ":" << FMT_YELLOW << __LINE__ \
              << FMT_GRAY << ")" << FMT_RESET << std::endl;            \
    return nullptr;                                                    \
  }

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
std::vector<T> arrayArg(const void* ptr, int len, bool reverse, int invert) {
  std::vector<T> out;
  out.reserve(len);
  for (auto i = 0; i < len; ++i) {
    const auto idx = reverse ? len - i - 1 : i;
    auto v = reinterpret_cast<const int64_t*>(ptr)[idx];
    if (invert && v < 0) {
      v = -v - 1;
    } else if (invert) {
      v = invert - v - 1;
    }
    out.emplace_back(v);
  }
  return out;
}

template <typename T>
std::vector<T> ptrArrayArg(const void* ptr, int len) {
  std::vector<T> out;
  out.reserve(len);
  for (auto i = 0; i < len; ++i) {
    auto ptrAsInt = reinterpret_cast<const int64_t*>(ptr)[i];
    auto ptr = reinterpret_cast<T*>(ptrAsInt);
    out.emplace_back(*ptr);
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
  try {
    LOCK_GUARD
    static_assert(sizeof(long long) == sizeof(int64_t));
    auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
    auto* t = new fl::Tensor(fl::Shape(shape));
    g_bytes_used += t->bytes();
    return t;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* tensorFromFloat16Buffer(int64_t numel, void* ptr) {
  try {
    LOCK_GUARD
    auto* t = new fl::Tensor(
        fl::Tensor::fromBuffer({numel}, (float*)ptr, fl::MemoryLocation::Host)
            .astype(fl::dtype::f16));
    g_bytes_used += t->bytes();
    return t;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* tensorFromFloat32Buffer(int64_t numel, void* ptr) {
  try {
    LOCK_GUARD
    auto* t = new fl::Tensor(
        fl::Tensor::fromBuffer({numel}, (float*)ptr, fl::MemoryLocation::Host));
    g_bytes_used += t->bytes();
    return t;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* tensorFromFloat64Buffer(int64_t numel, void* ptr) {
  try {
    LOCK_GUARD
    auto* t = new fl::Tensor(fl::Tensor::fromBuffer({numel}, (double*)ptr,
                                                    fl::MemoryLocation::Host));
    g_bytes_used += t->bytes();
    return t;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* tensorFromInt8Buffer(int64_t numel, void* ptr) {
  try {
    LOCK_GUARD
    auto* t = new fl::Tensor(
        fl::Tensor::fromBuffer({numel}, (char*)ptr, fl::MemoryLocation::Host));
    g_bytes_used += t->bytes();
    return t;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* tensorFromInt16Buffer(int64_t numel, void* ptr) {
  try {
    LOCK_GUARD
    auto* t = new fl::Tensor(fl::Tensor::fromBuffer({numel}, (int16_t*)ptr,
                                                    fl::MemoryLocation::Host));
    g_bytes_used += t->bytes();
    return t;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* tensorFromInt32Buffer(int64_t numel, void* ptr) {
  try {
    LOCK_GUARD
    auto* t = new fl::Tensor(fl::Tensor::fromBuffer({numel}, (int32_t*)ptr,
                                                    fl::MemoryLocation::Host));
    g_bytes_used += t->bytes();
    return t;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* tensorFromInt64Buffer(int64_t numel, void* ptr) {
  try {
    LOCK_GUARD
    auto* t = new fl::Tensor(fl::Tensor::fromBuffer({numel}, (int64_t*)ptr,
                                                    fl::MemoryLocation::Host));
    g_bytes_used += t->bytes();
    return t;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* tensorFromUint8Buffer(int64_t numel, void* ptr) {
  try {
    LOCK_GUARD
    auto* t = new fl::Tensor(fl::Tensor::fromBuffer({numel}, (uint8_t*)ptr,
                                                    fl::MemoryLocation::Host));
    g_bytes_used += t->bytes();
    return t;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* tensorFromUint16Buffer(int64_t numel, void* ptr) {
  try {
    LOCK_GUARD
    auto* t = new fl::Tensor(fl::Tensor::fromBuffer({numel}, (uint16_t*)ptr,
                                                    fl::MemoryLocation::Host));
    g_bytes_used += t->bytes();
    return t;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* tensorFromUint32Buffer(int64_t numel, void* ptr) {
  try {
    LOCK_GUARD
    auto* t = new fl::Tensor(fl::Tensor::fromBuffer({numel}, (uint32_t*)ptr,
                                                    fl::MemoryLocation::Host));
    g_bytes_used += t->bytes();
    return t;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* tensorFromUint64Buffer(int64_t numel, void* ptr) {
  try {
    LOCK_GUARD
    auto* t = new fl::Tensor(fl::Tensor::fromBuffer({numel}, (uint64_t*)ptr,
                                                    fl::MemoryLocation::Host));
    g_bytes_used += t->bytes();
    return t;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void destroyTensor(void* t, void* /*ignore*/) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  if (tensor->hasAdapter()) {
    g_bytes_used -= tensor->bytes();
  }
  delete tensor;
}

void dispose(void* t) {
  LOCK_GUARD
  auto& tensor = *reinterpret_cast<fl::Tensor*>(t);
  g_bytes_used -= tensor.bytes();
  fl::detail::releaseAdapterUnsafe(tensor);
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

void _save(void* t, void* cstr_ptr, int length) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  const char* cstr = reinterpret_cast<char*>(cstr_ptr);
  auto filename = std::string(cstr, length);
  fl::save(filename, *tensor);
}

void* load(void* cstr_ptr, int length) {
  try {
    LOCK_GUARD
    const char* cstr = reinterpret_cast<char*>(cstr_ptr);
    auto filename = std::string(cstr, length);
    fl::Tensor tensor;
    fl::load(filename, tensor);
    auto* t = new fl::Tensor(tensor);
    g_bytes_used += t->bytes();
    return t;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
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
  try {
    LOCK_GUARD
    auto dtype = static_cast<fl::dtype>(type);
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    auto new_tensor = tensor->astype(dtype);
    g_bytes_used += new_tensor.bytes();
    return new fl::Tensor(new_tensor);
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
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
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    return tensor->astype(fl::dtype::f32).host<float>();
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

float* _float32Buffer(void* t) {
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    return tensor->astype(fl::dtype::f32).host<float>();
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

float* _float64Buffer(void* t) {
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    return tensor->astype(fl::dtype::f64).host<float>();
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

int* _boolInt8Buffer(void* t) {
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    return tensor->astype(fl::dtype::b8).host<int>();
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

int* _int16Buffer(void* t) {
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    return tensor->astype(fl::dtype::s16).host<int>();
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

int* _int32Buffer(void* t) {
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    return tensor->astype(fl::dtype::s32).host<int>();
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

int* _int64Buffer(void* t) {
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    return tensor->astype(fl::dtype::s64).host<int>();
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

unsigned* _uint8Buffer(void* t) {
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    return tensor->astype(fl::dtype::u8).host<unsigned>();
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

unsigned* _uint16Buffer(void* t) {
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    return tensor->astype(fl::dtype::u16).host<unsigned>();
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

unsigned* _uint32Buffer(void* t) {
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    return tensor->astype(fl::dtype::u32).host<unsigned>();
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

unsigned* _uint64Buffer(void* t) {
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    return tensor->astype(fl::dtype::u64).host<unsigned>();
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

float _float16Scalar(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->asScalar<float>();
}

float _float32Scalar(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->asScalar<float>();
}

float _float64Scalar(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->asScalar<float>();
}

char _boolInt8Scalar(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->asScalar<char>();
}

int16_t _int16Scalar(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->asScalar<int16_t>();
}

int32_t _int32Scalar(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->asScalar<int32_t>();
}

int64_t _int64Scalar(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->asScalar<int64_t>();
}

uint8_t _uint8Scalar(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->asScalar<uint8_t>();
}

uint16_t _uint16Scalar(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->asScalar<uint16_t>();
}

uint32_t _uint32Scalar(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->asScalar<uint32_t>();
}

uint64_t _uint64Scalar(void* t) {
  LOCK_GUARD
  auto* tensor = reinterpret_cast<fl::Tensor*>(t);
  return tensor->asScalar<uint64_t>();
}

void* _index(void* t,
             void* starts,
             int64_t starts_len,
             void* ends,
             int64_t ends_len,
             void* strides,
             int64_t strides_len) {
  try {
    LOCK_GUARD
    auto start = arrayArg<int64_t>(starts, starts_len, g_row_major, false);
    auto end = arrayArg<int64_t>(ends, ends_len, g_row_major, false);
    auto stride = arrayArg<int64_t>(strides, strides_len, g_row_major, false);
    std::vector<fl::Index> indices;
    indices.reserve(start.size());
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    auto shape = tensor->shape();
    for (auto i = 0; i < start.size(); ++i) {
      if (start[i] == -1 && end[i] == -1) {
        indices.emplace_back(fl::span);
      } else {
        if (start[i] == -1) {
          start[i] = 0;
        }
        if (end[i] == -1) {
          end[i] = shape[i];
        }
        if (start[i] + 1 == end[i]) {
          indices.emplace_back(start[i]);
        } else {
          indices.emplace_back(
              fl::range(start[i], end[i], strides_len ? stride[i] : 1));
        }
      }
    }
    auto* new_tensor = new fl::Tensor(tensor->operator()(indices));
    g_bytes_used += new_tensor->bytes();
    return new_tensor;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* _indexedAssign(void* t,
                     void* other,
                     void* starts,
                     int64_t starts_len,
                     void* ends,
                     int64_t ends_len,
                     void* strides,
                     int64_t strides_len) {
  try {
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
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* _flatten(void* t) {
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    auto* new_tensor = new fl::Tensor(tensor->flatten());
    g_bytes_used += new_tensor->bytes();
    return new_tensor;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* _asContiguousTensor(void* t) {
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    auto* new_tensor = new fl::Tensor(tensor->asContiguousTensor());
    g_bytes_used += new_tensor->bytes();
    return new_tensor;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* _copy(void* t) {
  try {
    LOCK_GUARD
    auto* tensor = reinterpret_cast<fl::Tensor*>(t);
    auto* new_tensor = new fl::Tensor(tensor->copy());
    g_bytes_used += new_tensor->bytes();
    return new_tensor;
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

void* _pad(void* t,
           void* before,
           int64_t before_len,
           void* after,
           int64_t after_len) {
  try {
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
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

// `grad_in` is Shumai equivalent to Flashlight `gradOutput`
void* _conv2dBackwardData(void* grad_in,
                          void* in,
                          void* wt,
                          void* bs,
                          int sx,
                          int sy,
                          int px,
                          int py,
                          int dx,
                          int dy,
                          int groups) {
  try {
    LOCK_GUARD
    auto* used_grad_in = reinterpret_cast<fl::Tensor*>(grad_in);
    auto* used_bs = reinterpret_cast<fl::Tensor*>(bs);
    auto* used_in = reinterpret_cast<fl::Tensor*>(in);
    auto* used_wt = reinterpret_cast<fl::Tensor*>(wt);

    auto payload = std::make_shared<fl::detail::AutogradPayload>();
    std::shared_ptr<fl::DynamicBenchmark> dataBench;
    auto result = fl::detail::conv2dBackwardData(
        *used_grad_in, *used_in, *used_wt, sx, sy, px, py, dx, dy, groups,
        dataBench, payload);

    g_bytes_used += result.bytes();
    return new fl::Tensor(result);
  } catch (std::exception const& e) {
    HANDLE_EXCEPTION(e.what());
  } catch (...) {
    HANDLE_EXCEPTION("[unknown]");
  }
}

#include "binding_gen.inl"
};
