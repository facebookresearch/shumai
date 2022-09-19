
void* _rand(void* shape_ptr, int64_t shape_len) {
  auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
  auto t = fl::Tensor(fl::rand(fl::Shape(shape)));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _randn(void* shape_ptr, int64_t shape_len) {
  auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
  auto t = fl::Tensor(fl::randn(fl::Shape(shape)));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _full(void* shape_ptr, int64_t shape_len, float val) {
  auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
  auto t = fl::Tensor(fl::full(fl::Shape(shape), val));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _identity(int64_t dim) {
  auto t = fl::Tensor(fl::identity(dim));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _arange(float start, float end, float step) {
  auto t = fl::Tensor(fl::arange(start, end, step));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _iota(void* dims_ptr,
            int64_t dims_len,
            void* tileDims_ptr,
            int64_t tileDims_len) {
  auto dims = arrayArg<long long>(dims_ptr, dims_len, g_row_major, false);
  auto tileDims =
      arrayArg<long long>(tileDims_ptr, tileDims_len, g_row_major, false);
  auto t = fl::Tensor(fl::iota(fl::Shape(dims), fl::Shape(tileDims)));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _reshape(void* tensor, void* shape_ptr, int64_t shape_len) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
  auto t = fl::Tensor(fl::reshape(*tensor_ptr, fl::Shape(shape)));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _transpose(void* tensor, void* axes_ptr, int64_t axes_len) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<long long>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::transpose(*tensor_ptr, fl::Shape(axes)));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _tile(void* tensor, void* shape_ptr, int64_t shape_len) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
  auto t = fl::Tensor(fl::tile(*tensor_ptr, fl::Shape(shape)));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _nonzero(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::nonzero(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _negative(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::negative(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _logicalNot(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::logicalNot(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _exp(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::exp(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _log(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::log(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _log1p(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::log1p(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sin(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::sin(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _cos(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::cos(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sqrt(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::sqrt(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _tanh(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::tanh(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _floor(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::floor(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _ceil(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::ceil(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _rint(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::rint(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _absolute(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::absolute(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _abs(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::abs(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sigmoid(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::sigmoid(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _erf(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::erf(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _flip(void* tensor, uint32_t dim) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::flip(*tensor_ptr, dim));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _clip(void* tensor, void* low, void* high) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* low_ptr = reinterpret_cast<fl::Tensor*>(low);
  auto* high_ptr = reinterpret_cast<fl::Tensor*>(high);
  auto t = fl::Tensor(fl::clip(*tensor_ptr, *low_ptr, *high_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _roll(void* tensor, int shift, int32_t axis) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto used_axis = axisArg(axis, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::roll(*tensor_ptr, shift, used_axis));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _isnan(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::isnan(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _isinf(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::isinf(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sign(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::sign(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _tril(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::tril(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _triu(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::triu(*tensor_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _where(void* cond, void* x, void* y) {
  auto* cond_ptr = reinterpret_cast<fl::Tensor*>(cond);
  auto* x_ptr = reinterpret_cast<fl::Tensor*>(x);
  auto* y_ptr = reinterpret_cast<fl::Tensor*>(y);
  auto t = fl::Tensor(fl::where(*cond_ptr, *x_ptr, *y_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sort(void* tensor, uint32_t dim) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::Tensor(fl::sort(*tensor_ptr, dim));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _add(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::add(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sub(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::sub(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _mul(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::mul(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _div(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::div(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _eq(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::eq(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _neq(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::neq(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _lessThan(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::lessThan(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _lessThanEqual(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::lessThanEqual(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _greaterThan(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::greaterThan(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _greaterThanEqual(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::greaterThanEqual(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _logicalOr(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::logicalOr(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _logicalAnd(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::logicalAnd(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _mod(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::mod(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _bitwiseAnd(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::bitwiseAnd(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _bitwiseOr(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::bitwiseOr(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _bitwiseXor(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::bitwiseXor(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _lShift(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::lShift(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _rShift(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::rShift(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _minimum(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::minimum(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _maximum(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::maximum(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _power(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::Tensor(fl::power(*tensor_ptr, *other_ptr));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _matmul(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  if (g_row_major) {
    auto t = fl::Tensor(fl::matmul(*other_ptr, *tensor_ptr));
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } else {
    auto t = fl::Tensor(fl::matmul(*tensor_ptr, *other_ptr));
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  }
}

void* _amin(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::amin(*tensor_ptr, axes, keep_dims));

  if (keep_dims && t.ndim() == 0) {
    std::vector<fl::Dim> shape_v(tensor_ptr->ndim(), 1);
    const auto& shape = fl::Shape(shape_v);
    t = fl::reshape(t, shape);
  }

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _amax(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::amax(*tensor_ptr, axes, keep_dims));

  if (keep_dims && t.ndim() == 0) {
    std::vector<fl::Dim> shape_v(tensor_ptr->ndim(), 1);
    const auto& shape = fl::Shape(shape_v);
    t = fl::reshape(t, shape);
  }

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _argmin(void* tensor, int32_t axis, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto used_axis = axisArg(axis, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::argmin(*tensor_ptr, used_axis, keep_dims));

  if (keep_dims && t.ndim() == 0) {
    std::vector<fl::Dim> shape_v(tensor_ptr->ndim(), 1);
    const auto& shape = fl::Shape(shape_v);
    t = fl::reshape(t, shape);
  }

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _argmax(void* tensor, int32_t axis, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto used_axis = axisArg(axis, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::argmax(*tensor_ptr, used_axis, keep_dims));

  if (keep_dims && t.ndim() == 0) {
    std::vector<fl::Dim> shape_v(tensor_ptr->ndim(), 1);
    const auto& shape = fl::Shape(shape_v);
    t = fl::reshape(t, shape);
  }

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sum(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::sum(*tensor_ptr, axes, keep_dims));

  if (keep_dims && t.ndim() == 0) {
    std::vector<fl::Dim> shape_v(tensor_ptr->ndim(), 1);
    const auto& shape = fl::Shape(shape_v);
    t = fl::reshape(t, shape);
  }

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _cumsum(void* tensor, int32_t axis) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto used_axis = axisArg(axis, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::cumsum(*tensor_ptr, used_axis));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _mean(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::mean(*tensor_ptr, axes, keep_dims));

  if (keep_dims && t.ndim() == 0) {
    std::vector<fl::Dim> shape_v(tensor_ptr->ndim(), 1);
    const auto& shape = fl::Shape(shape_v);
    t = fl::reshape(t, shape);
  }

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _median(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::median(*tensor_ptr, axes, keep_dims));

  if (keep_dims && t.ndim() == 0) {
    std::vector<fl::Dim> shape_v(tensor_ptr->ndim(), 1);
    const auto& shape = fl::Shape(shape_v);
    t = fl::reshape(t, shape);
  }

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _var(void* tensor,
           void* axes_ptr,
           int64_t axes_len,
           bool bias,
           bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::var(*tensor_ptr, axes, bias, keep_dims));

  if (keep_dims && t.ndim() == 0) {
    std::vector<fl::Dim> shape_v(tensor_ptr->ndim(), 1);
    const auto& shape = fl::Shape(shape_v);
    t = fl::reshape(t, shape);
  }

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _std(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::std(*tensor_ptr, axes, keep_dims));

  if (keep_dims && t.ndim() == 0) {
    std::vector<fl::Dim> shape_v(tensor_ptr->ndim(), 1);
    const auto& shape = fl::Shape(shape_v);
    t = fl::reshape(t, shape);
  }

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _norm(void* tensor,
            void* axes_ptr,
            int64_t axes_len,
            double p,
            bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::norm(*tensor_ptr, axes, p, keep_dims));

  if (keep_dims && t.ndim() == 0) {
    std::vector<fl::Dim> shape_v(tensor_ptr->ndim(), 1);
    const auto& shape = fl::Shape(shape_v);
    t = fl::reshape(t, shape);
  }

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _countNonzero(void* tensor,
                    void* axes_ptr,
                    int64_t axes_len,
                    bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::countNonzero(*tensor_ptr, axes, keep_dims));

  if (keep_dims && t.ndim() == 0) {
    std::vector<fl::Dim> shape_v(tensor_ptr->ndim(), 1);
    const auto& shape = fl::Shape(shape_v);
    t = fl::reshape(t, shape);
  }

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _any(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::any(*tensor_ptr, axes, keep_dims));

  if (keep_dims && t.ndim() == 0) {
    std::vector<fl::Dim> shape_v(tensor_ptr->ndim(), 1);
    const auto& shape = fl::Shape(shape_v);
    t = fl::reshape(t, shape);
  }

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _all(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::Tensor(fl::all(*tensor_ptr, axes, keep_dims));

  if (keep_dims && t.ndim() == 0) {
    std::vector<fl::Dim> shape_v(tensor_ptr->ndim(), 1);
    const auto& shape = fl::Shape(shape_v);
    t = fl::reshape(t, shape);
  }

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}
