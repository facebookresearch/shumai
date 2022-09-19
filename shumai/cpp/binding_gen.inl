
void* _rand(void* shape_ptr, int64_t shape_len) {
  auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
  auto t = fl::rand(fl::Shape(shape));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _randn(void* shape_ptr, int64_t shape_len) {
  auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
  auto t = fl::randn(fl::Shape(shape));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _full(void* shape_ptr, int64_t shape_len, float val) {
  auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
  auto t = fl::full(fl::Shape(shape), val);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _identity(int64_t dim) {
  auto t = fl::identity(dim);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _arange(float start, float end, float step) {
  auto t = fl::arange(start, end, step);
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
  auto t = fl::iota(fl::Shape(dims), fl::Shape(tileDims));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _reshape(void* tensor, void* shape_ptr, int64_t shape_len) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
  auto t = fl::reshape(*tensor_ptr, fl::Shape(shape));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _transpose(void* tensor, void* axes_ptr, int64_t axes_len) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<long long>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::transpose(*tensor_ptr, fl::Shape(axes));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _tile(void* tensor, void* shape_ptr, int64_t shape_len) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
  auto t = fl::tile(*tensor_ptr, fl::Shape(shape));
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _nonzero(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::nonzero(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _negative(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::negative(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _logicalNot(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::logicalNot(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _exp(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::exp(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _log(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::log(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _log1p(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::log1p(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sin(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::sin(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _cos(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::cos(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sqrt(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::sqrt(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _tanh(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::tanh(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _floor(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::floor(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _ceil(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::ceil(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _rint(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::rint(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _absolute(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::absolute(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _abs(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::abs(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sigmoid(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::sigmoid(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _erf(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::erf(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _flip(void* tensor, uint32_t dim) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::flip(*tensor_ptr, dim);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _clip(void* tensor, void* low, void* high) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* low_ptr = reinterpret_cast<fl::Tensor*>(low);
  auto* high_ptr = reinterpret_cast<fl::Tensor*>(high);
  auto t = fl::clip(*tensor_ptr, *low_ptr, *high_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _roll(void* tensor, int shift, int32_t axis) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto used_axis = axisArg(axis, g_row_major, tensor_ptr->ndim());
  auto t = fl::roll(*tensor_ptr, shift, used_axis);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _isnan(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::isnan(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _isinf(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::isinf(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sign(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::sign(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _tril(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::tril(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _triu(void* tensor) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::triu(*tensor_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _where(void* cond, void* x, void* y) {
  auto* cond_ptr = reinterpret_cast<fl::Tensor*>(cond);
  auto* x_ptr = reinterpret_cast<fl::Tensor*>(x);
  auto* y_ptr = reinterpret_cast<fl::Tensor*>(y);
  auto t = fl::where(*cond_ptr, *x_ptr, *y_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sort(void* tensor, uint32_t dim) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto t = fl::sort(*tensor_ptr, dim);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _add(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::add(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sub(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::sub(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _mul(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::mul(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _div(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::div(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _eq(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::eq(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _neq(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::neq(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _lessThan(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::lessThan(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _lessThanEqual(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::lessThanEqual(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _greaterThan(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::greaterThan(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _greaterThanEqual(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::greaterThanEqual(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _logicalOr(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::logicalOr(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _logicalAnd(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::logicalAnd(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _mod(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::mod(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _bitwiseAnd(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::bitwiseAnd(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _bitwiseOr(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::bitwiseOr(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _bitwiseXor(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::bitwiseXor(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _lShift(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::lShift(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _rShift(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::rShift(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _minimum(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::minimum(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _maximum(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::maximum(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _power(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  auto t = fl::power(*tensor_ptr, *other_ptr);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _matmul(void* tensor, void* other) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
  if (g_row_major) {
    auto t = fl::matmul(*other_ptr, *tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } else {
    auto t = fl::matmul(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  }
}

void* _amin(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::amin(*tensor_ptr, axes, keep_dims);

  auto axes_set = std::unordered_set<int>(axes.begin(), axes.end());

  auto base_shape = tensor_ptr->shape().get();
  std::vector<fl::Dim> new_shape;
  for (auto idx = 0; idx < base_shape.size(); ++idx) {
    if (axes_set.count(idx) || (axes_set.size() == 0)) {
      if (keep_dims) {
        new_shape.emplace_back(1);
      }
      continue;
    }
    new_shape.emplace_back(base_shape[idx]);
  }
  const auto& shape = fl::Shape(new_shape);
  t = fl::reshape(t, shape);

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _amax(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::amax(*tensor_ptr, axes, keep_dims);

  auto axes_set = std::unordered_set<int>(axes.begin(), axes.end());

  auto base_shape = tensor_ptr->shape().get();
  std::vector<fl::Dim> new_shape;
  for (auto idx = 0; idx < base_shape.size(); ++idx) {
    if (axes_set.count(idx) || (axes_set.size() == 0)) {
      if (keep_dims) {
        new_shape.emplace_back(1);
      }
      continue;
    }
    new_shape.emplace_back(base_shape[idx]);
  }
  const auto& shape = fl::Shape(new_shape);
  t = fl::reshape(t, shape);

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _argmin(void* tensor, int32_t axis, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto used_axis = axisArg(axis, g_row_major, tensor_ptr->ndim());
  auto t = fl::argmin(*tensor_ptr, used_axis, keep_dims);

  auto axes_set = std::unordered_set<int>{static_cast<int>(used_axis)};
  auto base_shape = tensor_ptr->shape().get();
  std::vector<fl::Dim> new_shape;
  for (auto idx = 0; idx < base_shape.size(); ++idx) {
    if (axes_set.count(idx) || (axes_set.size() == 0)) {
      if (keep_dims) {
        new_shape.emplace_back(1);
      }
      continue;
    }
    new_shape.emplace_back(base_shape[idx]);
  }
  const auto& shape = fl::Shape(new_shape);
  t = fl::reshape(t, shape);

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _argmax(void* tensor, int32_t axis, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto used_axis = axisArg(axis, g_row_major, tensor_ptr->ndim());
  auto t = fl::argmax(*tensor_ptr, used_axis, keep_dims);

  auto axes_set = std::unordered_set<int>{static_cast<int>(used_axis)};
  auto base_shape = tensor_ptr->shape().get();
  std::vector<fl::Dim> new_shape;
  for (auto idx = 0; idx < base_shape.size(); ++idx) {
    if (axes_set.count(idx) || (axes_set.size() == 0)) {
      if (keep_dims) {
        new_shape.emplace_back(1);
      }
      continue;
    }
    new_shape.emplace_back(base_shape[idx]);
  }
  const auto& shape = fl::Shape(new_shape);
  t = fl::reshape(t, shape);

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _sum(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::sum(*tensor_ptr, axes, keep_dims);

  auto axes_set = std::unordered_set<int>(axes.begin(), axes.end());

  auto base_shape = tensor_ptr->shape().get();
  std::vector<fl::Dim> new_shape;
  for (auto idx = 0; idx < base_shape.size(); ++idx) {
    if (axes_set.count(idx) || (axes_set.size() == 0)) {
      if (keep_dims) {
        new_shape.emplace_back(1);
      }
      continue;
    }
    new_shape.emplace_back(base_shape[idx]);
  }
  const auto& shape = fl::Shape(new_shape);
  t = fl::reshape(t, shape);

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _cumsum(void* tensor, int32_t axis) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto used_axis = axisArg(axis, g_row_major, tensor_ptr->ndim());
  auto t = fl::cumsum(*tensor_ptr, used_axis);
  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _mean(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::mean(*tensor_ptr, axes, keep_dims);

  auto axes_set = std::unordered_set<int>(axes.begin(), axes.end());

  auto base_shape = tensor_ptr->shape().get();
  std::vector<fl::Dim> new_shape;
  for (auto idx = 0; idx < base_shape.size(); ++idx) {
    if (axes_set.count(idx) || (axes_set.size() == 0)) {
      if (keep_dims) {
        new_shape.emplace_back(1);
      }
      continue;
    }
    new_shape.emplace_back(base_shape[idx]);
  }
  const auto& shape = fl::Shape(new_shape);
  t = fl::reshape(t, shape);

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _median(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::median(*tensor_ptr, axes, keep_dims);

  auto axes_set = std::unordered_set<int>(axes.begin(), axes.end());

  auto base_shape = tensor_ptr->shape().get();
  std::vector<fl::Dim> new_shape;
  for (auto idx = 0; idx < base_shape.size(); ++idx) {
    if (axes_set.count(idx) || (axes_set.size() == 0)) {
      if (keep_dims) {
        new_shape.emplace_back(1);
      }
      continue;
    }
    new_shape.emplace_back(base_shape[idx]);
  }
  const auto& shape = fl::Shape(new_shape);
  t = fl::reshape(t, shape);

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
  auto t = fl::var(*tensor_ptr, axes, bias, keep_dims);

  auto axes_set = std::unordered_set<int>(axes.begin(), axes.end());

  auto base_shape = tensor_ptr->shape().get();
  std::vector<fl::Dim> new_shape;
  for (auto idx = 0; idx < base_shape.size(); ++idx) {
    if (axes_set.count(idx) || (axes_set.size() == 0)) {
      if (keep_dims) {
        new_shape.emplace_back(1);
      }
      continue;
    }
    new_shape.emplace_back(base_shape[idx]);
  }
  const auto& shape = fl::Shape(new_shape);
  t = fl::reshape(t, shape);

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _std(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::std(*tensor_ptr, axes, keep_dims);

  auto axes_set = std::unordered_set<int>(axes.begin(), axes.end());

  auto base_shape = tensor_ptr->shape().get();
  std::vector<fl::Dim> new_shape;
  for (auto idx = 0; idx < base_shape.size(); ++idx) {
    if (axes_set.count(idx) || (axes_set.size() == 0)) {
      if (keep_dims) {
        new_shape.emplace_back(1);
      }
      continue;
    }
    new_shape.emplace_back(base_shape[idx]);
  }
  const auto& shape = fl::Shape(new_shape);
  t = fl::reshape(t, shape);

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
  auto t = fl::norm(*tensor_ptr, axes, p, keep_dims);

  auto axes_set = std::unordered_set<int>(axes.begin(), axes.end());

  auto base_shape = tensor_ptr->shape().get();
  std::vector<fl::Dim> new_shape;
  for (auto idx = 0; idx < base_shape.size(); ++idx) {
    if (axes_set.count(idx) || (axes_set.size() == 0)) {
      if (keep_dims) {
        new_shape.emplace_back(1);
      }
      continue;
    }
    new_shape.emplace_back(base_shape[idx]);
  }
  const auto& shape = fl::Shape(new_shape);
  t = fl::reshape(t, shape);

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
  auto t = fl::countNonzero(*tensor_ptr, axes, keep_dims);

  auto axes_set = std::unordered_set<int>(axes.begin(), axes.end());

  auto base_shape = tensor_ptr->shape().get();
  std::vector<fl::Dim> new_shape;
  for (auto idx = 0; idx < base_shape.size(); ++idx) {
    if (axes_set.count(idx) || (axes_set.size() == 0)) {
      if (keep_dims) {
        new_shape.emplace_back(1);
      }
      continue;
    }
    new_shape.emplace_back(base_shape[idx]);
  }
  const auto& shape = fl::Shape(new_shape);
  t = fl::reshape(t, shape);

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _any(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::any(*tensor_ptr, axes, keep_dims);

  auto axes_set = std::unordered_set<int>(axes.begin(), axes.end());

  auto base_shape = tensor_ptr->shape().get();
  std::vector<fl::Dim> new_shape;
  for (auto idx = 0; idx < base_shape.size(); ++idx) {
    if (axes_set.count(idx) || (axes_set.size() == 0)) {
      if (keep_dims) {
        new_shape.emplace_back(1);
      }
      continue;
    }
    new_shape.emplace_back(base_shape[idx]);
  }
  const auto& shape = fl::Shape(new_shape);
  t = fl::reshape(t, shape);

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}

void* _all(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
  auto axes =
      arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
  auto t = fl::all(*tensor_ptr, axes, keep_dims);

  auto axes_set = std::unordered_set<int>(axes.begin(), axes.end());

  auto base_shape = tensor_ptr->shape().get();
  std::vector<fl::Dim> new_shape;
  for (auto idx = 0; idx < base_shape.size(); ++idx) {
    if (axes_set.count(idx) || (axes_set.size() == 0)) {
      if (keep_dims) {
        new_shape.emplace_back(1);
      }
      continue;
    }
    new_shape.emplace_back(base_shape[idx]);
  }
  const auto& shape = fl::Shape(new_shape);
  t = fl::reshape(t, shape);

  g_bytes_used += t.bytes();
  return new fl::Tensor(t);
}
