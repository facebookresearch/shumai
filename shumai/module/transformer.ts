import type { Tensor } from '../tensor'
import * as tensor from '../tensor/tensor'
import * as ops from '../tensor/tensor_ops'
import * as util from '../util'
import { Linear } from './linear'
import { Module } from './module'

const sm = { ...ops, ...tensor, util }

export class TransformerPositionalEncoding extends Module {
  static readonly DEFAULT_SEQUENCE_LENGTH = 256
  static readonly ENCODING_BASE = 10000

  private dim: number
  private sequenceLength: number
  private encodingFactors: Tensor
  private encoding: Tensor

  constructor(dim: number, sequenceLength?: number) {
    super()

    if (dim <= 0) {
      throw new Error(`Module dimension must be > 0: got ${dim}`)
    }

    this.dim = dim
    if (sequenceLength === undefined) {
      this.sequenceLength = TransformerPositionalEncoding.DEFAULT_SEQUENCE_LENGTH
    } else if (sequenceLength <= 0) {
      throw new Error(`Initial sequenceLength must be > 0: got ${sequenceLength}`)
    } else {
      this.sequenceLength = sequenceLength
    }

    // base and numerator must be full([1], x) instead of scalar(x)
    // Otherwise, if the other operand has shape [1], the result will be reduced to scalar
    const base = sm.full([1], TransformerPositionalEncoding.ENCODING_BASE)
    const numerator = sm.full([1], 1)
    const denominator = sm.scalar(this.dim)
    const evenDims = sm.arange(0, this.dim + 1, 2)
    this.encodingFactors = numerator.div(base.power(evenDims.div(denominator))) // shape [floor((dim + 1) / 2)]

    this.encoding = this.calculate(0, this.sequenceLength) // shape [sequenceLength, dim]
  }

  calculate(start: number, end: number): Tensor {
    const length = end - start
    const pairedDim = this.encodingFactors.shape[0]
    const pos = sm.arange(start, end).reshape([length, 1])

    const evenEncoding = sm.sin(pos.mul(this.encodingFactors)).reshape([length, pairedDim, 1])
    const oddEncoding = sm.cos(pos.mul(this.encodingFactors)).reshape([length, pairedDim, 1])
    let encoding = sm.concatenate([evenEncoding, oddEncoding], -1) // shape [length, pairedDim, 2]
    encoding = encoding.reshape([length, pairedDim * 2])

    if (this.dim % 2 !== 0) {
      encoding = encoding.index([':', `:${this.dim}`]).reshape([length, this.dim])
      // reshape is necessary to preserve the last axis if this.dim is 1
    }

    return encoding
  }

  forward(sequenceLength: number): Tensor {
    if (sequenceLength > this.sequenceLength) {
      const extension = this.calculate(this.sequenceLength, sequenceLength)
      this.encoding = sm.concatenate([this.encoding, extension], 0)
      this.sequenceLength = sequenceLength
    }

    if (sequenceLength === this.sequenceLength) {
      return this.encoding
    } else {
      return this.encoding.index([`:${sequenceLength}`, ':'])
    }
  }
}

function checkAttentionInputs(
  attentionDim: number,
  queries: Tensor,
  keys: Tensor,
  values: Tensor,
  mask?: Tensor
) {
  const shape = queries.shape

  if (keys.shape.length !== shape.length || values.shape.length !== shape.length) {
    throw new Error(
      `Input tensors must have the same shape, except the 2nd last axis: queries shape ${shape}, keys shape ${keys.shape}, values shape ${values.shape}`
    )
  }

  for (let i = 0; i < shape.length; i++) {
    if (shape[i] !== keys.shape[i] || shape[i] !== values.shape[i]) {
      if (i !== shape.length - 2) {
        throw new Error(
          `Input tensors must have the same shape, except the 2nd last axis: queries shape ${shape}, keys shape ${keys.shape}, values shape ${values.shape}`
        )
      } else if (keys.shape[i] !== values.shape[i]) {
        throw new Error(
          `Tensors keys and values must have the same shape: keys shape ${keys.shape}, values shape ${values.shape}`
        )
      }
    }
  }

  const dim = shape[shape.length - 1]
  if (dim !== attentionDim) {
    throw new Error(
      `Last axis of input tensors (${dim}) must match attention dimension (${attentionDim})`
    )
  }

  if (mask !== undefined) {
    const maskShape = mask.shape
    if (
      maskShape.length !== 2 ||
      maskShape[0] !== shape[shape.length - 2] ||
      maskShape[1] !== keys.shape[keys.shape.length - 2]
    ) {
      throw new Error(
        `Mask shape (${maskShape}) must match sequence lengths of queries and keys: must be [${
          shape[shape.length - 2]
        }, ${keys.shape[keys.shape.length - 2]}]`
      )
    }
  }
}

