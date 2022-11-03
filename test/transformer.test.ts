import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { areSameShape, expectArraysClose, expectThrows, isShape } from './utils'

describe('TransformerPositionalEncoding', () => {
  it('dim=1', () => {
    const module = new sm.module.TransformerPositionalEncoding(1)

    const result = module(3)
    const expected = [0, 1, 2].map((x) => Math.sin(x))
    expect(isShape(result, [3, 1])).toBe(true)
    expectArraysClose(result.toFloat32Array(), expected)
  })
  it('dim=2', () => {
    const module = new sm.module.TransformerPositionalEncoding(2)

    const result = module(3)
    const expected = [0, 0, 1, 1, 2, 2].map((x, i) => (i % 2 ? Math.cos(x) : Math.sin(x)))
    expect(isShape(result, [3, 2])).toBe(true)
    expectArraysClose(result.toFloat32Array(), expected)
  })
  it('dim=3', () => {
    const dim = 3
    const module = new sm.module.TransformerPositionalEncoding(dim)

    const result = module(3)
    const expected = [0, 0, 0, 1, 1, 1, 2, 2, 2].map((x, i) =>
      ((i % dim) % 2 ? Math.cos : Math.sin)(
        x /
          Math.pow(
            sm.module.TransformerPositionalEncoding.ENCODING_BASE,
            ((i % dim) - ((i % dim) % 2 ? 1 : 0)) / dim
          )
      )
    )
    expect(isShape(result, [3, dim])).toBe(true)
    expectArraysClose(result.toFloat32Array(), expected)
  })
  it('dim=4', () => {
    const dim = 4
    const module = new sm.module.TransformerPositionalEncoding(dim)

    const result = module(3)
    const expected = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2].map((x, i) =>
      ((i % dim) % 2 ? Math.cos : Math.sin)(
        x /
          Math.pow(
            sm.module.TransformerPositionalEncoding.ENCODING_BASE,
            ((i % dim) - ((i % dim) % 2 ? 1 : 0)) / dim
          )
      )
    )
    expect(isShape(result, [3, dim])).toBe(true)
    expectArraysClose(result.toFloat32Array(), expected)
  })
  it('init sequence length, dim=4', () => {
    const dim = 4
    const module = new sm.module.TransformerPositionalEncoding(dim, dim)

    const result = module(3)
    const expected = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2].map((x, i) =>
      ((i % dim) % 2 ? Math.cos : Math.sin)(
        x /
          Math.pow(
            sm.module.TransformerPositionalEncoding.ENCODING_BASE,
            ((i % dim) - ((i % dim) % 2 ? 1 : 0)) / dim
          )
      )
    )
    expect(isShape(result, [3, dim])).toBe(true)
    expectArraysClose(result.toFloat32Array(), expected)
  })
  it('extends sequence length, dim=4', () => {
    const dim = 4
    const module = new sm.module.TransformerPositionalEncoding(dim, 2)

    const result = module(3)
    const expected = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2].map((x, i) =>
      ((i % dim) % 2 ? Math.cos : Math.sin)(
        x /
          Math.pow(
            sm.module.TransformerPositionalEncoding.ENCODING_BASE,
            ((i % dim) - ((i % dim) % 2 ? 1 : 0)) / dim
          )
      )
    )
    expect(isShape(result, [3, dim])).toBe(true)
    expectArraysClose(result.toFloat32Array(), expected)
  })
  it('dim=0 is invalid', () => {
    expectThrows(
      () => new sm.module.TransformerPositionalEncoding(0),
      new RegExp('dimension must be > 0')
    )
  })
  it('dim=-1 is invalid', () => {
    expectThrows(
      () => new sm.module.TransformerPositionalEncoding(-1),
      new RegExp('dimension must be > 0')
    )
  })
  it('0 init sequenceLength is invalid', () => {
    expectThrows(
      () => new sm.module.TransformerPositionalEncoding(3, 0),
      new RegExp('sequenceLength must be > 0')
    )
  })
  it('-1 init sequenceLength is invalid', () => {
    expectThrows(
      () => new sm.module.TransformerPositionalEncoding(3, -1),
      new RegExp('sequenceLength must be > 0')
    )
  })
})

