import type { Tensor } from '../tensor'
import * as tensor from '../tensor/tensor'
import * as ops from '../tensor/tensor_ops'
import * as util from '../util'
import { Linear } from './linear'
import { Module } from './module'

const sm = { ...ops, ...tensor, util }

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

  forward(queries: Tensor, keys: Tensor, values: Tensor): Tensor {
    // shape [..., tokens, dim]
    const shape = queries.shape
    for (let i = 0; i < shape.length; i++) {
      if (shape[i] !== keys.shape[i] || shape[i] !== values.shape[i]) {
        throw new Error(
          `Input tensors should have the same shape: queries shape ${shape}, keys shape ${keys.shape}, values shape ${values.shape}`
        )
      }
    }

    const dim = shape[shape.length - 1]
    if (dim !== this.dim) {
      throw new Error(
        `Last axis of input tensors (shape ${shape}) must match module dimensions (${this.dim})`
      )
    }

    let output = queries.matmul(keys.T()) // shape [..., tokens, tokens]
    output = this.scale(output).softmax(-1)
    output = output.matmul(values) // shape [..., tokens, dim]
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
    // shape [..., tokens, dim]
    const shape = queries.shape
    for (let i = 0; i < shape.length; i++) {
      if (shape[i] !== keys.shape[i] || shape[i] !== values.shape[i]) {
        throw new Error(
          `Input tensors should have the same shape: queries shape ${shape}, keys shape ${keys.shape}, values shape ${values.shape}`
        )
      }
    }

    const dim = shape[shape.length - 1]
    if (dim !== this.dim) {
      throw new Error(
        `Last axis of input tensors (shape ${shape}) must match module dimensions (${this.dim})`
      )
    }

    const reshape = [...shape] // [..., tokens, dim]
    reshape[reshape.length - 1] = this.heads
    reshape.push(this.attentionDim) // [..., tokens, heads, attentionDim]

    // Swap 2nd and 3rd last axes
    const transpose = Array.from(sm.util.range(reshape.length))
    transpose[transpose.length - 3] = transpose.length - 2
    transpose[transpose.length - 2] = transpose.length - 3

    queries = this.queryEmbed(queries).reshape(reshape).transpose(transpose)
    keys = this.keyEmbed(keys).reshape(reshape).transpose(transpose)
    values = this.valueEmbed(values).reshape(reshape).transpose(transpose)
    // embed shape [..., tokens, heads * attentionDim]
    // reshape shape [..., tokens, heads, attentionDim]
    // transpose shape [..., heads, tokens, attentionDim]

    const reverseTranspose = transpose
    const reverseReshape = [...shape]
    reverseReshape[reverseReshape.length - 1] = this.heads * this.attentionDim

    let output = this.attention(queries, keys, values) // shape [..., heads, tokens, attentionDim]
    output = output.transpose(reverseTranspose) // shape [..., tokens, heads, attentionDim]
    output = output.reshape(reverseReshape) // shape [..., tokens, heads * attentionDim]
    output = this.concatEmbed(output) // shape [..., tokens, dim]

    return output
  }
}
