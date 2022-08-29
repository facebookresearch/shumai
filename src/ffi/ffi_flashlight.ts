import { dlopen, suffix } from 'bun:ffi'
import { ffi_tensor } from './ffi_tensor'
import { ffi_tensor_ops } from './ffi_tensor_ops_gen'

const path = `${__dirname}/../../libflashlight_binding.${suffix}`
const { symbols: fl } = dlopen(path, {
  ...ffi_tensor,
  ...ffi_tensor_ops
})

export { fl }
