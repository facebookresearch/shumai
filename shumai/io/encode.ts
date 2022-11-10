import * as sm from '../tensor'

export function encodeBinary(tensor: sm.Tensor): ArrayBuffer {
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

export function decodeBinary(buf: ArrayBuffer) {
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
function encodeBase64Buffer(buf) {
  const u8 = new Uint8Array(buf)
  const b64encoded = btoa(String.fromCharCode.apply(null, u8))
  return b64encoded
}

/** @private */
function decodeBase64Buffer(s) {
  const blob = atob(s)
  const buf = new ArrayBuffer(blob.length)
  const dv = new DataView(buf)
  for (let i = 0; i < blob.length; i++) {
    dv.setUint8(i, blob.charCodeAt(i))
  }
  return buf
}

export function encodeBase64(tensor: sm.Tensor) {
  return encodeBase64Buffer(encodeBinary(tensor))
}

export function decodeBase64(base64String: string) {
  return decodeBinary(decodeBase64Buffer(base64String))
}

export function encodeReadable(tensor: sm.Tensor) {
  function encodeArray(flat, shape, offset) {
    if (shape.length === 0) {
      return flat[0]
    }
    if (shape.length === 1) {
      const out = []
      for (let i = 0; i < shape[0]; ++i) {
        out.push(flat[offset + i])
      }
      return `[${out.join(', ')}]`
    }
    const out = []
    for (let i = 0; i < shape[0]; ++i) {
      out.push(encodeArray(flat, shape.slice(1), offset + i * shape[1]))
    }
    return `[${out.join(', ')}]`
  }
  const array = encodeArray(tensor.toFloat32Array(), tensor.shape, 0)
  const dtype = sm.typeToString(tensor.dtype)
  return `${array}:${dtype}`
}

export function decodeReadable(readableString: string) {
  const [arrayString, typeString] = readableString.split(':')
  let dtype = sm.dtype.Float32
  if (typeString !== undefined) {
    dtype = sm.stringToType(typeString)
  }

  // returns array, shape and characters parsed
  function parseTensor(s: string, offset = 0) {
    const total_chars = s.length
    let idx = 1
    if (!s.includes(']') && !s.includes(',')) {
      return [[Number.parseFloat(s)], [], 0]
    }
    if (s[offset] !== '[') {
      throw `Invalid string passed into Tensor parser: found '${s[offset + idx]}', expected '['`
    }
    let array = []
    let outer_shape = 0
    let inner_shape = null
    let cur_chars = ''
    const digest = () => {
      if (cur_chars.length) {
        if (inner_shape !== null && inner_shape !== 0) {
          throw `Invalid array (ragged not supported)`
        }
        inner_shape = 0
        array.push(Number(cur_chars))
        cur_chars = ''
      }
    }
    while (idx < total_chars) {
      const char = s[offset + idx]
      if (char === ',' || char === ' ') {
        digest()
        idx += 1
        continue
      } else if (char === '[') {
        const [_array, _shape, _idx] = parseTensor(s, offset + idx)
        idx += _idx
        const same = (a, b) => a.length === b.length && a.every((e, i) => e === b[i])
        if (inner_shape !== null && !same(inner_shape, _shape)) {
          throw `Invalid array (ragged not supported): found inner dim == ${_shape}, expected ${inner_shape}`
        }
        outer_shape += 1
        inner_shape = _shape
        array = array.concat(_array)
      } else if (char === ']') {
        digest()
        let shape = [array.length]
        if (inner_shape !== 0) {
          shape = [outer_shape, ...inner_shape]
        }
        return [array, shape, idx + 1]
      } else {
        cur_chars += char
        idx += 1
      }
    }
    throw `Never found closing ']'`
    return [], 0
  }
  const [array, shape, len] = parseTensor(arrayString.trim())
  // TODO: this is an issue for larger types
  return sm.tensor(new Float32Array(array)).reshape(shape).astype(dtype)
}
