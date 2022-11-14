import type { Tensor } from '../tensor';
import { Module } from './module';
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
export declare class TransformerPositionalEncoding extends Module {
    /**
     * The default `initSequenceLength` if none is supplied in the constructor.
     */
    static readonly DEFAULT_SEQUENCE_LENGTH = 256;
    /**
     * The base of the exponent in the positional encoding.
     */
    static readonly ENCODING_BASE = 10000;
    private dim;
    private sequenceLength;
    private encodingFactors;
    private encoding;
    /**
     * @param dim - Number of dimensions of each input embedding
     * @param initSequenceLength - Initial sequence length that the positional embedding should be computed for, or {@link DEFAULT_SEQUENCE_LENGTH} if not specified
     */
    constructor(dim: number, initSequenceLength?: number);
    /**
     * Calculate positional encodings at a given range of sequence positions.
     *
     * @param start - Start of the range to calculate
     * @param end - End of the range to calculate
     *
     * @returns a Tensor of calculated positional embeddings with shape `[end - start, dim]`
     */
    calculate(start: number, end: number): Tensor;
    /**
     * @param sequenceLength - Length of the sequence for which the positional embedding should be calculated
     * @returns a Tensor of positional embeddings with shape `[length, dim]`, using precomputed values if available
     */
    forward(sequenceLength: number): Tensor;
}
/**
 * Scaled dot-product mechanism as described by Vaswani et al. The {@link scaleFactor} is computed during object creation as $\frac{1}{\sqrt{d}}$, where $d$ is the dimensionality of the inputs.
 */
export declare class TransformerDotProductAttention extends Module {
    private dim;
    private scaleFactor;
    /**
     * @param dim - Number of dimensions of the inputs
     */
    constructor(dim: number);
    protected scale(tensor: Tensor): Tensor;
    /**
     * @param queries - Tensor of query embeddings, shape `[..., queryTokens, dim]`
     * @param keys - Tensor of key embeddings, shape `[..., keyTokens, dim]`
     * @param values - Tensor of value embeddings each corresponding to a key, shape `[..., keyTokens, dim]`
     * @param mask - Tensor mask of shape `[queryTokens, keyTokens]` where a 1 in position $(i, j)$ indicates that the $i$th query should not attend to the $j$th key
     * @returns A Tensor of shape `[..., queryTokens, dim]`
     */
    forward(queries: Tensor, keys: Tensor, values: Tensor, mask?: Tensor): Tensor;
}
/**
 * Multi-head attention mechanism as described by Vaswani et al. The input Tensors are linearly embedded before being passed to {@link TransformerDotProductAttention | scaled dot-product attentions}.
 */
export declare class TransformerMultiheadAttention extends Module {
    private dim;
    private heads;
    private attentionDim;
    private queryEmbed;
    private keyEmbed;
    private valueEmbed;
    private attention;
    private concatEmbed;
    /**
     * @param dim - Number of dimensions of the input embeddings
     * @param heads - Number of heads for the multi-head attention
     * @param attentionDim - Number of dimensions of the further embeddings which are passed to the scaled dot-product attention mechanisms, or `dim` if not specified
     */
    constructor(dim: number, heads: number, attentionDim?: number);
    /**
     * @param queries - Tensor of query vectors, shape `[..., queryTokens, dim]`
     * @param keys - Tensor of key vectors, shape `[..., keyTokens, dim]`
     * @param values - Tensor of value vectors each corresponding to a key, shape `[..., keyTokens, dim]`
     * @param mask - Tensor mask of shape `[queryTokens, keyTokens]` for the {@link TransformerDotProductAttention}
     * @returns A Tensor of shape `[..., queryTokens, dim]`
     */
    forward(queries: Tensor, keys: Tensor, values: Tensor, mask?: Tensor): Tensor;
}
/**
 * A layer of the Transformer encoder, as described by Vaswani et al, consisting of a {@link TransformerMultiheadAttention | multi-head attention} layer and a fully-connected feed forward network. Both of these use residual connections and are normalised with {@link LayerNorm}.
 */
export declare class TransformerEncoderLayer extends Module {
    private dim;
    private heads;
    private attentionDim;
    private feedForwardDim;
    private mha;
    private mhaNorm;
    private ff;
    private ffNorm;
    /**
     * @param dim - Number of dimensions of the input embeddings
     * @param heads - Number of heads in the multi-head attention mechanism
     * @param attentionDim - Number of dimensions of the embeddings which are passed to the scaled dot-product attention mechanisms, or `dim` if not specified
     * @param feedForwardDim - Number of dimensions in the hidden layer of the feed forward network, or `dim` if not specified
     */
    constructor(dim: number, heads: number, attentionDim?: number, feedForwardDim?: number);
    /**
     * @param input - Input Tensor of shape `[..., tokens, dim]`
     * @returns A Tensor of shape `[..., tokens, dim]`
     */
    forward(input: Tensor): Tensor;
}
/**
 * Transformer encoder as described by Vaswani et al containing an arbitrary number of {@link TransformerEncoderLayer | TransformerEncoderLayers}.
 *
 * This module includes the {@link TransformerPositionalEncoding | positional encoding}, but does not include any initial embedding of an input sequence into vectors (which should have been separately done by e.g. word2vec).
 */
