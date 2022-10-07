
void* _rand(void* shape_ptr, int64_t shape_len) {
  try {
    LOCK_GUARD

    auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
    auto t = fl::rand(fl::Shape(shape));
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_rand");
  }
}

void* _randn(void* shape_ptr, int64_t shape_len) {
  try {
    LOCK_GUARD

    auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
    auto t = fl::randn(fl::Shape(shape));
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_randn");
  }
}

void* _full(void* shape_ptr, int64_t shape_len, float val) {
  try {
    LOCK_GUARD

    auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
    auto t = fl::full(fl::Shape(shape), val);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_full");
  }
}

void* _identity(int64_t dim) {
  try {
    LOCK_GUARD

    auto t = fl::identity(dim);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_identity");
  }
}

void* _arange(float start, float end, float step) {
  try {
    LOCK_GUARD

    auto t = fl::arange(start, end, step);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_arange");
  }
}

void* _iota(void* dims_ptr,
            int64_t dims_len,
            void* tileDims_ptr,
            int64_t tileDims_len) {
  try {
    LOCK_GUARD

    auto dims = arrayArg<long long>(dims_ptr, dims_len, g_row_major, false);
    auto tileDims =
        arrayArg<long long>(tileDims_ptr, tileDims_len, g_row_major, false);
    auto t = fl::iota(fl::Shape(dims), fl::Shape(tileDims));
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_iota");
  }
}

void* _reshape(void* tensor, void* shape_ptr, int64_t shape_len) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
    auto t = fl::reshape(*tensor_ptr, fl::Shape(shape));
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_reshape");
  }
}

void* _transpose(void* tensor, void* axes_ptr, int64_t axes_len) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto axes = arrayArg<long long>(axes_ptr, axes_len, g_row_major,
                                    tensor_ptr->ndim());
    auto t = fl::transpose(*tensor_ptr, fl::Shape(axes));
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_transpose");
  }
}

void* _tile(void* tensor, void* shape_ptr, int64_t shape_len) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto shape = arrayArg<long long>(shape_ptr, shape_len, g_row_major, false);
    auto t = fl::tile(*tensor_ptr, fl::Shape(shape));
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_tile");
  }
}

void* _nonzero(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::nonzero(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_nonzero");
  }
}

void* _negative(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::negative(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_negative");
  }
}

void* _logicalNot(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::logicalNot(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_logicalNot");
  }
}

void* _exp(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::exp(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_exp");
  }
}

void* _log(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::log(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_log");
  }
}

void* _log1p(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::log1p(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_log1p");
  }
}

void* _sin(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::sin(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_sin");
  }
}

void* _cos(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::cos(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_cos");
  }
}

void* _sqrt(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::sqrt(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_sqrt");
  }
}

void* _tanh(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::tanh(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_tanh");
  }
}

void* _floor(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::floor(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_floor");
  }
}

void* _ceil(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::ceil(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_ceil");
  }
}

void* _rint(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::rint(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_rint");
  }
}

void* _absolute(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::absolute(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_absolute");
  }
}

void* _sigmoid(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::sigmoid(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_sigmoid");
  }
}

void* _erf(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::erf(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_erf");
  }
}

void* _flip(void* tensor, uint32_t dim) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::flip(*tensor_ptr, dim);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_flip");
  }
}

void* _clip(void* tensor, void* low, void* high) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* low_ptr = reinterpret_cast<fl::Tensor*>(low);
    auto* high_ptr = reinterpret_cast<fl::Tensor*>(high);
    auto t = fl::clip(*tensor_ptr, *low_ptr, *high_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_clip");
  }
}

void* _roll(void* tensor, int shift, int32_t axis) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto used_axis = axisArg(axis, g_row_major, tensor_ptr->ndim());
    auto t = fl::roll(*tensor_ptr, shift, used_axis);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_roll");
  }
}

void* _isnan(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::isnan(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_isnan");
  }
}

void* _isinf(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::isinf(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_isinf");
  }
}

void* _sign(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::sign(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_sign");
  }
}

void* _tril(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::tril(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_tril");
  }
}

void* _triu(void* tensor) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::triu(*tensor_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_triu");
  }
}

void* _where(void* cond, void* x, void* y) {
  try {
    LOCK_GUARD

    auto* cond_ptr = reinterpret_cast<fl::Tensor*>(cond);
    auto* x_ptr = reinterpret_cast<fl::Tensor*>(x);
    auto* y_ptr = reinterpret_cast<fl::Tensor*>(y);
    auto t = fl::where(cond_ptr->astype(fl::dtype::b8), *x_ptr, *y_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_where");
  }
}

void* _sort(void* tensor, uint32_t dim) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto t = fl::sort(*tensor_ptr, dim);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_sort");
  }
}

void* _add(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::add(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_add");
  }
}

void* _sub(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::sub(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_sub");
  }
}

void* _mul(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::mul(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_mul");
  }
}

void* _div(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::div(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_div");
  }
}

void* _eq(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::eq(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_eq");
  }
}

