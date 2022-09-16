import * as sm from '../tensor'
import * as crypto from 'crypto'
import type { Errorlike, Server } from 'bun'
import { OptimizerFn } from '../optim'
const _unique_id = crypto
  .createHash('sha256')
  .update('' + process.pid + performance.now())
  .digest('hex')
  .slice(0, 8)

/** @private */
export function encode(tensor: sm.Tensor): ArrayBuffer {
  const shape = tensor.shape64
  const shape_len = new Int32Array([shape.length, 0])
  const shape_len_buf = new Uint8Array(shape_len.buffer)
  const shape_buf = new Uint8Array(new BigInt64Array(shape).buffer)
  const tensor_buf = new Uint8Array(tensor.toFloat32Array().buffer)
  const buf = new Uint8Array(shape_len_buf.length + shape_buf.length + tensor_buf.length)
  buf.set(shape_len_buf)
  buf.set(shape_buf, shape_len_buf.length)
  buf.set(tensor_buf, shape_len_buf.length + shape_buf.length)
  return buf.buffer
}

/** @private */
export function decodeBuffer(buf: ArrayBuffer) {
  if (buf.byteLength < 8) {
    throw 'buffer cannot be decoded'
  }
  const shape_len = new Int32Array(buf, 0, 2)[0]
  if (shape_len > buf.byteLength) {
    throw 'buffer cannot be decoded'
  }
  const shape = new BigInt64Array(buf, 8 /* 8 byte offset mandated alignement */, shape_len)
  const t = sm.tensor(new Float32Array(buf, 8 + 8 * shape_len))
  return t.reshape(shape)
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
 * const t = await sm.io.tfetch('localhost:3000', i)
 *
 * // no expected return value
 * await sm.io.tfetch('localhost:3000', i)
 *
 * // no input
 * const t = await sm.io.tfetch('localhost:3000')
 * ```
 *
 * or with a chained callbacks:
 *
 * ```javascript
 * sm.io.tfetch('localhost:3000', i).then((t) => {
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
  options?: { id?: string; grad_fn?: (grad?: any) => Promise<void> }
): Promise<sm.Tensor> {
  let id = _unique_id
  if (options && options.id) {
    id = options.id
  }
  const response = await (() => {
    if (tensor) {
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream', 'X-Request-ID': id },
        body: encode(tensor)
      })
    } else {
      return fetch(url, {
        headers: { 'X-Request-ID': id }
      })
    }
  })()
  const buff = await response.arrayBuffer()
  if (buff.byteLength) {
    const t = await decode(buff).catch((err) => {
      throw `tfetched result invalid: ${err}`
    })
    if (options && options.grad_fn) {
      t.requires_grad = true
      t.grad_callback_async = async () => {
        const jacobian = await options.grad_fn({
          grad_in: t.grad,
          out: t,
          in: tensor
        })
        return tensor.backward(jacobian)
      }
    }
    return t
  }
  return null
}

/**
 * Connect to a remote model as if it were a local differentiable function.
 *
 * @remarks
 *
 * This function assumes a server running {@link io.serve_model | `io.serve_model`}.
 *
 * @example
 *
 * Similar to {@link io.tfetch | `io.tfetch`}, the `await` keyword may be used:
 *
 * ```javascript
 * const model = sm.io.remote_model('localhost:3000')
 * const input = sm.randn([128])
 * // await is necessary, as model invocation is asynchronous
 * const output = await model(input)
 * const loss = sm.loss.mse(output, reference)
 * // note the use of the await keyword for the backward pass
 * await loss.backward()
 * ```
 * or chained callbacks:
 *
 * ```javascript
 * model(input).then((output) => {
 *   loss_fn(output).backward()
 * }).then(() => {
 *   console.log('backward executed!')
 * })
 * ```
 *
 * @param url - The location of the remote model (must be running {@link io.serve_model | `io.serve_model`}).
 * @returns An asynchronous function that can be invoked with an input tensor.
 */
export function remote_model(url: string, backward_url?: string) {
  let forward_url = `${url}/forward`
  if (!backward_url) {
    backward_url = `${url}/optimize`
  } else {
    forward_url = `${url}`
  }
  const backward = async (grad) => {
    // possibly need to continue backward pass
    const jacobian = await tfetch(backward_url, grad.grad_in)
    if (jacobian) {
      await grad.in.backward(jacobian)
    }
  }
  async function forward(t: sm.Tensor) {
    return tfetch(forward_url, t, { grad_fn: backward })
  }
  return forward
}

/* copy Bun's Serve Type, less fetch as we supply that logic */
export type ServeOpts = {
  port?: string | number
  hostname?: string
  baseURI?: string
  maxRequestBodySize?: number
  development?: boolean
  error?: (
    this: Server,
    request: Errorlike
  ) => Response | Promise<Response> | undefined | Promise<undefined>
}

