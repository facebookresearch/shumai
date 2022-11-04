import type { Tensor } from '../tensor'
import * as tensor from '../tensor/tensor'
import * as ops from '../tensor/tensor_ops'
import * as util from '../util'
import { Linear } from './linear'
import { Module } from './module'
import { LayerNorm } from './norm'
import { Sequential } from './sequential'

const sm = { ...ops, ...tensor, util }

/**
 * A module to generate the positional encoding for a Transformer of a given input dimension,
 *
 * $$ \mathrm{PE}_{i, 2z} = \sin \left( \frac{i}{10000^{2z/d}} \right) $$
 *
 * $$ \mathrm{PE}_{i, 2z + 1} = \cos \left( \frac{i}{10000^{2z/d}} \right) $$
 *
 * where $i$ is the sequence position, $2z$ and $2z+1$ are the dimensions of the input embedding, and $d$ is the dimensionality of the input embedding.
 *
 * The multiplicative factors $\frac{1}{10000^{2z/d}}$ are precomputed during object creation as they are constant for all $i$.
 *
 * The full PE is initially precomputed for all $i$ up to 256 (or `initSequenceLength` given in the constructor). If the module is called with a sequence length larger than what has already been computed, the additional PE values are also calculated and then stored.
 */
export class TransformerPositionalEncoding extends Module {
  /**
   * The default `initSequenceLength` if none is supplied in the constructor.
   */
  static readonly DEFAULT_SEQUENCE_LENGTH = 256
  /**
   * The base of the exponent in the positional encoding.
   */
  static readonly ENCODING_BASE = 10000

  private dim: number
  private sequenceLength: number
  private encodingFactors: Tensor
  private encoding: Tensor

