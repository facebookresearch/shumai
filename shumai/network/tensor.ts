import * as crypto from 'crypto'
import * as sm from '../tensor'
import { sleep } from '../util'

const _unique_id = crypto
  .createHash('sha256')
  .update('' + process.pid + performance.now())
  .digest('hex')
  .slice(0, 8)

/** @private */
export function encode(tensor: sm.Tensor): ArrayBuffer {
  const shape = tensor.shape64
  const provenance = tensor.provenance ? BigInt('0x' + tensor.provenance) : BigInt(0xffffffff)
  const flags = (Number(tensor.requires_grad) & 0x1) | ((Number(tensor.requires_stats) & 0x1) << 1)
  // meta_data: ndim, provenance, flags
  const meta_data = new BigInt64Array([BigInt(shape.length), provenance, BigInt(flags)])
  const meta_data_buf = new Uint8Array(meta_data.buffer)
  const shape_buf = new Uint8Array(new BigInt64Array(shape).buffer)
  const tensor_buf = new Uint8Array(tensor.toFloat32Array().buffer)
  const buf = new Uint8Array(meta_data_buf.length + shape_buf.length + tensor_buf.length)
  buf.set(meta_data_buf)
  buf.set(shape_buf, meta_data_buf.length)
  buf.set(tensor_buf, meta_data_buf.length + shape_buf.length)
  return buf.buffer
}

/** @private */
export function decodeBuffer(buf: ArrayBuffer) {
  if (buf.byteLength < 16) {
    throw 'buffer cannot be decoded, too short to parse'
  }
  // meta_data: ndim, provenance, flags
  const meta_data_len = 3
  const meta_data = new BigInt64Array(buf, 0, meta_data_len)
  const shape_len = Number(meta_data[0])
  const provenance = meta_data[1].toString(16)
  const flags = Number(meta_data[2])
  const requires_grad = flags & 0x1
  const requires_stats = !!(flags & 0x2)
  if (shape_len > buf.byteLength) {
    throw `buffer cannot be decoded, invalid shape length: ${shape_len}`
  }
  const shape = new BigInt64Array(buf, 8 * meta_data_len, shape_len)
  const t = sm.tensor(new Float32Array(buf, 8 * meta_data_len + 8 * shape_len)).reshape(shape)
  t.op = 'network'
  t.provenance = provenance ? provenance : null
  t.requires_grad = !!requires_grad
  t.requires_stats = !!requires_stats
  return t
}

/** @private */
export async function decode(obj: Response | ArrayBuffer) {
  if (obj.constructor === Response || obj.constructor === Request) {
    const buf = await obj.arrayBuffer()
    return decodeBuffer(buf)
  } else if (obj.constructor === ArrayBuffer) {
    return decodeBuffer(obj)
  } else {
    throw new Error(`Could not decode object: ${obj}`)
  }
}

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
        body: encode(tensor)
      })
    } else {
      return fetch(url)
    }
  })()
  const buff = await response.arrayBuffer()
  if (buff.byteLength) {
    const t = await decode(buff).catch((err) => {
      throw `tfetched result invalid: ${err}`
    })
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
