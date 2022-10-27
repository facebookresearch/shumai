import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { areSameShape, expectArraysClose, expectThrows } from './utils'

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
  it('differing shapes are invalid', () => {
    const module = new sm.module.TransformerDotProductAttention(3)

    const queries = sm.tensor(new Float32Array([0, 0, 1, 0, 1, 0])).reshape([2, 3])
    const keys = sm.tensor(new Float32Array([0, 1, 0.25])).reshape([1, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([2, 3])

    expectThrows(() => module(queries, keys, values), new RegExp('should have the same shape'))
  })
  it('differing dimensionalities are invalid', () => {
    const module = new sm.module.TransformerDotProductAttention(3)

    const queries = sm.tensor(new Float32Array([0, 0, 1, 0, 1, 0])).reshape([2, 3])
    const keys = sm.tensor(new Float32Array([0, 1, 0.25, 0, 0.5, 1])).reshape([2, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([1, 2, 3])

    expectThrows(() => module(queries, keys, values), new RegExp('should have the same shape'))
  })
  it('invalid dimensions', () => {
    const module = new sm.module.TransformerDotProductAttention(4)

    const queries = sm.tensor(new Float32Array([0, 0, 1, 0, 1, 0])).reshape([2, 3])
    const keys = sm.tensor(new Float32Array([0, 1, 0.25, 0, 0.5, 1])).reshape([2, 3])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0])).reshape([2, 3])

    expectThrows(() => module(queries, keys, values), new RegExp('must match module dimensions'))
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
  it('single token, single head (attn_dim)', () => {
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
  it('single token, two heads (attn_dim)', () => {
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
  it('differing shapes are invalid', () => {
    const module = new sm.module.TransformerMultiheadAttention(6, 2)
    const queries = sm
      .tensor(new Float32Array([0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1]))
      .reshape([2, 6])
    const keys = sm.tensor(new Float32Array([0, 0, 0.5, 0.25, 1, 0])).reshape([1, 6])
    const values = sm.tensor(new Float32Array([1, 0, 0, 0, 1, 0, 3, 3, 3, 0, 0, 3])).reshape([2, 6])

    expectThrows(() => module(queries, keys, values), new RegExp('should have the same shape'))
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

    expectThrows(() => module(queries, keys, values), new RegExp('should have the same shape'))
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

    expectThrows(() => module(queries, keys, values), new RegExp('must match module dimensions'))
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
