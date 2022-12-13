import { Buffer } from 'buffer'
import * as sm from '../tensor'

/** @private */
export function jsonStringifyHandler(key: string, value: any) {
  if (typeof value === 'bigint') {
    return ['bigint', value.toString()] // tuple helps avoid waste
  }
  return value
}

/** @private */
export function jsonParseHandler(key: string, value: any) {
  if (Array.isArray(value) && value[0] === 'bigint') {
    return BigInt(value[1])
  }
  return value
}

export function encodeBinary(tensor: sm.Tensor, props?: object): ArrayBuffer {
  const shape = tensor.shape64
  const provenance = tensor.provenance ? BigInt('0x' + tensor.provenance) : BigInt(0xffffffff)
  const flags = Number(tensor.requires_grad) & 0x1
  // meta_data: ndim, provenance, flags, props_len
  const props_buf = props && Buffer.from(JSON.stringify(props, jsonStringifyHandler))
  const props_len = props_buf ? props_buf.byteLength : 0
  const tensor_buf = new Uint8Array(tensor.toFloat32Array().buffer)
  const tensor_len = tensor_buf.byteLength
  const meta_data = new BigInt64Array([
    BigInt(shape.length),
    provenance,
    BigInt(flags),
    BigInt(tensor_len),
    BigInt(props_len)
  ])
  const meta_data_buf = new Uint8Array(meta_data.buffer)
  const shape_buf = new Uint8Array(new BigInt64Array(shape).buffer)
  const buf = new Uint8Array(
    meta_data_buf.length + shape_buf.length + tensor_buf.length + props_len
  )
  let byteOffset = 0
  buf.set(meta_data_buf, byteOffset)
  byteOffset += meta_data_buf.byteLength
  buf.set(shape_buf, byteOffset)
  byteOffset += shape_buf.byteLength
  buf.set(tensor_buf, byteOffset)
  byteOffset += tensor_buf.byteLength
  if (props_buf) buf.set(props_buf, byteOffset)
  return buf.buffer
}

export function decodeBinary(buf: ArrayBuffer): { tensor: sm.Tensor; props?: object } {
  if (buf.byteLength < 16) {
    throw 'buffer cannot be decoded, too short to parse'
  }
  // meta_data: ndim, provenance, flags
  const meta_data_len = 5
  const meta_data = new BigInt64Array(buf, 0, meta_data_len)
  let byteOffset = 8 * meta_data_len
  const shape_len = Number(meta_data[0])
  const provenance = meta_data[1].toString(16)
  const flags = Number(meta_data[2])
  const tensor_len = Number(meta_data[3])
  const props_len = Number(meta_data[4])
  const requires_grad = flags & 0x1
  const actual_tensor_len = buf.byteLength - 8 * meta_data_len - 8 * shape_len - props_len
  if (tensor_len != actual_tensor_len) {
    throw `buffer cannot be decoded, tensor expected ${tensor_len}B but received ${actual_tensor_len}B`
  }
  const shape = new BigInt64Array(buf, byteOffset, shape_len)
  byteOffset += 8 * shape_len
  const t = sm.tensor(new Float32Array(buf, byteOffset, tensor_len / 4)).reshape(shape)
  byteOffset += tensor_len
  const props = props_len
    ? JSON.parse(Buffer.from(buf, byteOffset, props_len).toString(), jsonParseHandler)
    : void 0
  t.op = 'network'
  t.provenance = provenance ? provenance : null
  t.requires_grad = !!requires_grad
  return { tensor: t, props }
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
  let dtype: sm.dtype = sm.dtype.Float32
  if (typeString !== undefined) {
    dtype = sm.stringToType(typeString)
  }

  // returns array, shape and characters parsed
  function parseTensor(s: string, offset = 0): [number[], number[], number] {
    const total_chars = s.length
    let idx = 1
    if (!s.includes(']') && !s.includes(',')) {
      return [[Number.parseFloat(s)], [], 0]
    }
    if (s[offset] !== '[') {
      throw `Invalid string passed into Tensor parser: found '${s[offset + idx]}', expected '['`
    }
    let array: number[] = []
    let outer_shape = 0
    let inner_shape: number[] | null | 0 = null
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
  }
  const [array, shape] = parseTensor(arrayString.trim())
  // TODO: this is an issue for larger types
  const native_array = new Float32Array(array)
  const t = sm.tensor(native_array).reshape(shape)
  if (dtype !== sm.dtype.Float32) {
    return t.astype(dtype)
  }
  return t
}