export declare class TransformerEncoder extends Module {
    private dim;
    private heads;
    private depth;
    private attentionDim;
    private feedForwardDim;
    private positional;
    private layers;
    /**
     * @param dim - Number of dimensions of the input embeddings
     * @param heads - Number of heads in each multi-head attention mechanism
     * @param depth - Number of encoder layers
     * @param attentionDim - Number of dimensions of the embeddings which are passed to the scaled dot-product attention mechanisms, or `dim` if not specified
     * @param feedForwardDim - Number of dimensions in the hidden layer of each feed forward network, or `dim` if not specified
     * @param initSequenceLength - Initial sequence length that the positional encoding should be computed for, or {@link TransformerPositionalEncoding.DEFAULT_SEQUENCE_LENGTH} if not specified
     */
    constructor(dim: number, heads: number, depth: number, attentionDim?: number, feedForwardDim?: number, initSequenceLength?: number);
    /**
     * @param input - Input Tensor of shape `[..., tokens, dim]`
     * @returns A Tensor of shape `[..., tokens, dim]`
     */
    forward(input: Tensor): Tensor;
}
/**
 * A layer of the Transformer decoder, as described by Vaswani et al, consisting of a masked {@link TransformerMultiheadAttention | multi-head} self-attention layer, an unmasked {@link TransformerMultiheadAttention | multi-head} cross-attention layer and a fully-connected feed forward network. All of these use residual connections and are normalised with {@link LayerNorm}.
 */
export declare class TransformerDecoderLayer extends Module {
    private dim;
    private heads;
    private attentionDim;
    private feedForwardDim;
    private maskedSelfAttention;
    private maskedSelfAttentionNorm;
    private crossAttention;
    private crossAttentionNorm;
    private ff;
    private ffNorm;
    /**
     * @param dim - Number of dimensions of the input embeddings
     * @param heads - Number of heads in each multi-head attention mechanism
     * @param attentionDim - Number of dimensions of the embeddings which are passed to the scaled dot-product attention mechanisms, or `dim` if not specified
     * @param feedForwardDim - Number of dimensions in the hidden layer of the feed forward network, or `dim` if not specified
     */
    constructor(dim: number, heads: number, attentionDim?: number, feedForwardDim?: number);
    /**
     * @param sequenceLength - Length of sequence for which the mask should be generated
     * @returns A Tensor mask of shape `[sequenceLength, sequenceLength]` where row $i$ should have 0s in positions up to $i$ and 1s everywhere else
     */
    static getSelfAttentionMask(sequenceLength: number): Tensor;
    /**
     * @param input - Tensor from the previous decoder layer, shape `[..., tokens, dim]`
     * @param encoderOutput - Tensor output by the encoder, shape `[..., encoderTokens, dim]`
     * @returns A Tensor of shape `[..., tokens, dim]`
     */
    forward(input: Tensor, encoderOutput: Tensor): Tensor;
}
/**
 * Transformer decoder as described by Vaswani et al containing an arbitrary number of {@link TransformerDecoderLayer | TransformerDecoderLayers}.
 */
export declare class TransformerDecoder extends Module {
    private dim;
    private heads;
    private depth;
    private attentionDim;
    private feedForwardDim;
    private positional;
    private layers;
    /**
     * @param dim - Number of dimensions of the input embeddings
     * @param heads - Number of heads in each multi-head attention mechanism
     * @param depth - Number of decoder layers
     * @param attentionDim - Number of dimensions of the embeddings which are passed to the scaled dot-product mechanisms, or `dim` if not specified
     * @param feedForwardDim - Number of dimensions in the hidden layer of each feed forward network, or `dim` if not specified
     * @param initSequenceLength - Initial sequence length that the positional encoding should be computed for, or {@link TransformerPositionalEncoding.DEFAULT_SEQUENCE_LENGTH} if not specified
     */
    constructor(dim: number, heads: number, depth: number, attentionDim?: number, feedForwardDim?: number, initSequenceLength?: number);
    /**
     * @param input - Input Tensor of shape `[..., tokens, dim]`
     * @param encoderOutput - Tensor output by the encoder, shape `[..., encoderTokens, dim]`
     * @returns A Tensor of shape `[..., tokens, dim]`
     */
    forward(input: Tensor, encoderOutput: Tensor): Tensor;
}