  /**
   * @param dim - Number of dimensions of each input embedding
   * @param initSequenceLength - Initial sequence length that the positional embedding should be computed for, or {@link DEFAULT_SEQUENCE_LENGTH} if not specified
   */
  constructor(dim: number, initSequenceLength?: number) {
    super()

    if (dim <= 0) {
      throw new Error(`Module dimension must be > 0: got ${dim}`)
    }

    this.dim = dim
    if (initSequenceLength === undefined) {
      this.sequenceLength = TransformerPositionalEncoding.DEFAULT_SEQUENCE_LENGTH
    } else if (initSequenceLength <= 0) {
      throw new Error(`Initial sequenceLength must be > 0: got ${initSequenceLength}`)
    } else {
      this.sequenceLength = initSequenceLength
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

  /**
   * Calculate positional encodings at a given range of sequence positions.
   *
   * @param start - Start of the range to calculate
   * @param end - End of the range to calculate
   *
   * @returns a Tensor of calculated positional embeddings with shape `[end - start, dim]`
   */
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

  /**
   * @param sequenceLength - Length of the sequence for which the positional embedding should be calculated
   * @returns a Tensor of positional embeddings with shape `[length, dim]`, using precomputed values if available
   */
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

/**
 * Scaled dot-product mechanism as described by Vaswani et al. The {@link scaleFactor} is computed during object creation as $\frac{1}{\sqrt{d}}$, where $d$ is the dimensionality of the inputs.
 */
export class TransformerDotProductAttention extends Module {
  private dim: number
  private scaleFactor: Tensor

  /**
   * @param dim - Number of dimensions of the inputs
   */
  constructor(dim: number) {
    super()
    this.dim = dim
    this.scaleFactor = sm.scalar(1 / Math.sqrt(dim))
  }

  protected scale(tensor: Tensor): Tensor {
    return tensor.mul(this.scaleFactor)
  }

  /**
   * @param queries - Tensor of query embeddings, shape `[..., queryTokens, dim]`
   * @param keys - Tensor of key embeddings, shape `[..., keyTokens, dim]`
   * @param values - Tensor of value embeddings each corresponding to a key, shape `[..., keyTokens, dim]`
   * @param mask - Tensor mask of shape `[queryTokens, keyTokens]` where a 1 in position $(i, j)$ indicates that the $i$th query should not attend to the $j$th key
   * @returns A Tensor of shape `[..., queryTokens, dim]`
   */
  forward(queries: Tensor, keys: Tensor, values: Tensor, mask?: Tensor): Tensor {
    // queries shape [..., queryTokens, dim]
    // keys and values shape [..., keyTokens, dim]
    // mask shape [queryTokens, keyTokens]
    checkAttentionInputs(this.dim, queries, keys, values, mask)

    let output = queries.matmul(keys.T()) // shape [..., queryTokens, keyTokens]

    if (mask !== undefined) {
      if (output.shape.length > 2) {
        // mask.shape.length is always 2
        const tile = output.shape
        tile[tile.length - 1] = 1
        tile[tile.length - 2] = 1
        mask = mask.tile(tile)
      }
      const negativeInfinities = sm.full([1], -Infinity).tile(output.shape)
      output = sm.where(mask, negativeInfinities, output)
    }

    output = this.scale(output).softmax(-1)
    output = output.matmul(values) // shape [..., queryTokens, dim]
    return output
  }
}

/**
 * Multi-head attention mechanism as described by Vaswani et al. The input Tensors are linearly embedded before being passed to {@link TransformerDotProductAttention | scaled dot-product attentions}.
 */
export class TransformerMultiheadAttention extends Module {
  private dim: number
  private heads: number
  private attentionDim: number
  private queryEmbed: Linear
  private keyEmbed: Linear
  private valueEmbed: Linear
  private attention: TransformerDotProductAttention
  private concatEmbed: Linear

  /**
   * @param dim - Number of dimensions of the input embeddings
   * @param heads - Number of heads for the multi-head attention
   * @param attentionDim - Number of dimensions of the further embeddings which are passed to the scaled dot-product attention mechanisms, or `dim` if not specified
   */
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

  /**
   * @param queries - Tensor of query vectors, shape `[..., queryTokens, dim]`
   * @param keys - Tensor of key vectors, shape `[..., keyTokens, dim]`
   * @param values - Tensor of value vectors each corresponding to a key, shape `[..., keyTokens, dim]`
   * @param mask - Tensor mask of shape `[queryTokens, keyTokens]` for the {@link TransformerDotProductAttention}
   * @returns A Tensor of shape `[..., queryTokens, dim]`
   */
  forward(queries: Tensor, keys: Tensor, values: Tensor, mask?: Tensor): Tensor {
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

    let output = this.attention(queries, keys, values, mask) // shape [..., heads, queryTokens, attentionDim]
    output = output.transpose(reverseTranspose) // shape [..., queryTokens, heads, attentionDim]
    output = output.reshape(reverseReshape) // shape [..., queryTokens, heads * attentionDim]
    output = this.concatEmbed(output) // shape [..., queryTokens, dim]

    return output
  }
}

class FeedForward extends Module {
  private dim: number
  private hiddenDim: number
  private affineIn: Linear
  private affineOut: Linear

  constructor(dim: number, hiddenDim?: number) {
    super()
    this.dim = dim
    if (hiddenDim === undefined) {
      this.hiddenDim = dim
    } else {
      this.hiddenDim = hiddenDim
    }
    this.affineIn = new Linear(this.dim, this.hiddenDim)
    this.affineOut = new Linear(this.hiddenDim, this.dim)
  }

  forward(input: Tensor): Tensor {
    // shape [..., dim]
    let output = this.affineIn(input).relu() // shape [..., hiddenDim]
    output = this.affineOut(output) // shape [..., dim]
    return output
  }
}

/**
 * A layer of the Transformer encoder, as described by Vaswani et al, consisting of a {@link TransformerMultiheadAttention | multi-head attention} layer and a fully-connected feed forward network. Both of these use residual connections and are normalised with {@link LayerNorm}.
 */
export class TransformerEncoderLayer extends Module {
  private dim: number
  private heads: number
  private attentionDim: number
  private feedForwardDim: number
  private mha: TransformerMultiheadAttention
  private mhaNorm: LayerNorm
  private ff: FeedForward
  private ffNorm: LayerNorm

  /**
   * @param dim - Number of dimensions of the input embeddings
   * @param heads - Number of heads in the multi-head attention mechanism
   * @param attentionDim - Number of dimensions of the embeddings which are passed to the scaled dot-product attention mechanisms, or `dim` if not specified
   * @param feedForwardDim - Number of dimensions in the hidden layer of the feed forward network, or `dim` if not specified
   */
  constructor(dim: number, heads: number, attentionDim?: number, feedForwardDim?: number) {
    super()

    this.dim = dim
    this.heads = heads
    if (attentionDim === undefined) {
      this.attentionDim = dim
    } else {
      this.attentionDim = attentionDim
    }
    if (feedForwardDim === undefined) {
      this.feedForwardDim = dim
    } else {
      this.feedForwardDim = feedForwardDim
    }

    this.mha = new TransformerMultiheadAttention(this.dim, this.heads, this.attentionDim)
    this.mhaNorm = new LayerNorm([this.dim])
    this.ff = new FeedForward(this.dim, this.feedForwardDim)
    this.ffNorm = new LayerNorm([this.dim])
  }

  /**
   * @param input - Input Tensor of shape `[..., tokens, dim]`
   * @returns A Tensor of shape `[..., tokens, dim]`
   */
  forward(input: Tensor): Tensor {
    // shape [..., tokens, dim]
    let mhaOutput = this.mha(input, input, input) // shape [..., tokens, dim]
    mhaOutput = this.mhaNorm(input.add(mhaOutput))

    let ffOutput = this.ff(mhaOutput) // shape [..., tokens, dim]
    ffOutput = this.ffNorm(mhaOutput.add(ffOutput))

    return ffOutput
  }
}

/**
 * Transformer encoder as described by Vaswani et al containing an arbitrary number of {@link TransformerEncoderLayer | TransformerEncoderLayers}.
 *
 * This module includes the {@link TransformerPositionalEncoding | positional encoding}, but does not include any initial embedding of an input sequence into vectors (which should have been separately done by e.g. word2vec).
 */
export class TransformerEncoder extends Module {
  private dim: number
  private heads: number
  private depth: number
  private attentionDim: number
  private feedForwardDim: number
  private positional: TransformerPositionalEncoding
  private layers: Sequential

  /**
   * @param dim - Number of dimensions of the input embeddings
   * @param heads - Number of heads in each multi-head attention mechanism
   * @param depth - Number of encoder layers
   * @param attentionDim - Number of dimensions of the embeddings which are passed to the scaled dot-product attention mechanisms, or `dim` if not specified
   * @param feedForwardDim - Number of dimensions in the hidden layer of each feed forward network, or `dim` if not specified
   * @param initSequenceLength - Initial sequence length that the positional encoding should be computed for, or {@link TransformerPositionalEncoding.DEFAULT_SEQUENCE_LENGTH} if not specified
   */
  constructor(
    dim: number,
    heads: number,
    depth: number,
    attentionDim?: number,
    feedForwardDim?: number,
    initSequenceLength?: number
  ) {
    super()

    this.dim = dim
    this.heads = heads
    this.depth = depth
    if (attentionDim === undefined) {
      this.attentionDim = dim
    } else {
      this.attentionDim = attentionDim
    }
    if (feedForwardDim === undefined) {
      this.feedForwardDim = dim
    } else {
      this.feedForwardDim = feedForwardDim
    }

    if (initSequenceLength === undefined) {
      this.positional = new TransformerPositionalEncoding(this.dim)
    } else {
      this.positional = new TransformerPositionalEncoding(this.dim, initSequenceLength)
    }

    const layers: TransformerEncoderLayer[] = []
    for (let i = 0; i < this.depth; i++) {
      layers.push(
        new TransformerEncoderLayer(this.dim, this.heads, this.attentionDim, this.feedForwardDim)
      )
    }
    this.layers = new Sequential(...layers)
  }

  /**
   * @param input - Input Tensor of shape `[..., tokens, dim]`
   * @returns A Tensor of shape `[..., tokens, dim]`
   */
  forward(input: Tensor): Tensor {
    // shape [..., tokens, dim]
    const positionalEncoding = this.positional(input.shape[input.shape.length - 2]) // shape [tokens, dim]

    let output = input.add(positionalEncoding) // shape [..., tokens, dim]
    output = this.layers(output) // shape [..., tokens, dim]
    return output
  }
}

/**
 * A layer of the Transformer decoder, as described by Vaswani et al, consisting of a masked {@link TransformerMultiheadAttention | multi-head} self-attention layer, an unmasked {@link TransformerMultiheadAttention | multi-head} cross-attention layer and a fully-connected feed forward network. All of these use residual connections and are normalised with {@link LayerNorm}.
 */
export class TransformerDecoderLayer extends Module {
  private dim: number
  private heads: number
  private attentionDim: number
  private feedForwardDim: number
  private maskedSelfAttention: TransformerMultiheadAttention
  private maskedSelfAttentionNorm: LayerNorm
  private crossAttention: TransformerMultiheadAttention
  private crossAttentionNorm: LayerNorm
  private ff: FeedForward
  private ffNorm: LayerNorm

  /**
   * @param dim - Number of dimensions of the input embeddings
   * @param heads - Number of heads in each multi-head attention mechanism
   * @param attentionDim - Number of dimensions of the embeddings which are passed to the scaled dot-product attention mechanisms, or `dim` if not specified
   * @param feedForwardDim - Number of dimensions in the hidden layer of the feed forward network, or `dim` if not specified
   */
  constructor(dim: number, heads: number, attentionDim?: number, feedForwardDim?: number) {
    super()

    this.dim = dim
    this.heads = heads
    if (attentionDim === undefined) {
      this.attentionDim = dim
    } else {
      this.attentionDim = attentionDim
    }
    if (feedForwardDim === undefined) {
      this.feedForwardDim = dim
    } else {
      this.feedForwardDim = feedForwardDim
    }

    this.maskedSelfAttention = new TransformerMultiheadAttention(
      this.dim,
      this.heads,
      this.attentionDim
    )
    this.maskedSelfAttentionNorm = new LayerNorm([this.dim])
    this.crossAttention = new TransformerMultiheadAttention(this.dim, this.heads, this.attentionDim)
    this.crossAttentionNorm = new LayerNorm([this.dim])
    this.ff = new FeedForward(this.dim, this.feedForwardDim)
    this.ffNorm = new LayerNorm([this.dim])
  }

  /**
   * @param sequenceLength - Length of sequence for which the mask should be generated
   * @returns A Tensor mask of shape `[sequenceLength, sequenceLength]` where row $i$ should have 0s in positions up to $i$ and 1s everywhere else
   */
  static getSelfAttentionMask(sequenceLength: number): Tensor {
    return sm
      .full([sequenceLength, sequenceLength], 1)
      .astype(sm.dtype.BoolInt8)
      .tril()
      .logicalNot()
  }

  /**
   * @param input - Tensor from the previous decoder layer, shape `[..., tokens, dim]`
   * @param encoderOutput - Tensor output by the encoder, shape `[..., encoderTokens, dim]`
   * @returns A Tensor of shape `[..., tokens, dim]`
   */
  forward(input: Tensor, encoderOutput: Tensor): Tensor {
    const decoderLength = input.shape[input.shape.length - 2]
    const mask = TransformerDecoderLayer.getSelfAttentionMask(decoderLength)

    let residual = input
    let output = this.maskedSelfAttention(input, input, input, mask) // shape [..., tokens, dim]
    output = this.maskedSelfAttentionNorm(residual.add(output))

    residual = output
    output = this.crossAttention(output, encoderOutput, encoderOutput) // shape [..., tokens, dim]
    output = this.crossAttentionNorm(residual.add(output))

    residual = output
    output = this.ff(output) // shape [..., tokens, dim]
    output = this.ffNorm(residual.add(output))

    return output
  }
}

/**
 * Transformer decoder as described by Vaswani et al containing an arbitrary number of {@link TransformerDecoderLayer | TransformerDecoderLayers}.
 */
export class TransformerDecoder extends Module {
  private dim: number
  private heads: number
  private depth: number
  private attentionDim: number
  private feedForwardDim: number
  private positional: TransformerPositionalEncoding
  private layers: Sequential

  /**
   * @param dim - Number of dimensions of the input embeddings
   * @param heads - Number of heads in each multi-head attention mechanism
   * @param depth - Number of decoder layers
   * @param attentionDim - Number of dimensions of the embeddings which are passed to the scaled dot-product mechanisms, or `dim` if not specified
   * @param feedForwardDim - Number of dimensions in the hidden layer of each feed forward network, or `dim` if not specified
   * @param initSequenceLength - Initial sequence length that the positional encoding should be computed for, or {@link TransformerPositionalEncoding.DEFAULT_SEQUENCE_LENGTH} if not specified
   */
  constructor(
    dim: number,
    heads: number,
    depth: number,
    attentionDim?: number,
    feedForwardDim?: number,
    initSequenceLength?: number
  ) {
    super()

    this.dim = dim
    this.heads = heads
    this.depth = depth
    if (attentionDim === undefined) {
      this.attentionDim = dim
    } else {
      this.attentionDim = attentionDim
    }
    if (feedForwardDim === undefined) {
      this.feedForwardDim = dim
    } else {
      this.feedForwardDim = feedForwardDim
    }

    if (initSequenceLength === undefined) {
      this.positional = new TransformerPositionalEncoding(this.dim)
    } else {
      this.positional = new TransformerPositionalEncoding(this.dim, initSequenceLength)
    }

    const layers: CallableFunction[] = []
    for (let i = 0; i < this.depth; i++) {
      const layer = new TransformerDecoderLayer(
        this.dim,
        this.heads,
        this.attentionDim,
        this.feedForwardDim
      )
      layers.push((input: Tensor, encoderOutput: Tensor) => [
        layer(input, encoderOutput),
        encoderOutput
      ])
    }
    this.layers = new Sequential(...layers)
  }

  /**
   * @param input - Input Tensor of shape `[..., tokens, dim]`
   * @param encoderOutput - Tensor output by the encoder, shape `[..., encoderTokens, dim]`
   * @returns A Tensor of shape `[..., tokens, dim]`
   */
  forward(input: Tensor, encoderOutput: Tensor): Tensor {
    const positionalEncoding = this.positional(input.shape[input.shape.length - 2]) // shape [tokens, dim]

    let output = input.add(positionalEncoding) // shape [..., tokens, dim]
    output = this.layers(output, encoderOutput)[0] // shape [..., tokens, dim]
    return output
  }
}