describe('TransformerDotProductAttention', () => {
  it('single matching token', () => {
    const module = new sm.module.TransformerDotProductAttention(3)
    const queries = sm.tensor(new Float32Array([0, 0, 1])).reshape([1, 3])
    const keys = sm.tensor(new Float32Array([0, 0, 0.5])).reshape([1, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0])).reshape([1, 3])

    const result = module(queries, keys, values)
    const expected = [1, 0, 0]
    expectArraysClose(result.toFloat32Array(), expected)
    areSameShape(result, queries)
  })
  it('single dissimilar token', () => {
    const module = new sm.module.TransformerDotProductAttention(3)
    const queries = sm.tensor(new Float32Array([0, 0, 1])).reshape([1, 3])
    const keys = sm.tensor(new Float32Array([0, 0.5, 0])).reshape([1, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0])).reshape([1, 3])

    const result = module(queries, keys, values)
    const expected = [1, 0, 0]
    expectArraysClose(result.toFloat32Array(), expected)
    areSameShape(result, queries)
  })
  it('two tokens', () => {
    const module = new sm.module.TransformerDotProductAttention(3)

    const queries = sm.tensor(new Float32Array([0, 0, 1, 0, 1, 0])).reshape([2, 3])
    const keys = sm.tensor(new Float32Array([0, 1, 0.25, 0, 0.5, 1])).reshape([2, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([2, 3])

    const result = module(queries, keys, values)
    areSameShape(result, queries)

    // Result 0 is more value 1 than value 0
    expect(result.index([0, 1]).toFloat32() > result.index([0, 0]).toFloat32()).toBe(true)

    // Result 1 is more value 0 than value 1
    expect(result.index([1, 0]).toFloat32() > result.index([1, 1]).toFloat32()).toBe(true)

    // Query 0 is more skewed than query 1
    expect(result.index([0, 1]).toFloat32() > result.index([1, 0]).toFloat32()).toBe(true)
    expect(result.index([0, 0]).toFloat32() < result.index([1, 1]).toFloat32()).toBe(true)
  })
  it('single query token, two key tokens', () => {
    const module = new sm.module.TransformerDotProductAttention(3)

    const queries = sm.tensor(new Float32Array([0, 0, 1])).reshape([1, 3])
    const keys = sm.tensor(new Float32Array([0, 1, 0.25, 0, 0.5, 1])).reshape([2, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([2, 3])

    const result = module(queries, keys, values)
    areSameShape(result, queries)

    // Result 0 is more value 1 than value 0
    expect(result.index([0, 1]).toFloat32() > result.index([0, 0]).toFloat32()).toBe(true)
  })
  it('two tokens, one masked', () => {
    const module = new sm.module.TransformerDotProductAttention(3)

    const queries = sm.tensor(new Float32Array([0, 0, 1, 0, 1, 0])).reshape([2, 3])
    const keys = sm.tensor(new Float32Array([0, 1, 0.25, 0, 0.5, 1])).reshape([2, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([2, 3])
    const mask = sm.tensor(new Int8Array([0, 1, 0, 0])).reshape([2, 2])

    const result = module(queries, keys, values, mask)
    areSameShape(result, queries)

    // Result 0 is value 0 only
    expectArraysClose(result.index([0, ':']).toFloat32Array(), [1, 0, 0])

    // Result 1 is more value 0 than value 1
    expect(result.index([1, 0]).toFloat32() > result.index([1, 1]).toFloat32()).toBe(true)
  })
  it('two tokens, one masked, batch samples', () => {
    const module = new sm.module.TransformerDotProductAttention(3)

    const queries = sm
      .tensor(new Float32Array([0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1]))
      .reshape([2, 2, 3])
    const keys = sm
      .tensor(new Float32Array([0, 1, 0.25, 0, 0.5, 1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]))
      .reshape([2, 2, 3])
    const values = sm
      .tensor(new Float32Array([1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1]))
      .reshape([2, 2, 3])
    const mask = sm.tensor(new Int8Array([0, 1, 0, 0])).reshape([2, 2])

    const result = module(queries, keys, values, mask)
    areSameShape(result, queries)
  })
  it('batch samples are independent', () => {
    const module = new sm.module.TransformerDotProductAttention(3)

    const singleQueries = sm.tensor(new Float32Array([0, 0, 1, 0, 1, 0])).reshape([2, 3])
    const singleKeys = sm.tensor(new Float32Array([0, 1, 0.25, 0, 0.5, 1])).reshape([2, 3])
    const singleValues = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([2, 3])

    const batchQueries = sm
      .tensor(
        new Float32Array(
          [0, 0, 1, 0, 1, 0].concat([
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random()
          ])
        )
      )
      .reshape([2, 2, 3])
    const batchKeys = sm
      .tensor(
        new Float32Array(
          [0, 1, 0.25, 0, 0.5, 1].concat([
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random()
          ])
        )
      )
      .reshape([2, 2, 3])
    const batchValues = sm
      .tensor(
        new Float32Array(
          [1, 0, 0, 0, 1, 0].concat([
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random()
          ])
        )
      )
      .reshape([2, 2, 3])

    const singleResult = module(singleQueries, singleKeys, singleValues)
    const batchResult = module(batchQueries, batchKeys, batchValues)
    areSameShape(batchResult, batchQueries)

    expectArraysClose(
      batchResult.index([0, ':', ':']).toFloat32Array(),
      singleResult.toFloat32Array()
    )
    areSameShape(batchResult.index([0, ':', ':']), singleResult)
  })
  it('differing shapes (except 2nd last axis) are invalid', () => {
    const module = new sm.module.TransformerDotProductAttention(3)

    const queries = sm
      .tensor(new Float32Array([0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0]))
      .reshape([2, 2, 3])
    const keys = sm.tensor(new Float32Array([0, 1, 0.25, 0, 0.5, 1])).reshape([1, 2, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([1, 2, 3])

    expectThrows(() => module(queries, keys, values), new RegExp('must have the same shape'))
  })
  it('differing shapes (incl 2nd last axis) in keys and values are invalid', () => {
    const module = new sm.module.TransformerDotProductAttention(3)

    const queries = sm.tensor(new Float32Array([0, 1, 0])).reshape([1, 3])
    const keys = sm.tensor(new Float32Array([0, 1, 0.25])).reshape([1, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([2, 3])

    expectThrows(() => module(queries, keys, values), new RegExp('must have the same shape'))
  })
  it('differing dimensionalities are invalid', () => {
    const module = new sm.module.TransformerDotProductAttention(3)

    const queries = sm.tensor(new Float32Array([0, 0, 1, 0, 1, 0])).reshape([2, 3])
    const keys = sm.tensor(new Float32Array([0, 1, 0.25, 0, 0.5, 1])).reshape([2, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([1, 2, 3])

    expectThrows(() => module(queries, keys, values), new RegExp('must have the same shape'))
  })
  it('invalid dimensions', () => {
    const module = new sm.module.TransformerDotProductAttention(4)

    const queries = sm.tensor(new Float32Array([0, 0, 1, 0, 1, 0])).reshape([2, 3])
    const keys = sm.tensor(new Float32Array([0, 1, 0.25, 0, 0.5, 1])).reshape([2, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([2, 3])

    expectThrows(() => module(queries, keys, values), new RegExp('must match attention dimension'))
  })
  it('calculates gradient', () => {
    const module = new sm.module.TransformerDotProductAttention(3)

    const queries = sm
      .tensor(new Float32Array([0, 0, 1, 0, 1, 0]))
      .reshape([2, 3])
      .requireGrad()
    const keys = sm
      .tensor(new Float32Array([0, 1, 0.25, 0, 0.5, 1]))
      .reshape([2, 3])
      .requireGrad()
    const values = sm
      .tensor(new Float32Array([1, 0, 0, 0, 1, 0]))
      .reshape([2, 3])
      .requireGrad()

    const result = module(queries, keys, values).sum()
    result.backward()
    expect(!!queries.grad).toBe(true)
    expect(!!keys.grad).toBe(true)
    expect(!!values.grad).toBe(true)
  })
})

describe('TransformerMultiheadAttention', () => {
  it('single token, single head', () => {
    const module = new sm.module.TransformerMultiheadAttention(3, 1)
    const queries = sm.tensor(new Float32Array([0, 0, 1])).reshape([1, 3])
    const keys = sm.tensor(new Float32Array([0, 0, 0.5])).reshape([1, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0])).reshape([1, 3])

    const result = module(queries, keys, values)
    areSameShape(result, queries)
  })
  it('single token, single head (attentionDim)', () => {
    const module = new sm.module.TransformerMultiheadAttention(3, 1, 7)
    const queries = sm.tensor(new Float32Array([0, 0, 1])).reshape([1, 3])
    const keys = sm.tensor(new Float32Array([0, 0, 0.5])).reshape([1, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0])).reshape([1, 3])

    const result = module(queries, keys, values)
    areSameShape(result, queries)
  })
  it('single token, two heads', () => {
    const module = new sm.module.TransformerMultiheadAttention(6, 2)
    const queries = sm.tensor(new Float32Array([0, 0, 1, 0, 1, 0])).reshape([1, 6])
    const keys = sm.tensor(new Float32Array([0, 0, 0.5, 0.25, 1, 0])).reshape([1, 6])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([1, 6])

    const result = module(queries, keys, values)
    areSameShape(result, queries)
  })
  it('single token, two heads (attentionDim)', () => {
    const module = new sm.module.TransformerMultiheadAttention(6, 2, 7)
    const queries = sm.tensor(new Float32Array([0, 0, 1, 0, 1, 0])).reshape([1, 6])
    const keys = sm.tensor(new Float32Array([0, 0, 0.5, 0.25, 1, 0])).reshape([1, 6])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([1, 6])

    const result = module(queries, keys, values)
    areSameShape(result, queries)
  })
  it('two tokens, two heads', () => {
    const module = new sm.module.TransformerMultiheadAttention(6, 2)
    const queries = sm
      .tensor(new Float32Array([0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1]))
      .reshape([2, 6])
    const keys = sm
      .tensor(new Float32Array([0, 0, 0.5, 0.25, 1, 0, 3, 0, 3, 0, 3, 3]))
      .reshape([2, 6])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0, 3, 3, 3, 0, 0, 3])).reshape([2, 6])

    const result = module(queries, keys, values)
    areSameShape(result, queries)
  })
  it('batch samples are independent', () => {
    const module = new sm.module.TransformerMultiheadAttention(6, 2)

    const singleQueries = sm.tensor(new Float32Array([0, 0, 1, 0, 1, 0])).reshape([1, 6])
    const singleKeys = sm.tensor(new Float32Array([0, 0, 0.5, 0.25, 1, 0])).reshape([1, 6])
    const singleValues = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([1, 6])

    const batchQueries = sm
      .tensor(
        new Float32Array(
          [0, 0, 1, 0, 1, 0].concat([
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random()
          ])
        )
      )
      .reshape([2, 1, 6])
    const batchKeys = sm
      .tensor(
        new Float32Array(
          [0, 0, 0.5, 0.25, 1, 0].concat([
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random()
          ])
        )
      )
      .reshape([2, 1, 6])
    const batchValues = sm
      .tensor(
        new Float32Array(
          [1, 0, 0, 0, 1, 0].concat([
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random()
          ])
        )
      )
      .reshape([2, 1, 6])

    const singleResult = module(singleQueries, singleKeys, singleValues)
    const batchResult = module(batchQueries, batchKeys, batchValues)
    areSameShape(batchResult, batchQueries)

    expectArraysClose(
      batchResult.index([0, ':', ':']).toFloat32Array(),
      singleResult.toFloat32Array()
    )
    areSameShape(batchResult.index([0, ':', ':']), singleResult)
  })
  it('indivisible dimension is invalid', () => {
    expectThrows(
      () => new sm.module.TransformerMultiheadAttention(5, 2),
      new RegExp('must be divisible by the number of heads')
    )
  })
  it('differing shapes (except 2nd last axis) are invalid', () => {
    const module = new sm.module.TransformerMultiheadAttention(6, 2)
    const queries = sm
      .tensor(
        new Float32Array([0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1])
      )
      .reshape([2, 2, 6])
    const keys = sm
      .tensor(new Float32Array([1, 2, 3, 4, 5, 6, 0, 0, 0.5, 0.25, 1, 0]))
      .reshape([1, 2, 6])
    const values = sm
      .tensor(new Float32Array([1, 0, 0, 0, 1, 0, 3, 3, 3, 0, 0, 3]))
      .reshape([1, 2, 6])

    expectThrows(() => module(queries, keys, values), new RegExp('must have the same shape'))
  })
  it('differing shapes (incl 2nd last axis) in keys and values are invalid', () => {
    const module = new sm.module.TransformerMultiheadAttention(6, 2)
    const queries = sm
      .tensor(new Float32Array([0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1]))
      .reshape([2, 6])
    const keys = sm.tensor(new Float32Array([0, 0, 0.5, 0.25, 1, 0])).reshape([1, 6])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0, 3, 3, 3, 0, 0, 3])).reshape([2, 6])

    expectThrows(() => module(queries, keys, values), new RegExp('must have the same shape'))
  })
  it('differing dimensionalities are invalid', () => {
    const module = new sm.module.TransformerMultiheadAttention(6, 2)
    const queries = sm
      .tensor(new Float32Array([0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1]))
      .reshape([2, 6])
    const keys = sm
      .tensor(new Float32Array([0, 0, 0.5, 0.25, 1, 0, 3, 0, 3, 0, 3, 3]))
      .reshape([1, 2, 6])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0, 3, 3, 3, 0, 0, 3])).reshape([2, 6])

    expectThrows(() => module(queries, keys, values), new RegExp('must have the same shape'))
  })
  it('invalid dimensions', () => {
    const module = new sm.module.TransformerMultiheadAttention(8, 2)
    const queries = sm
      .tensor(new Float32Array([0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1]))
      .reshape([2, 6])
    const keys = sm
      .tensor(new Float32Array([0, 0, 0.5, 0.25, 1, 0, 3, 0, 3, 0, 3, 3]))
      .reshape([2, 6])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0, 3, 3, 3, 0, 0, 3])).reshape([2, 6])

    expectThrows(() => module(queries, keys, values), new RegExp('must match attention dimension'))
  })
  it('calculates gradient', () => {
    const module = new sm.module.TransformerMultiheadAttention(6, 2)
    const queries = sm
      .tensor(new Float32Array([0, 0, 1, 0, 1, 0]))
      .reshape([1, 6])
      .requireGrad()
    const keys = sm
      .tensor(new Float32Array([0, 0, 0.5, 0.25, 1, 0]))
      .reshape([1, 6])
      .requireGrad()
    const values = sm
      .tensor(new Float32Array([1, 0, 0, 0, 1, 0]))
      .reshape([1, 6])
      .requireGrad()

    const result = module(queries, keys, values).sum()
    result.backward()
    expect(!!queries.grad).toBe(true)
    expect(!!keys.grad).toBe(true)
    expect(!!values.grad).toBe(true)
  })
})

