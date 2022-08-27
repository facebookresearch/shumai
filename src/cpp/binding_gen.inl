
void* _rand(void *shape_ptr, int64_t shape_len) {
  auto shape = arrayArg<long long>(shape_ptr, shape_len);
  auto* t = new fl::Tensor(fl::rand(fl::Shape(shape)));
  g_bytes_used += t->bytes();
  return t;
}

void* _randn(void *shape_ptr, int64_t shape_len) {
  auto shape = arrayArg<long long>(shape_ptr, shape_len);
  auto* t = new fl::Tensor(fl::randn(fl::Shape(shape)));
  g_bytes_used += t->bytes();
  return t;
}

void* _full(void *shape_ptr, int64_t shape_len, float val) {
  auto shape = arrayArg<long long>(shape_ptr, shape_len);
  auto* t = new fl::Tensor(fl::full(fl::Shape(shape), val));
  g_bytes_used += t->bytes();
  return t;
}

void* _identity(int64_t dim) {
  auto* t = new fl::Tensor(fl::identity(dim));
  g_bytes_used += t->bytes();
  return t;
}

void* _arange(float start, float end, float step) {
  auto* t = new fl::Tensor(fl::arange(start, end, step));
  g_bytes_used += t->bytes();
  return t;
}

void* _iota(void *dims_ptr, int64_t dims_len, void *tileDims_ptr, int64_t tileDims_len) {
  auto dims = arrayArg<long long>(dims_ptr, dims_len);
  auto tileDims = arrayArg<long long>(tileDims_ptr, tileDims_len);
  auto* t = new fl::Tensor(fl::iota(fl::Shape(dims), fl::Shape(tileDims)));
  g_bytes_used += t->bytes();
  return t;
}

void* _reshape(void *tensor, void *shape_ptr, int64_t shape_len) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto shape = arrayArg<long long>(shape_ptr, shape_len);
  auto* t = new fl::Tensor(fl::reshape(*tensor_ptr, fl::Shape(shape)));
  g_bytes_used += t->bytes();
  return t;
}

void* _transpose(void *tensor, void *axes_ptr, int64_t axes_len) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes = arrayArg<long long>(axes_ptr, axes_len);
  auto* t = new fl::Tensor(fl::transpose(*tensor_ptr, fl::Shape(axes)));
  g_bytes_used += t->bytes();
  return t;
}

void* _tile(void *tensor, void *shape_ptr, int64_t shape_len) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto shape = arrayArg<long long>(shape_ptr, shape_len);
  auto* t = new fl::Tensor(fl::tile(*tensor_ptr, fl::Shape(shape)));
  g_bytes_used += t->bytes();
  return t;
}

