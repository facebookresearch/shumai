import * as sm from '../tensor'
import * as crypto from 'crypto'
const _unique_id = crypto
  .createHash('sha256')
  .update('' + process.pid + performance.now())
  .digest('hex')
  .slice(0, 8)

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

export function decodeBuffer(buf: ArrayBuffer) {
  const shape_len = new Int32Array(buf, 0, 2)[0]
  const shape = new BigInt64Array(buf, 8 /* 8 byte offset mandated alignement */, shape_len)
  const t = sm.tensor(new Float32Array(buf, 8 + 8 * shape_len))
  return t.reshape(shape)
}

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

export async function tfetch(
  url: string,
  tensor?: sm.Tensor,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: { id?: string; grad_fn?: (grad: any) => Promise<void> }
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
    const t = await decode(buff)
    if (options && options.grad_fn) {
      t.requires_grad = true
      t.grad_callback_async = async () => {
        await options.grad_fn({
          grad_in: t.grad,
          out: t,
          in: tensor
        })
      }
    }
    return t
  }
  return null
}

export function connect(forward_url, backward_url) {
  const backward = async (grad) => {
    // possibly need to continue backward pass
    const jacobian = await tfetch(backward_url, grad.grad_in)
    if (jacobian) {
      await grad.in.backward(jacobian)
    }
  }
  async function forward(t) {
    return await tfetch(forward_url, t, { grad_fn: backward })
  }
  return forward
}

export function serve(request_dict, options) {
  const user_data = {}
  const statistics = {}
  const sub_stat_fn = request_dict.statistics
  request_dict.statistics = async (u) => {
    if (sub_stat_fn) {
      const s = await sub_stat_fn(u)
      return JSON.stringify({ ...s, ...statistics })
    }
    return JSON.stringify(statistics)
  }
  const serve_request = async (req: Request, fn) => {
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

export function serve_model(fn, grad_update, options, req_map) {
  const base_req_map = {
    forward: async (u, input) => {
      const out = await fn(input)
      input.requires_grad = true
      u.backward = async (j) => {
        return [await out.backward(j), input.grad]
      }
      return out
    },
    optimize: async (u, t) => {
      const [ts, grad] = await u.backward(t)
      let ret = null
      if (grad) {
        ret = grad.detach()
      }
      await grad_update(ts)
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