describe('TransformerEncoderLayer', () => {
  it('single token, two heads', () => {
    const module = new sm.module.TransformerEncoderLayer(6, 2)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])

    const result = module(input)
    areSameShape(result, input)
  })
  it('single token, two heads (attentionDim)', () => {
    const module = new sm.module.TransformerEncoderLayer(6, 2, 7)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])

    const result = module(input)
    areSameShape(result, input)
  })
  it('single token, two heads (feedForwardDim)', () => {
    const module = new sm.module.TransformerEncoderLayer(6, 2, 6, 12)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])

    const result = module(input)
    areSameShape(result, input)
  })
  it('batch samples are independent', () => {
    const module = new sm.module.TransformerEncoderLayer(6, 2)
    const singleInput = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])
    const batchInput = sm
      .tensor(
        new Float32Array(
          [2, 3, 0.5, 0.25, 1, 2.25].concat([
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random()
          ])
        )
      )
      .reshape([2, 1, 6])

    const singleResult = module(singleInput)
    const batchResult = module(batchInput)
    areSameShape(batchResult, batchInput)

    expectArraysClose(
      batchResult.index([0, ':', ':']).toFloat32Array(),
      singleResult.toFloat32Array()
    )
    areSameShape(batchResult.index([0, ':', ':']), singleResult)
  })
  it('calculates gradient', () => {
    const module = new sm.module.TransformerEncoderLayer(6, 2)
    const input = sm
      .tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25]))
      .reshape([1, 6])
      .requireGrad()

    const result = module(input).sum()
    result.backward()
    expect(!!input.grad).toBe(true)
  })
})

