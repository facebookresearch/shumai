#include <stddef.h>
#include <stdint.h>

extern "C" {

void init() {}

size_t bytesUsed() {
  return 0;
}

void* createTensor(void* shape_ptr, int64_t shape_len) {
  return nullptr;
}

void* tensorFromFloat16Buffer(int64_t numel, void* ptr) {
  return nullptr;
}

void* tensorFromFloat32Buffer(int64_t numel, void* ptr) {
  return nullptr;
}

void* tensorFromFloat64Buffer(int64_t numel, void* ptr) {
  return nullptr;
}

void* tensorFromInt8Buffer(int64_t numel, void* ptr) {
  return nullptr;
}

void* tensorFromInt16Buffer(int64_t numel, void* ptr) {
  return nullptr;
}

void* tensorFromInt32Buffer(int64_t numel, void* ptr) {
  return nullptr;
}

void* tensorFromInt64Buffer(int64_t numel, void* ptr) {
  return nullptr;
}

void* tensorFromUint8Buffer(int64_t numel, void* ptr) {
  return nullptr;
}

void* tensorFromUint16Buffer(int64_t numel, void* ptr) {
  return nullptr;
}

void* tensorFromUint32Buffer(int64_t numel, void* ptr) {
  return nullptr;
}

void* tensorFromUint64Buffer(int64_t numel, void* ptr) {
  return nullptr;
}

void destroyTensor(void* t, void* /*ignore*/) {}

void dispose(void* t) {}

typedef void (*JSTypedArrayBytesDeallocator)(void* bytes,
                                             void* deallocatorContext);

JSTypedArrayBytesDeallocator genTensorDestroyer() {
  return destroyTensor;
}

void setRowMajor() {}

void setColMajor() {}

bool isRowMajor() {
  return true;
}

bool isColMajor() {
  return false;
}

void _save(void* t, void* cstr_ptr, int length) {}

void* load(void* cstr_ptr, int length) {
  return nullptr;
}

void _eval(void* t) {}

size_t _elements(void* t) {
  return 0;
}

size_t _bytes(void* t) {
  return 0;
}

int _shape(void* t, void* out, int out_len) {
  return 0;
}

int _ndim(void* t) {
  return 0;
}

void* _astype(void* t, int type) {
  return nullptr;
}

int _dtype(void* t) {
  return 0;
}

int dtypeFloat16() {
  return 0;
}

int dtypeFloat32() {
  return 0;
}

int dtypeFloat64() {
  return 0;
}

int dtypeBoolInt8() {
  return 0;
}

int dtypeInt16() {
  return 0;
}

int dtypeInt32() {
  return 0;
}

int dtypeInt64() {
  return 0;
}

int dtypeUint8() {
  return 0;
}

int dtypeUint16() {
  return 0;
}

int dtypeUint32() {
  return 0;
}

int dtypeUint64() {
  return 0;
}

float* _float16Buffer(void* t) {
  return nullptr;
}

float* _float32Buffer(void* t) {
  return nullptr;
}

float* _float64Buffer(void* t) {
  return nullptr;
}

int* _boolInt8Buffer(void* t) {
  return nullptr;
}

int* _int16Buffer(void* t) {
  return nullptr;
}

int* _int32Buffer(void* t) {
  return nullptr;
}

int* _int64Buffer(void* t) {
  return nullptr;
}

unsigned* _uint8Buffer(void* t) {
  return nullptr;
}

unsigned* _uint16Buffer(void* t) {
  return nullptr;
}

unsigned* _uint32Buffer(void* t) {
  return nullptr;
}

unsigned* _uint64Buffer(void* t) {
  return nullptr;
}

float _float16Scalar(void* t) {
  return 0;
}

float _float32Scalar(void* t) {
  return 0;
}

float _float64Scalar(void* t) {
  return 0;
}

char _boolInt8Scalar(void* t) {
  return 0;
}

int16_t _int16Scalar(void* t) {
  return 0;
}

int32_t _int32Scalar(void* t) {
  return 0;
}

int64_t _int64Scalar(void* t) {
  return 0;
}

uint8_t _uint8Scalar(void* t) {
  return 0;
}

uint16_t _uint16Scalar(void* t) {
  return 0;
}

uint32_t _uint32Scalar(void* t) {
  return 0;
}

uint64_t _uint64Scalar(void* t) {
  return 0;
}

void* _index(void* t,
             void* starts,
             int64_t starts_len,
             void* ends,
             int64_t ends_len,
             void* strides,
             int64_t strides_len) {
  return nullptr;
}

void* _indexedAssign(void* t,
                     void* other,
                     void* starts,
                     int64_t starts_len,
                     void* ends,
                     int64_t ends_len,
                     void* strides,
                     int64_t strides_len) {
  return nullptr;
}

void* _flatten(void* t) {
  return nullptr;
}

void* _asContiguousTensor(void* t) {
  return nullptr;
}

void* _copy(void* t) {
  return nullptr;
}

void* _pad(void* t,
           void* before,
           int64_t before_len,
           void* after,
           int64_t after_len) {
  return nullptr;
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
  return nullptr;
}

void* _rand(void* shape_ptr, int64_t shape_len) {
  return nullptr;
}

void* _randn(void* shape_ptr, int64_t shape_len) {
  return nullptr;
}

void* _full(void* shape_ptr, int64_t shape_len, float val) {
  return nullptr;
}

void* _identity(int64_t dim) {
  return nullptr;
}

void* _arange(float start, float end, float step) {
  return nullptr;
}

void* _iota(void* dims_ptr,
            int64_t dims_len,
            void* tileDims_ptr,
            int64_t tileDims_len) {
  return nullptr;
}

void* _reshape(void* tensor, void* shape_ptr, int64_t shape_len) {
  return nullptr;
}

void* _transpose(void* tensor, void* axes_ptr, int64_t axes_len) {
  return nullptr;
}

void* _tile(void* tensor, void* shape_ptr, int64_t shape_len) {
  return nullptr;
}

void* _concatenate(void* tensors_ptr, int64_t tensors_len, int32_t axis) {
  return nullptr;
}

void* _nonzero(void* tensor) {
  return nullptr;
}

void* _negative(void* tensor) {
  return nullptr;
}

void* _logicalNot(void* tensor) {
  return nullptr;
}

void* _exp(void* tensor) {
  return nullptr;
}

void* _log(void* tensor) {
  return nullptr;
}

void* _log1p(void* tensor) {
  return nullptr;
}

void* _sin(void* tensor) {
  return nullptr;
}

void* _cos(void* tensor) {
  return nullptr;
}

void* _sqrt(void* tensor) {
  return nullptr;
}

void* _tanh(void* tensor) {
  return nullptr;
}

void* _floor(void* tensor) {
  return nullptr;
}

void* _ceil(void* tensor) {
  return nullptr;
}

void* _rint(void* tensor) {
  return nullptr;
}

void* _absolute(void* tensor) {
  return nullptr;
}

void* _sigmoid(void* tensor) {
  return nullptr;
}

void* _erf(void* tensor) {
  return nullptr;
}

void* _flip(void* tensor, uint32_t dim) {
  return nullptr;
}

void* _clip(void* tensor, void* low, void* high) {
  return nullptr;
}

void* _roll(void* tensor, int shift, int32_t axis) {
  return nullptr;
}

void* _isnan(void* tensor) {
  return nullptr;
}

void* _isinf(void* tensor) {
  return nullptr;
}

void* _sign(void* tensor) {
  return nullptr;
}

void* _tril(void* tensor) {
  return nullptr;
}

void* _triu(void* tensor) {
  return nullptr;
}

void* _where(void* cond, void* x, void* y) {
  return nullptr;
}

void* _sort(void* tensor, uint32_t dim) {
  return nullptr;
}

void* _add(void* tensor, void* other) {
  return nullptr;
}

void* _sub(void* tensor, void* other) {
  return nullptr;
}

void* _mul(void* tensor, void* other) {
  return nullptr;
}

void* _div(void* tensor, void* other) {
  return nullptr;
}

void* _eq(void* tensor, void* other) {
  return nullptr;
}

void* _neq(void* tensor, void* other) {
  return nullptr;
}

void* _lessThan(void* tensor, void* other) {
  return nullptr;
}

void* _lessThanEqual(void* tensor, void* other) {
  return nullptr;
}

void* _greaterThan(void* tensor, void* other) {
  return nullptr;
}

void* _greaterThanEqual(void* tensor, void* other) {
  return nullptr;
}

void* _logicalOr(void* tensor, void* other) {
  return nullptr;
}

void* _logicalAnd(void* tensor, void* other) {
  return nullptr;
}

void* _mod(void* tensor, void* other) {
  return nullptr;
}

void* _bitwiseAnd(void* tensor, void* other) {
  return nullptr;
}

void* _bitwiseOr(void* tensor, void* other) {
  return nullptr;
}

void* _bitwiseXor(void* tensor, void* other) {
  return nullptr;
}

void* _lShift(void* tensor, void* other) {
  return nullptr;
}

void* _rShift(void* tensor, void* other) {
  return nullptr;
}

void* _minimum(void* tensor, void* other) {
  return nullptr;
}

void* _maximum(void* tensor, void* other) {
  return nullptr;
}

void* _power(void* tensor, void* other) {
  return nullptr;
}

void* _matmul(void* tensor, void* other) {
  return nullptr;
}

void* _conv2d(void* tensor,
              void* weights,
              int32_t sx,
              int32_t sy,
              int32_t px,
              int32_t py,
              int32_t dx,
              int32_t dy,
              int32_t groups) {
  return nullptr;
}

void* _amin(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  return nullptr;
}

void* _amax(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  return nullptr;
}

void* _argmin(void* tensor, int32_t axis, bool keep_dims) {
  return nullptr;
}

void* _argmax(void* tensor, int32_t axis, bool keep_dims) {
  return nullptr;
}

void* _sum(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  return nullptr;
}

void* _cumsum(void* tensor, int32_t axis) {
  return nullptr;
}

void* _mean(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  return nullptr;
}

void* _median(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  return nullptr;
}

void* _var(void* tensor,
           void* axes_ptr,
           int64_t axes_len,
           bool bias,
           bool keep_dims) {
  return nullptr;
}

void* _std(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  return nullptr;
}

void* _norm(void* tensor,
            void* axes_ptr,
            int64_t axes_len,
            double p,
            bool keep_dims) {
  return nullptr;
}

void* _countNonzero(void* tensor,
                    void* axes_ptr,
                    int64_t axes_len,
                    bool keep_dims) {
  return nullptr;
}

void* _any(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  return nullptr;
}

void* _all(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  return nullptr;
}
};
