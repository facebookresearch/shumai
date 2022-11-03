import type { ServeOptions } from 'bun'
import { OptimizerFn } from '../optim'
import * as sm from '../tensor'
import { backoff, decode, encode, tfetch } from './tensor'

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
export function remote_model(url: string, backward_url?: string, error_handler?) {
  let forward_url = `${url}/forward`
  if (!backward_url) {
    backward_url = `${url}/optimize`
  } else {
    forward_url = `${url}`
  }
  const backward = async (ctx) => {
    const jacobian = await backoff(async () => {
      return await tfetch(backward_url, ctx.backward_input)
    }, error_handler)
    return jacobian
  }
  async function forward(t: sm.Tensor) {
    return await backoff(async () => {
      return await tfetch(forward_url, t, { grad_fn: backward })
    }, error_handler)
  }
  return forward
}

export type OpStats = {
  bytes: bigint
  time: number
}

export type TensorOpStats = Record<string, OpStats>

export type RouteStats = {
  hits: number
  seconds: number
  op_stats?: OpStats
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
export function serve(
  request_dict: Record<string, (...args: unknown[]) => Promise<unknown> | unknown | void>,
  options: ServeOptions
) {
  const user_data = {}
  const statistics: Record<string, RouteStats> = {}
  const op_stats: TensorOpStats = {}

  const sub_stat_fn = request_dict.statistics ? request_dict.statistics.bind({}) : null
  request_dict.statistics = async (u) => {
    if (sub_stat_fn) {
      const s = await sub_stat_fn(u)
      return { ...s, statistics, bytes_used: sm.bytesUsed() }
    }
    return { statistics, bytes_used: sm.bytesUsed() }
  }

  const get_user_data = (t) => {
    const user_id = t.provenance
    if (user_data[user_id] === undefined) {
      user_data[user_id] = { id: user_id }
    }
    return user_data[user_id]
  }

  /* TODO: specify a better type than any as its a function */
  const serve_request = async (
    req: Request,
    fn: (...args: unknown[]) => Promise<unknown> | unknown | void
  ) => {
    const buf = await req.arrayBuffer()
    let ret = null
    if (buf.byteLength) {
      const t = await decode(buf)
      ret = await fn(get_user_data(t), t)
      if (ret) {
        ret.provenance = t.provenance
      }
    } else {
      ret = await fn()
    }

    if (ret && ret instanceof sm.Tensor) {
      if (ret.stats !== null) {
        const segments = req.url.split('/')
        const last_seg = segments[segments.length - 1]
        const route = last_seg in request_dict ? last_seg : 'default'
        op_stats[route] = ret.stats
      }
      return new Response(encode(ret))
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
        statistics[route].op_stats = op_stats[route]
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
  fn: (t: sm.Tensor) => sm.Tensor | Promise<sm.Tensor>,
  grad_update: OptimizerFn,
  options: ServeOptions,
  // TODO: pending further type refinement (requires a fn; same comments above)
  req_map?: Record<string, (...args: unknown[]) => Promise<unknown> | unknown | void>
) {
  const base_req_map = {
    /* TODO: Refine type of param `u` */
    forward: async (u: any, input: sm.Tensor) => {
      const out = await fn(input)
      input.requires_grad = true
      u.saved_backward = async (jacobian?: sm.Tensor) => {
        return [await out.backward(jacobian), input.grad]
      }
      return out
    },
    optimize: async (u: any, t: sm.Tensor) => {
      const [ts, grad] = <[sm.Tensor[], sm.Tensor]>await u.saved_backward(t)
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