describe('TransformerEncoder', () => {
  it('depth=1', () => {
    const module = new sm.module.TransformerEncoder(6, 2, 1)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])

    const result = module(input)
    areSameShape(result, input)
  })
  it('depth=2', () => {
    const module = new sm.module.TransformerEncoder(6, 2, 2)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])

    const result = module(input)
    areSameShape(result, input)
  })
  it('depth=2 (attentionDim)', () => {
    const module = new sm.module.TransformerEncoder(6, 2, 2, 7)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])

    const result = module(input)
    areSameShape(result, input)
  })
  it('depth=2 (feedForwardDim)', () => {
    const module = new sm.module.TransformerEncoder(6, 2, 2, 6, 12)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])

    const result = module(input)
    areSameShape(result, input)
  })
  it('depth=2 (initSequenceLength)', () => {
    const module = new sm.module.TransformerEncoder(6, 2, 2, 6, 6, 1)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])

    const result = module(input)
    areSameShape(result, input)
  })
  it('batch samples are independent', () => {
    const module = new sm.module.TransformerEncoder(6, 2, 2)
    const singleInput = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])
    const batchInput = sm
      .tensor(
        new Float32Array(
          [2, 3, 0.5, 0.25, 1, 2.25].concat([
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random()
          ])
        )
      )
      .reshape([2, 1, 6])

    const singleResult = module(singleInput)
    const batchResult = module(batchInput)
    areSameShape(batchResult, batchInput)

    expectArraysClose(
      batchResult.index([0, ':', ':']).toFloat32Array(),
      singleResult.toFloat32Array()
    )
    areSameShape(batchResult.index([0, ':', ':']), singleResult)
  })
  it('calculates gradient', () => {
    const module = new sm.module.TransformerEncoder(6, 2, 2)
    const input = sm
      .tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25]))
      .reshape([1, 6])
      .requireGrad()

    const result = module(input).sum()
    result.backward()
    expect(!!input.grad).toBe(true)
  })
})

