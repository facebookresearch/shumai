import type { Errorlike, Server } from 'bun'
import { decodeBinary, encodeBinary } from '../io'
import { Module } from '../module'
import { OptimizerFn } from '../optim'
import { Stats, stats } from '../stats'
import * as sm from '../tensor'
import { backoff, tfetch } from './tensor'

export type RemoteModelOptions = {
  backwardUrl?: string
  errorHandler?: (err: Errorlike) => Promise<void>
}

export type RemoteModelForwardOptions = {
  collectStats?: boolean
}

/**
 * Connect to a remote model as if it were a local differentiable function.
 *
 * @remarks
 *
 * This function assumes a server running {@link network.serve_model | `network.serve_model`}.
 *
 * @example
 *
 * Similar to {@link network.tfetch | `network.tfetch`}, the `await` keyword may be used:
 *
 * ```javascript
 * const model = sm.network.remote_model('localhost:3000')
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
 * @param url - The location of the remote model (must be running {@link network.serve_model | `network.serve_model`}).
 * @returns An asynchronous function that can be invoked with an input tensor.
 */
export function remote_model(
  url: string,
  { backwardUrl, errorHandler }: RemoteModelOptions = {}
): (t: sm.Tensor) => Promise<sm.Tensor> {
  let forwardUrl = `${url}/forward`
  if (!backwardUrl) {
    backwardUrl = `${url}/optimize`
  } else {
    forwardUrl = `${url}`
  }
  const backward = async (ctx): Promise<sm.Tensor> => {
    const collectStats = stats.enabled
    const t: sm.Tensor = await backoff(
      () => tfetch(backwardUrl, ctx.backward_input, { collectStats }),
      errorHandler
    )

    if (t.stats) {
      // merge stats from backward to global
      stats.addRemoteStats(t.stats)
    }

    return t
  }
  return async function forward(
    tensor: sm.Tensor,
    { collectStats = stats.enabled }: RemoteModelForwardOptions = {}
  ): Promise<sm.Tensor> {
    const t: sm.Tensor = await backoff(
      () => tfetch(forwardUrl, tensor, { collectStats, grad_fn: backward }),
      errorHandler
    )

    if (t.stats) {
      // merge stats from forward to global
      stats.addRemoteStats(t.stats)
    }

    return t
  }
}

export type NetworkServeOpts = {
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

// TODO: pending further type refinement (requires a fn; same comments above)
export type ServeRequest = (...args: unknown[]) => Promise<unknown> | unknown | void

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
 *   const t = await sm.network.tfetch(different_server)
 *   return t.mul(sm.rand([128]))
 * }
 *
 * sm.network.serve({
 *   genRandTensor: genRandTensor,
 *   remoteCall: talkToServer
 * })
 * ```
 *
 * The above functions are accessible from a different process with {@link network.tfetch | `network.tfetch`}:
 * ```javascript
 * const t0 = await sm.network.tfetch(`${host}:3000/genRandTensor`)
 * const t1 = await sm.network.tfetch(`${host}:3000/remoteCall`)
 * ```
 *
 * @param request_dict - A map of endpoint names to the underlying (possibly async) function calls.
 * @param options - A set of options passed to the underlying Bun.serve call.
 */
export function serve(request_dict: Record<string, ServeRequest>, options: NetworkServeOpts) {
  const user_data = {}

  const get_user_data = (t) => {
    const user_id = t.provenance
    if (user_data[user_id] === undefined) {
      user_data[user_id] = { id: user_id }
    }
    return user_data[user_id]
  }

  /* TODO: specify a better type than any as its a function */
  const serve_request = async (req: Request, fn: ServeRequest) => {
    const buf = await req.arrayBuffer()
    let ret = null
    let s: Stats
    if (buf.byteLength) {
      const { tensor: t, props } = decodeBinary(buf)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      if (props?.collectStats === true) {
        s = t.stats = new Stats({ enabled: true }) // isolate stats for transfer to requesting host
        // copy identifiers in case global stats has overrides
        s.hostId = stats.hostId
        s.processId = stats.processId
        s.deviceId = stats.deviceId
      }
      ret = await fn(get_user_data(t), t)
      if (ret) {
        ret.provenance = t.provenance
      }
    } else {
      ret = await fn()
    }

    if (ret && ret instanceof sm.Tensor) {
      // even if empty always forward stats if `collectStats` is true
      const props: object = s ? { stats: s.toJSON() } : void 0
      return new Response(encodeBinary(ret, props))
    } else if (ret && ret.constructor === Object) {
      const headers = new Headers([['Content-Type', 'application/json']])
      headers.set('Access-Control-Allow-Origin', '*')
      return new Response(
        JSON.stringify(ret, (key, value) => {
          if (typeof value === 'bigint') {
            return value.toString()
          }
          return value
        }),
        { headers: headers }
      )
    }
    return new Response(ret)
  }
  const fetch_handler = {
    fetch(req: Request): Promise<unknown> {
      const segments = req.url.split('/')
      const last_seg = segments[segments.length - 1]
      const route = last_seg in request_dict ? last_seg : 'default'
      const handler = request_dict[route]
      return handler && serve_request(req, handler)
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
 * This server is to be used with {@link network.remote_model | `network.remote_model`}.
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
 * sm.network.serve_model(model, optimize)
 * ```
 *
 * Additional functions can also be served (as in {@link network.serve | `network.serve`}):
 *
 * ```javascript
 * function extraMethod() {
 *   return sm.identity(7)
 * }
 * sm.network.serve_model(model, sm.optim.sgd, {port:3000}, {
 *   ident: extraMethod
 * })
 * ```
 *
 * @param fn - A function that will run on forward calls
 * @param grad_update - A function that will run on backward calls, with a list of differentiated tensors passed in
 * @param options - An optional list of options passed to the underlying Bun.serve call
 * @param req_map - An optional map of additional handlers passed to the underlying {@link network.serve | `network.serve`} call
 *
 */
export function serve_model(
  fn: ((t: sm.Tensor) => sm.Tensor | Promise<sm.Tensor>) | Module,
  grad_update?: OptimizerFn,
  options?: NetworkServeOpts,
  req_map?: Record<string, ServeRequest>
) {
  const base_req_map = {
    /* TODO: Refine type of param `u` */
    forward: async (u: any, input: sm.Tensor) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - inherits from `Function`: super('...args', 'return this.__self__.forward(...args)')
      const out = await fn(input)
      input.requires_grad = true
      u.saved_backward = async (jacobian?: sm.Tensor) => {
        return [await out.backward(jacobian), input.grad]
      }
      return out
    },
    optimize: async (u: any, t: sm.Tensor) => {
      const [ts, grad] = await u.saved_backward(t)
      let ret: sm.Tensor = null
      if (grad) {
        ret = grad.detach()
      }
      if (grad_update) {
        try {
          await grad_update(ts)
        } catch (e) {
          console.warn(
            `warning: conflict during gradient propagation (${e}), likely due to multiple trainers.  This is being fixed: see https://github.com/facebookresearch/shumai/issues/47`
          )
        }
      }
      return ret
    }
  }
  const port = options && options.port ? options.port : 3000
  console.log(`serving on port ${port}`)
  serve(
    {
      ...base_req_map,
      ...req_map
    },
    options
  )
}
