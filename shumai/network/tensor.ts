import * as crypto from 'crypto'
import { decodeBinary, encodeBinary } from '../io'
import * as sm from '../tensor'
import { sleep } from '../util'

const _unique_id = crypto
  .createHash('sha256')
  .update('' + process.pid + performance.now())
  .digest('hex')
  .slice(0, 8)

/** @private */
export async function backoff(callback, error_handler?) {
  let err = null
  // 1 second of exponential backoff before error
  for (let i = 0; i < 10; ++i) {
    if (i) {
      await sleep(Math.pow(2, i))
    }
    try {
      return await callback()
    } catch (e) {
      err = e
      if (!e.toString().includes('Connection')) {
        break
      }
    }
  }
  if (error_handler) {
    await error_handler(err)
  } else {
    throw `Error found after 10 attempts: ${err}`
  }
}
/**
 * Similar to the Web standard {@link https://developer.mozilla.org/en-US/docs/Web/API/fetch | fetch} API, this function enables asynchronous transfer of remote tensors.
 *
 * @example
 *
 * The function can be used with the `await` keyword:
 *
 * ```javascript
 * // input and output at once
 * const i = sm.randn([128])
 * const t = await sm.network.tfetch('localhost:3000', i)
 *
 * // no expected return value
 * await sm.network.tfetch('localhost:3000', i)
 *
 * // no input
 * const t = await sm.network.tfetch('localhost:3000')
 * ```
 *
 * or with a chained callbacks:
 *
 * ```javascript
 * sm.network.tfetch('localhost:3000', i).then((t) => {
 *   // t is a tensor or null
 *   if (t) {
 *     console.log(t.shape)
 *   }
 * }).catch((err) => {
 *   console.log('hit an error retrieving this tensor...')
 * })
 * ```
 *
 * @param url - The location to either send or request the tensor from.
 * @param tensor - An optional tensor that will be sent to the remote location.
 * @returns A tensor from the remote location or null (if the response is empty)
 */
export async function tfetch(
  url: string,
  tensor?: sm.Tensor,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: { id?: string; grad_fn?: (grad?: any) => Promise<void | sm.Tensor> }
): Promise<sm.Tensor> {
  let id = _unique_id
  if (options && options.id) {
    id = options.id
  }
  const response = await (() => {
    if (tensor) {
      if (!tensor.provenance) {
        tensor.provenance = id
      }
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: encodeBinary(tensor)
      })
    } else {
      return fetch(url)
    }
  })()
  const buff = await response.arrayBuffer()
  if (buff.byteLength) {
    let t = null
    try {
      t = decodeBinary(buff)
    } catch (err) {
      throw `tfetched result invalid: ${err}`
    }
    if (options && options.grad_fn) {
      t.requires_grad = true
      tensor.requires_grad = true
      t.setDeps([tensor])
      t.grad_callback_async = options.grad_fn
    }
    return t
  }
  return null
}