describe('TransformerDecoderLayer', () => {
  it('single token, two heads', () => {
    const module = new sm.module.TransformerDecoderLayer(6, 2)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])
    const encoderOutput = sm
      .tensor(
        new Float32Array([
          1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
        ])
      )
      .reshape([3, 6])

    const result = module(input, encoderOutput)
    areSameShape(result, input)
  })
  it('single token, two heads (attentionDim)', () => {
    const module = new sm.module.TransformerDecoderLayer(6, 2, 7)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])
    const encoderOutput = sm
      .tensor(
        new Float32Array([
          1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
        ])
      )
      .reshape([3, 6])

    const result = module(input, encoderOutput)
    areSameShape(result, input)
  })
  it('single token, two heads (feedForwardDim)', () => {
    const module = new sm.module.TransformerDecoderLayer(6, 2, 6, 12)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])
    const encoderOutput = sm
      .tensor(
        new Float32Array([
          1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
        ])
      )
      .reshape([3, 6])

    const result = module(input, encoderOutput)
    areSameShape(result, input)
  })
  it('batch samples are independent', () => {
    const module = new sm.module.TransformerDecoderLayer(6, 2)
    const singleInput = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])
    const singleEncoderOutput = sm
      .tensor(
        new Float32Array([
          1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
        ])
      )
      .reshape([3, 6])
    const batchInput = sm
      .tensor(
        new Float32Array(
          [2, 3, 0.5, 0.25, 1, 2.25].concat([
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random()
          ])
        )
      )
      .reshape([2, 1, 6])
    const batchEncoderOutput = sm
      .tensor(
        new Float32Array(
          [
            1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
          ].concat(Array.from(Array(18), () => Math.random()))
        )
      )
      .reshape([2, 3, 6])

    const singleResult = module(singleInput, singleEncoderOutput)
    const batchResult = module(batchInput, batchEncoderOutput)
    areSameShape(batchResult, batchInput)

    expectArraysClose(
      batchResult.index([0, ':', ':']).toFloat32Array(),
      singleResult.toFloat32Array()
    )
    areSameShape(batchResult.index([0, ':', ':']), singleResult)
  })
  it('calculates gradient', () => {
    const module = new sm.module.TransformerDecoderLayer(6, 2)
    const input = sm
      .tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25]))
      .reshape([1, 6])
      .requireGrad()
    const encoderOutput = sm
      .tensor(
        new Float32Array([
          1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
        ])
      )
      .reshape([3, 6])
      .requireGrad()

    const result = module(input, encoderOutput).sum()
    result.backward()
    expect(!!input.grad).toBe(true)
    expect(!!encoderOutput.grad).toBe(true)
  })
})

