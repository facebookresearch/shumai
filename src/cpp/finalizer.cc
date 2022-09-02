#include <iostream>
#include <node_api.h>

#include "flashlight/fl/tensor/tensor.h"

#define DOUBLE_ENCODE_OFFSET_BIT 49
#define DOUBLE_ENCODE_OFFSET (1ll << DOUBLE_ENCODE_OFFSET_BIT)

extern "C" {

void deleter(napi_env env, void *t, void * /*ignore*/) {
  auto *tensor = reinterpret_cast<fl::Tensor *>(t);
  delete tensor;
}

napi_value finalize(napi_env env, napi_callback_info info) {
  napi_value this_arg;
  napi_value argv[2];
  size_t argc = 2;
  auto status = napi_get_cb_info(env, info, &argc, argv, &this_arg, NULL);
  // grab the 2nd argument directly
  int64_t ptr_int = ((int64_t *)info)[7];
  void *ptr = (void *)(ptr_int - DOUBLE_ENCODE_OFFSET);
  auto *tensor = reinterpret_cast<fl::Tensor *>(ptr);
  int64_t adjusted;
  napi_adjust_external_memory(env, tensor->bytes(), &adjusted);
  napi_add_finalizer(env, argv[0], ptr, deleter, NULL, NULL);
  return (napi_value)0xaaaaaa;
}

napi_value napi_register_module_v1(napi_env env, napi_value exports) {
  napi_property_descriptor desc = {"finalize", 0, finalize,     0,
                                   0,          0, napi_default, 0};
  auto status = napi_define_properties(env, exports, 1, &desc);
  return exports;
}
}
