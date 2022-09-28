import { dlopen, suffix } from 'bun:ffi'
import { existsSync } from 'fs'
import { cwd } from 'process'
import { ffi_tensor } from './ffi_tensor'
import { ffi_tensor_ops } from './ffi_tensor_ops_gen'

const pkgname = `@shumai/${process.platform}_${process.arch}_shumai_flashlight`
const BINDING_NAME_PREFIX = 'libflashlight_binding'
const path = (() => {
  // If we find libflashlight_binding in the project root, use that instead of
  // an installed version of the library
  const local_path = `${cwd()}/${BINDING_NAME_PREFIX}.${suffix}`
  if (existsSync(local_path)) {
    return local_path
  }
  return import.meta.resolveSync(`${pkgname}/${BINDING_NAME_PREFIX}.${suffix}`)
})()

const { symbols: fl } = (() => {
  try {
    return dlopen(path, {
      ...ffi_tensor,
      ...ffi_tensor_ops
    })
  } catch (error) {
    console.error('Bun trace:', error)
    throw new Error(`shumai was unable to load backing libraries!
    Make sure a valid tensor backend (e.g. ArrayFire) is installed by running,
    for example:
      ${process.platform === 'darwin' ? 'brew install arrayfire' : ''}
      ${process.platform === 'linux' ? 'sudo apt install arrayfire-cuda3-cuda-11-6' : ''}

    or see the ArrayFire documentation
    (https://github.com/arrayfire/arrayfire/wiki/Getting-ArrayFire)
    for installing on your OS / distribution.

    If you're still having trouble, please create an issue
    (https://github.com/facebookresearch/shumai/issues)
    outlining your system and platform details.
    `)
  }
})()

export { fl }