void* _neq(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::neq(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_neq");
  }
}

void* _lessThan(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::lessThan(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_lessThan");
  }
}

void* _lessThanEqual(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::lessThanEqual(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_lessThanEqual");
  }
}

void* _greaterThan(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::greaterThan(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_greaterThan");
  }
}

void* _greaterThanEqual(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::greaterThanEqual(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_greaterThanEqual");
  }
}

void* _logicalOr(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::logicalOr(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_logicalOr");
  }
}

void* _logicalAnd(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::logicalAnd(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_logicalAnd");
  }
}

void* _mod(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::mod(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_mod");
  }
}

void* _bitwiseAnd(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::bitwiseAnd(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_bitwiseAnd");
  }
}

void* _bitwiseOr(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::bitwiseOr(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_bitwiseOr");
  }
}

void* _bitwiseXor(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::bitwiseXor(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_bitwiseXor");
  }
}

void* _lShift(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::lShift(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_lShift");
  }
}

void* _rShift(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::rShift(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_rShift");
  }
}

void* _minimum(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::minimum(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_minimum");
  }
}

void* _maximum(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::maximum(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_maximum");
  }
}

void* _power(void* tensor, void* other) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* other_ptr = reinterpret_cast<fl::Tensor*>(other);
    auto t = fl::power(*tensor_ptr, *other_ptr);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_power");
  }
}

void* _matmul(void* tensor, void* other) {
  try {
    LOCK_GUARD

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
  } catch (std::exception const& e) {
    return handleError(e, "_matmul");
  }
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
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto* weights_ptr = reinterpret_cast<fl::Tensor*>(weights);
    auto t =
        fl::conv2d(*tensor_ptr, *weights_ptr, sx, sy, px, py, dx, dy, groups);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_conv2d");
  }
}

void* _amin(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  try {
    LOCK_GUARD

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
  } catch (std::exception const& e) {
    return handleError(e, "_amin");
  }
}

void* _amax(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  try {
    LOCK_GUARD

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
  } catch (std::exception const& e) {
    return handleError(e, "_amax");
  }
}

void* _argmin(void* tensor, int32_t axis, bool keep_dims) {
  try {
    LOCK_GUARD

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
  } catch (std::exception const& e) {
    return handleError(e, "_argmin");
  }
}

void* _argmax(void* tensor, int32_t axis, bool keep_dims) {
  try {
    LOCK_GUARD

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
  } catch (std::exception const& e) {
    return handleError(e, "_argmax");
  }
}

void* _sum(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  try {
    LOCK_GUARD

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
  } catch (std::exception const& e) {
    return handleError(e, "_sum");
  }
}

void* _cumsum(void* tensor, int32_t axis) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto used_axis = axisArg(axis, g_row_major, tensor_ptr->ndim());
    auto t = fl::cumsum(*tensor_ptr, used_axis);
    g_bytes_used += t.bytes();
    return new fl::Tensor(t);
  } catch (std::exception const& e) {
    return handleError(e, "_cumsum");
  }
}

void* _mean(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  try {
    LOCK_GUARD

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
  } catch (std::exception const& e) {
    return handleError(e, "_mean");
  }
}

void* _median(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  try {
    LOCK_GUARD

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
  } catch (std::exception const& e) {
    return handleError(e, "_median");
  }
}

void* _var(void* tensor,
           void* axes_ptr,
           int64_t axes_len,
           bool bias,
           bool keep_dims) {
  try {
    LOCK_GUARD

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
  } catch (std::exception const& e) {
    return handleError(e, "_var");
  }
}

void* _std(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  try {
    LOCK_GUARD

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
  } catch (std::exception const& e) {
    return handleError(e, "_std");
  }
}

void* _norm(void* tensor,
            void* axes_ptr,
            int64_t axes_len,
            double p,
            bool keep_dims) {
  try {
    LOCK_GUARD

    auto* tensor_ptr = reinterpret_cast<fl::Tensor*>(tensor);
    auto axes =
        arrayArg<int>(axes_ptr, axes_len, g_row_major, tensor_ptr->ndim());
    auto t = fl::norm(*tensor_ptr, axes, p, keep_dims);

    if (p == std::numeric_limits<double>::infinity()) {
      t = fl::abs(*tensor_ptr);
      t = fl::amax(t, axes, keep_dims);
    }

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
  } catch (std::exception const& e) {
    return handleError(e, "_norm");
  }
}

void* _countNonzero(void* tensor,
                    void* axes_ptr,
                    int64_t axes_len,
                    bool keep_dims) {
  try {
    LOCK_GUARD

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
  } catch (std::exception const& e) {
    return handleError(e, "_countNonzero");
  }
}

void* _any(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  try {
    LOCK_GUARD

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
  } catch (std::exception const& e) {
    return handleError(e, "_any");
  }
}

void* _all(void* tensor, void* axes_ptr, int64_t axes_len, bool keep_dims) {
  try {
    LOCK_GUARD

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
  } catch (std::exception const& e) {
    return handleError(e, "_all");
  }
}
