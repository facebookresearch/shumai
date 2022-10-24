import * as ops from '../tensor/tensor_ops'
import * as tensor from '../tensor/tensor'
import * as module from './index'
import * as util from '../util'

import { Module } from './module'
import type { Tensor } from '../tensor'

const sm = { ...ops, ...tensor, module, util }

export class TransformerDotProductAttention extends Module {
  private dim: number
  private scale_factor: Tensor

  constructor(dim: number) {
    super()
    this.dim = dim
    this.scale_factor = sm.scalar(1 / Math.sqrt(dim))
  }

  protected scale(tensor: Tensor): Tensor {
    return tensor.mul(this.scale_factor)
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
  private attn_dim: number
  private query_embed: sm.module.Linear
  private key_embed: sm.module.Linear
  private value_embed: sm.module.Linear
  private attention: TransformerDotProductAttention
  private concat_embed: sm.module.Linear

  constructor(dim: number, heads: number, attn_dim?: number) {
    super()

    if (dim % heads !== 0) {
      throw new Error(
        `Model dimensions must be divisible by the number of heads: ${dim} not divisible by ${heads}`
      )
    }

    this.dim = dim
    this.heads = heads
    if (attn_dim === undefined) {
      this.attn_dim = dim / heads
    } else {
      this.attn_dim = attn_dim
    }
    this.query_embed = new sm.module.Linear(dim, this.attn_dim * heads)
    this.key_embed = new sm.module.Linear(dim, this.attn_dim * heads)
    this.value_embed = new sm.module.Linear(dim, this.attn_dim * heads)
    this.attention = new TransformerDotProductAttention(this.attn_dim)
    this.concat_embed = new sm.module.Linear(this.attn_dim * heads, dim)
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
    reshape.push(this.attn_dim) // [..., tokens, heads, attn_dim]

    // Swap 2nd and 3rd last axes
    const transpose = Array.from(sm.util.range(reshape.length))
    transpose[transpose.length - 3] = transpose.length - 2
    transpose[transpose.length - 2] = transpose.length - 3

    queries = this.query_embed(queries).reshape(reshape).transpose(transpose)
    keys = this.key_embed(keys).reshape(reshape).transpose(transpose)
    values = this.value_embed(values).reshape(reshape).transpose(transpose)
    // embed shape [..., tokens, heads * attn_dim]
    // reshape shape [..., tokens, heads, attn_dim]
    // transpose shape [..., heads, tokens, attn_dim]

    const reverseTranspose = transpose
    const reverseReshape = [...shape]
    reverseReshape[reverseReshape.length - 1] = this.heads * this.attn_dim

    let output = this.attention(queries, keys, values) // shape [..., heads, tokens, attn_dim]
    output = output.transpose(reverseTranspose) // shape [..., tokens, heads, attn_dim]
    output = output.reshape(reverseReshape) // shape [..., tokens, heads * attn_dim]
    output = this.concat_embed(output) // shape [batch, tokens, dim]

    return output
  }
}
