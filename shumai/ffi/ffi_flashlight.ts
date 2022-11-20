import { dlopen, suffix } from 'bun:ffi'
import { existsSync } from 'fs'
import { cwd } from 'process'
import { ffi_tensor } from './ffi_tensor'
import { ffi_tensor_ops } from './ffi_tensor_ops_gen'

const pkg_paths = [
  `@shumai/${process.platform}_${process.arch}_shumai_flashlight`,
  `@shumai/${process.platform}_${process.arch}_shumai_flashlight_cpu`
]
const shared_lib = `libflashlight_binding.${suffix}`

const files_to_attempt = []

// If we find libflashlight_binding in the project root, use that instead of
// an installed version of the library
const local_path = `${cwd()}/${shared_lib}`
if (existsSync(local_path)) {
  files_to_attempt.push(local_path)
}

for (const pkg_path of pkg_paths) {
  try {
    files_to_attempt.push(import.meta.resolveSync(`${pkg_path}/${shared_lib}`))
  } catch (e) {}
}

let fl = null
let NATIVE_FILE = null

for (const file of files_to_attempt) {
  try {
    const { symbols: _fl } = dlopen(file, {
      ...ffi_tensor,
      ...ffi_tensor_ops
    })
    fl = _fl
    NATIVE_FILE = file
    break
  } catch (error) {
    console.log(`warning: couldn't load ${file} (${error}), falling back...`)
  }
}

if (!fl) {
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

export { fl, NATIVE_FILE }