/**
 * Spawn an HTTP server to handle tensor input and output requests.
 *
 * @remarks
 * This function does not return.  The default port is 3000.
 *
 * @example
 *
 * ```javascript
 * // any function with tensor inputs/outputs can be served
 * function genRandTensor() {
 *   return sm.rand([128])
 * }
 *
 * // async functions can be served as well
 * async function talkToServer() {
 *   const t = await sm.io.tfetch(different_server)
 *   return t.mul(sm.rand([128]))
 * }
 *
 * sm.io.serve({
 *   genRandTensor: genRandTensor,
 *   remoteCall: talkToServer
 * })
 * ```
 *
 * The above functions are accessible from a different process with {@link io.tfetch | `io.tfetch`}:
 * ```javascript
 * const t0 = await sm.io.tfetch(`${host}:3000/genRandTensor`)
 * const t1 = await sm.io.tfetch(`${host}:3000/remoteCall`)
 * ```
 *
 * @param request_dict - A map of endpoint names to the underlying (possibly async) function calls.
 * @param options - A set of options passed to the underlying Bun.serve call.
 */
export function serve(request_dict: Record<string, any>, options: ServeOpts) {
  const user_data = {}
  const statistics = {}

  const sub_stat_fn = request_dict.statistics ? request_dict.statistics.bind({}) : null
  request_dict.statistics = async (u) => {
    if (sub_stat_fn) {
      const s = await sub_stat_fn(u)
      return { ...s, ...statistics }
    }
    return statistics
  }
  /* TODO: specify a better type than any as its a function */
  const serve_request = async (req: Request, fn: any) => {
    // fix for bug in bun
    const user_id = String(req.headers.get('X-Request-ID')).slice(0) + '='
    if (user_data[user_id] === undefined) {
      user_data[user_id] = { id: user_id }
    }
    const buf = await req.arrayBuffer()
    const ret = await (buf.byteLength
      ? fn(user_data[user_id], await decode(buf))
      : fn(user_data[user_id]))
    if (ret && ret.constructor === sm.Tensor) {
      return new Response(encode(ret))
    } else if (ret && ret.constructor === Object) {
      const headers = new Headers([['Content-Type', 'application/json']])
      return new Response(JSON.stringify(ret), { headers: headers })
    }
    return new Response(ret)
  }
  const fetch_handler = {
    async fetch(req: Request) {
      const segments = req.url.split('/')
      const last_seg = segments[segments.length - 1]
      const route = last_seg in request_dict ? last_seg : 'default'
      if (route in request_dict) {
        const t0 = performance.now()
        const res = await serve_request(req, request_dict[route])
        const t1 = performance.now()
        if (!(route in statistics)) {
          statistics[route] = {
            hits: 0,
            seconds: 0
          }
        }
        statistics[route].hits += 1
        statistics[route].seconds += (t1 - t0) / 1e3
        return res
      }
    }
  }
  Bun.serve({
    ...fetch_handler,
    ...options
  })
}

/**
 * Serve a model with forward and optimization endpoints.
 *
 * @remarks
 *
 * This server is to be used with {@link io.remote_model | `io.remote_model`}.
 * The function does not return.
 *
 * @example
 *
 * ```javascript
 * const weight = sm.randn([128, 128]).requireGrad()
 * function model(input) {
 *   return input.matmul(weight).maximum(sm.scalar(0))
 * }
 *
 * function optimize(differentiated_tensors) {
 *   for (let t of differentiated_tensors) {
 *     t.update(t.add(t.grad.mul(sm.scalar(1e-3))))
 *   }
 * }
 * sm.io.serve_model(model, optimize)
 * ```
 *
 * Additional functions can also be served (as in {@link io.serve | `io.serve`}):
 *
 * ```javascript
 * function extraMethod() {
 *   return sm.identity(7)
 * }
 * sm.io.serve_model(model, sm.optim.sgd, {port:3000}, {
 *   ident: extraMethod
 * })
 * ```
 *
 * @param fn - A function that will run on forward calls
 * @param grad_update - A function that will run on backward calls, with a list of differentiated tensors passed in
 * @param options - An optional list of options passed to the underlying Bun.serve call
 * @param req_map - An optional map of additional handlers passed to the underlying {@link io.serve | `io.serve`} call
 *
 */
export function serve_model(
  fn: (t: sm.Tensor) => sm.Tensor | Promise<sm.Tensor>,
  grad_update: OptimizerFn,
  options: ServeOpts,
  // TODO: pending further type refinement (requires a fn; same comments above)
  req_map: Record<string, (...args: any[]) => any | Promise<any>>
) {
  const base_req_map = {
    /* TODO: Refine type of param `u` */
    forward: async (u: any, input: sm.Tensor) => {
      const out = await fn(input)
      input.requires_grad = true
      u.backward = async (jacobian?: sm.Tensor) => {
        return [out.backward(jacobian), input.grad]
      }
      return out
    },
    optimize: async (u: any, t: sm.Tensor) => {
      const [ts, grad] = <[sm.Tensor[], sm.Tensor]>await u.backward(t)
      let ret: sm.Tensor = null
      if (grad) {
        ret = grad.detach()
      }
      if (grad_update) {
        await grad_update(ts)
      }
      return ret
    }
  }
  serve(
    {
      ...base_req_map,
      ...req_map
    },
    options
  )
}