export class TransformerDotProductAttention extends Module {
  private dim: number
  private scaleFactor: Tensor

  constructor(dim: number) {
    super()
    this.dim = dim
    this.scaleFactor = sm.scalar(1 / Math.sqrt(dim))
  }

  protected scale(tensor: Tensor): Tensor {
    return tensor.mul(this.scaleFactor)
  }

  forward(queries: Tensor, keys: Tensor, values: Tensor, mask?: Tensor): Tensor {
    // queries shape [..., queryTokens, dim]
    // keys and values shape [..., keyTokens, dim]
    // mask shape [queryTokens, keyTokens]
    checkAttentionInputs(this.dim, queries, keys, values, mask)

    let output = queries.matmul(keys.T()) // shape [..., queryTokens, keyTokens]

    if (mask !== undefined) {
      const negativeInfinities = sm.full([1], -Infinity).tile(output.shape)
      output = sm.where(mask, negativeInfinities, output)
    }

    output = this.scale(output).softmax(-1)
    output = output.matmul(values) // shape [..., queryTokens, dim]
    return output
  }
}

export class TransformerMultiheadAttention extends Module {
  private dim: number
  private heads: number
  private attentionDim: number
  private queryEmbed: Linear
  private keyEmbed: Linear
  private valueEmbed: Linear
  private attention: TransformerDotProductAttention
  private concatEmbed: Linear

  constructor(dim: number, heads: number, attentionDim?: number) {
    super()

    if (dim % heads !== 0) {
      throw new Error(
        `Model dimensions must be divisible by the number of heads: ${dim} not divisible by ${heads}`
      )
    }

    this.dim = dim
    this.heads = heads
    if (attentionDim === undefined) {
      this.attentionDim = dim / heads
    } else {
      this.attentionDim = attentionDim
    }
    this.queryEmbed = new Linear(dim, this.attentionDim * heads)
    this.keyEmbed = new Linear(dim, this.attentionDim * heads)
    this.valueEmbed = new Linear(dim, this.attentionDim * heads)
    this.attention = new TransformerDotProductAttention(this.attentionDim)
    this.concatEmbed = new Linear(this.attentionDim * heads, dim)
  }

  forward(queries: Tensor, keys: Tensor, values: Tensor): Tensor {
    // queries shape [..., queryTokens, dim]
    // keys and values shape [..., keyTokens, dim]
    checkAttentionInputs(this.dim, queries, keys, values)
    const originalShape = queries.shape

    const queriesReshape = [...originalShape] // shape [..., queryTokens, dim]
    queriesReshape[queriesReshape.length - 1] = this.heads
    queriesReshape.push(this.attentionDim) // shape [..., queryTokens, heads, attentionDim]
    const keysValuesReshape = [...queriesReshape]
    keysValuesReshape[keysValuesReshape.length - 3] = keys.shape[keys.shape.length - 2] // shape [..., keyTokens, heads, attentionDim]

    // Swap 2nd and 3rd last axes
    const transpose = Array.from(sm.util.range(queriesReshape.length))
    transpose[transpose.length - 3] = transpose.length - 2
    transpose[transpose.length - 2] = transpose.length - 3

    queries = this.queryEmbed(queries).reshape(queriesReshape).transpose(transpose)
    keys = this.keyEmbed(keys).reshape(keysValuesReshape).transpose(transpose)
    values = this.valueEmbed(values).reshape(keysValuesReshape).transpose(transpose)
    // embed shape [..., {key|query}Tokens, heads * attentionDim]
    // reshape shape [..., {key|query}Tokens, heads, attentionDim]
    // transpose shape [..., heads, {key|query}Tokens, attentionDim]

    const reverseTranspose = transpose
    const reverseReshape = [...originalShape]
    reverseReshape[reverseReshape.length - 1] = this.heads * this.attentionDim

    let output = this.attention(queries, keys, values) // shape [..., heads, queryTokens, attentionDim]
    output = output.transpose(reverseTranspose) // shape [..., queryTokens, heads, attentionDim]
    output = output.reshape(reverseReshape) // shape [..., queryTokens, heads * attentionDim]
    output = this.concatEmbed(output) // shape [..., queryTokens, dim]

    return output
  }
}
