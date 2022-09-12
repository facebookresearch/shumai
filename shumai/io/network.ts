import * as sm from '../tensor'

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

export function decode(obj: Response | ArrayBuffer): sm.Tensor {
  function impl(buf) {
    const shape_len = new Int32Array(buf, 0, 2)[0]
    const shape = new BigInt64Array(buf, 8 /* 8 byte offset mandated alignement */, shape_len)
    const t = sm.tensor(new Float32Array(buf, 8 + 8 * shape_len))
    return t.reshape(shape)
  }

  if (obj.constructor === Response) {
    return new Promise((resolve) => {
      obj.arrayBuffer().then((buf) => {
        resolve(impl(buf))
      })
    })
  } else {
    return impl(obj)
  }
}