describe('TransformerDecoderLayer.getSelfAttentionMask', () => {
  it('length=1', () => {
    const mask = sm.module.TransformerDecoderLayer.getSelfAttentionMask(1)
    expect(isShape(mask, [1, 1])).toBe(true)
    expectArraysClose(mask.toFloat32Array(), [0])
  })
  it('length=2', () => {
    const mask = sm.module.TransformerDecoderLayer.getSelfAttentionMask(2)
    expect(isShape(mask, [2, 2])).toBe(true)
    expectArraysClose(mask.toFloat32Array(), [0, 1, 0, 0])
  })
  it('length=3', () => {
    const mask = sm.module.TransformerDecoderLayer.getSelfAttentionMask(3)
    expect(isShape(mask, [3, 3])).toBe(true)
    expectArraysClose(mask.toFloat32Array(), [0, 1, 1, 0, 0, 1, 0, 0, 0])
  })
})

describe('TransformerDecoder', () => {
  it('depth=1', () => {
    const module = new sm.module.TransformerDecoder(6, 2, 1)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])
    const encoderOutput = sm
      .tensor(
        new Float32Array([
          1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
        ])
      )
      .reshape([3, 6])

    const result = module(input, encoderOutput)
    areSameShape(result, input)
  })
  it('depth=2', () => {
    const module = new sm.module.TransformerDecoder(6, 2, 2)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])
    const encoderOutput = sm
      .tensor(
        new Float32Array([
          1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
        ])
      )
      .reshape([3, 6])

    const result = module(input, encoderOutput)
    areSameShape(result, input)
  })
  it('depth=2 (attentionDim)', () => {
    const module = new sm.module.TransformerDecoder(6, 2, 2, 7)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])
    const encoderOutput = sm
      .tensor(
        new Float32Array([
          1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
        ])
      )
      .reshape([3, 6])

    const result = module(input, encoderOutput)
    areSameShape(result, input)
  })
  it('depth=2 (feedForwardDim)', () => {
    const module = new sm.module.TransformerDecoder(6, 2, 2, 6, 12)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])
    const encoderOutput = sm
      .tensor(
        new Float32Array([
          1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
        ])
      )
      .reshape([3, 6])

    const result = module(input, encoderOutput)
    areSameShape(result, input)
  })
  it('depth=2 (initSequenceLength)', () => {
    const module = new sm.module.TransformerDecoder(6, 2, 2, 6, 6, 1)
    const input = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])
    const encoderOutput = sm
      .tensor(
        new Float32Array([
          1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
        ])
      )
      .reshape([3, 6])

    const result = module(input, encoderOutput)
    areSameShape(result, input)
  })
  it('batch samples are independent', () => {
    const module = new sm.module.TransformerDecoder(6, 2, 2)
    const singleInput = sm.tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25])).reshape([1, 6])
    const singleEncoderOutput = sm
      .tensor(
        new Float32Array([
          1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
        ])
      )
      .reshape([3, 6])
    const batchInput = sm
      .tensor(
        new Float32Array(
          [2, 3, 0.5, 0.25, 1, 2.25].concat([
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random()
          ])
        )
      )
      .reshape([2, 1, 6])
    const batchEncoderOutput = sm
      .tensor(
        new Float32Array(
          [
            1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
          ].concat(Array.from(Array(18), () => Math.random()))
        )
      )
      .reshape([2, 3, 6])

    const singleResult = module(singleInput, singleEncoderOutput)
    const batchResult = module(batchInput, batchEncoderOutput)
    areSameShape(batchResult, batchInput)

    expectArraysClose(
      batchResult.index([0, ':', ':']).toFloat32Array(),
      singleResult.toFloat32Array()
    )
    areSameShape(batchResult.index([0, ':', ':']), singleResult)
  })
  it('calculates gradient', () => {
    const module = new sm.module.TransformerDecoder(6, 2, 2)
    const input = sm
      .tensor(new Float32Array([2, 3, 0.5, 0.25, 1, 2.25]))
      .reshape([1, 6])
      .requireGrad()
    const encoderOutput = sm
      .tensor(
        new Float32Array([
          1, 1.4, 1.2, 1.6, 1.1, 1.3, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 0.9, 1.1, 1.3, 1.7, 1.2, 1.1
        ])
      )
      .reshape([3, 6])

    const result = module(input, encoderOutput).sum()
    result.backward()
    expect(!!input.grad).toBe(true)
  })
})
