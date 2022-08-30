import { dlopen, suffix } from 'bun:ffi'
import { ffi_tensor } from './ffi_tensor'
import { ffi_tensor_ops } from './ffi_tensor_ops_gen'

const pkgname = `@shumai/${process.platform}_${process.arch}_shumai_flashlight`
const BINDING_NAME_PREFIX = 'libflashlight_binding'
const path = import.meta.resolveSync(`${pkgname}/${BINDING_NAME_PREFIX}.${suffix}`)
const { symbols: fl } = dlopen(path, {
  ...ffi_tensor,
  ...ffi_tensor_ops
})

export { fl }