void* _nonzero(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::nonzero(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _negative(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::negative(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _logicalNot(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::logicalNot(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _exp(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::exp(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _log(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::log(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _log1p(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::log1p(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _sin(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::sin(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _cos(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::cos(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _sqrt(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::sqrt(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _tanh(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::tanh(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _floor(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::floor(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _ceil(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::ceil(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _rint(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::rint(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _absolute(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::absolute(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _abs(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::abs(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _sigmoid(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::sigmoid(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _erf(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::erf(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _flip(void *tensor, uint32_t dim) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::flip(*tensor_ptr, dim));
  g_bytes_used += t->bytes();
  return t;
}

void* _clip(void *tensor, void *low, void *high) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *low_ptr = reinterpret_cast<fl::Tensor*>(low);
  auto *high_ptr = reinterpret_cast<fl::Tensor*>(high);
  auto* t = new fl::Tensor(fl::clip(*tensor_ptr, *low_ptr, *high_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _roll(void *tensor, int shift, uint32_t axis) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::roll(*tensor_ptr, shift, axis));
  g_bytes_used += t->bytes();
  return t;
}

void* _isnan(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::isnan(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _isinf(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::isinf(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _sign(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::sign(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _tril(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::tril(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _triu(void *tensor) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::triu(*tensor_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _where(void *cond, void *x, void *y) {
  auto *cond_ptr = reinterpret_cast<fl::Tensor*>(cond);
  auto *x_ptr = reinterpret_cast<fl::Tensor*>(x);
  auto *y_ptr = reinterpret_cast<fl::Tensor*>(y);
  auto* t = new fl::Tensor(fl::where(*cond_ptr, *x_ptr, *y_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _sort(void *tensor, uint32_t dim) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::sort(*tensor_ptr, dim));
  g_bytes_used += t->bytes();
  return t;
}

void* _add(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::add(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _sub(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::sub(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _mul(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::mul(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _div(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::div(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _eq(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::eq(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _neq(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::neq(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _lessThan(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::lessThan(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _lessThanEqual(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::lessThanEqual(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _greaterThan(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::greaterThan(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _greaterThanEqual(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::greaterThanEqual(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _logicalOr(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::logicalOr(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _logicalAnd(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::logicalAnd(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _mod(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::mod(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _bitwiseAnd(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::bitwiseAnd(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _bitwiseOr(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::bitwiseOr(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _bitwiseXor(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::bitwiseXor(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _lShift(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::lShift(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _rShift(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::rShift(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _minimum(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::minimum(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _maximum(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::maximum(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _power(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::power(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _matmul(void *tensor, void *other) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto *other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto* t = new fl::Tensor(fl::matmul(*tensor_ptr, *other_ptr));
  g_bytes_used += t->bytes();
  return t;
}

void* _amin(void *tensor, void *axes_ptr, int64_t axes_len, bool keep_dims) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes = arrayArg<int>(axes_ptr, axes_len);
  auto* t = new fl::Tensor(fl::amin(*tensor_ptr, axes, keep_dims));
  g_bytes_used += t->bytes();
  return t;
}

void* _amax(void *tensor, void *axes_ptr, int64_t axes_len, bool keep_dims) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes = arrayArg<int>(axes_ptr, axes_len);
  auto* t = new fl::Tensor(fl::amax(*tensor_ptr, axes, keep_dims));
  g_bytes_used += t->bytes();
  return t;
}

void* _argmin(void *tensor, uint32_t axis, bool keep_dims) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::argmin(*tensor_ptr, axis, keep_dims));
  g_bytes_used += t->bytes();
  return t;
}

void* _argmax(void *tensor, uint32_t axis, bool keep_dims) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::argmax(*tensor_ptr, axis, keep_dims));
  g_bytes_used += t->bytes();
  return t;
}

void* _sum(void *tensor, void *axes_ptr, int64_t axes_len, bool keep_dims) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes = arrayArg<int>(axes_ptr, axes_len);
  auto* t = new fl::Tensor(fl::sum(*tensor_ptr, axes, keep_dims));
  g_bytes_used += t->bytes();
  return t;
}

void* _cumsum(void *tensor, uint32_t axis) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* t = new fl::Tensor(fl::cumsum(*tensor_ptr, axis));
  g_bytes_used += t->bytes();
  return t;
}

void* _mean(void *tensor, void *axes_ptr, int64_t axes_len, bool keep_dims) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes = arrayArg<int>(axes_ptr, axes_len);
  auto* t = new fl::Tensor(fl::mean(*tensor_ptr, axes, keep_dims));
  g_bytes_used += t->bytes();
  return t;
}

void* _median(void *tensor, void *axes_ptr, int64_t axes_len, bool keep_dims) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes = arrayArg<int>(axes_ptr, axes_len);
  auto* t = new fl::Tensor(fl::median(*tensor_ptr, axes, keep_dims));
  g_bytes_used += t->bytes();
  return t;
}

void* _var(void *tensor, void *axes_ptr, int64_t axes_len, bool bias, bool keep_dims) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes = arrayArg<int>(axes_ptr, axes_len);
  auto* t = new fl::Tensor(fl::var(*tensor_ptr, axes, bias, keep_dims));
  g_bytes_used += t->bytes();
  return t;
}

void* _std(void *tensor, void *axes_ptr, int64_t axes_len, bool keep_dims) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes = arrayArg<int>(axes_ptr, axes_len);
  auto* t = new fl::Tensor(fl::std(*tensor_ptr, axes, keep_dims));
  g_bytes_used += t->bytes();
  return t;
}

void* _norm(void *tensor, void *axes_ptr, int64_t axes_len, double p, bool keep_dims) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes = arrayArg<int>(axes_ptr, axes_len);
  auto* t = new fl::Tensor(fl::norm(*tensor_ptr, axes, p, keep_dims));
  g_bytes_used += t->bytes();
  return t;
}

void* _countNonzero(void *tensor, void *axes_ptr, int64_t axes_len, bool keep_dims) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes = arrayArg<int>(axes_ptr, axes_len);
  auto* t = new fl::Tensor(fl::countNonzero(*tensor_ptr, axes, keep_dims));
  g_bytes_used += t->bytes();
  return t;
}

void* _any(void *tensor, void *axes_ptr, int64_t axes_len, bool keep_dims) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes = arrayArg<int>(axes_ptr, axes_len);
  auto* t = new fl::Tensor(fl::any(*tensor_ptr, axes, keep_dims));
  g_bytes_used += t->bytes();
  return t;
}

void* _all(void *tensor, void *axes_ptr, int64_t axes_len, bool keep_dims) {
  auto *tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes = arrayArg<int>(axes_ptr, axes_len);
  auto* t = new fl::Tensor(fl::all(*tensor_ptr, axes, keep_dims));
  g_bytes_used += t->bytes();
  return t;
}
