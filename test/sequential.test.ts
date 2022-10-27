import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { LSTM } from '../shumai/module'
import { areSameShape, expectArraysClose, expectThrows } from './utils'

describe('Sequential', () => {
  it('identity when empty, no args', () => {
    const module = new sm.module.Sequential()

    const result = module()
    expect(result === null).toBe(true)
  })
  it('identity when empty, single tensor arg', () => {
    const module = new sm.module.Sequential()
    const input = sm.rand([3])
    const result = module(input)
    expectArraysClose(input.toFloat32Array(), result.toFloat32Array())
  })
  it('identity when empty, single scalar arg', () => {
    const module = new sm.module.Sequential()
    const input = sm.scalar(Math.random())
    const result = module(input)
    expectArraysClose(input.toFloat32Array(), result.toFloat32Array())
  })
  it('identity when empty, two tensor args', () => {
    const module = new sm.module.Sequential()
    const input = [sm.rand([3]), sm.full([3, 2], Math.random())]
    const result = module(...input)
    for (let i = 0; i < input.length; i++) {
      expectArraysClose(input[i].toFloat32Array(), result[i].toFloat32Array())
    }
  })
  it('single module, single tensor arg', () => {
    const module = new sm.module.Linear(5, 3)
    const seq = new sm.module.Sequential(module)

    const input = sm.tensor(
      new Float32Array([Math.random(), Math.random(), Math.random(), Math.random(), Math.random()])
    )
    const result = seq(input)
    const expected = module(input)

    expect(areSameShape(result, expected)).toBe(true)
    expectArraysClose(result.toFloat32Array(), expected.toFloat32Array())
  })
  it('single module, multiple tensor args', () => {
    const module = new sm.module.TransformerDotProductAttention(3)
    const seq = new sm.module.Sequential(module)

    const input0 = sm.rand([2, 3])
    const input1 = sm.rand([2, 3])
    const input2 = sm.rand([2, 3])
    const result = seq(input0, input1, input2)
    const expected = module(input0, input1, input2)

    expect(areSameShape(result, expected)).toBe(true)
    expectArraysClose(result.toFloat32Array(), expected.toFloat32Array())
  })
  it('single module, multiple tensor args, multiple tensor returns', () => {
    const module = new LSTM(3, 3)
    const seq = new sm.module.Sequential(module)

    const input0 = sm.rand([2, 3])
    const input1 = sm.rand([2, 3])
    const input2 = sm.rand([2, 3])
    const result = seq(input0, input1, input2)
    const expected = module(input0, input1, input2)

    for (let i = 0; i < expected.length; i++) {
      expect(areSameShape(result[i], expected[i])).toBe(true)
      expectArraysClose(result[i].toFloat32Array(), expected[i].toFloat32Array())
    }
  })
  it('two modules', () => {
    const module0 = new sm.module.Linear(5, 3)
    const module1 = new sm.module.Linear(3, 2)
    const seq = new sm.module.Sequential(module0, module1)

    const input = sm.rand([5])
    const result = seq(input)
    const expected = module1(module0(input))

    expect(areSameShape(result, expected)).toBe(true)
    expectArraysClose(result.toFloat32Array(), expected.toFloat32Array())
  })
  it('invalid number of args', () => {
    const module = new sm.module.LSTM(5, 3)
    const seq = new sm.module.Sequential(module)
    const tensor = sm.rand([5])

    expectThrows(() => seq())
    expectThrows(() => seq(tensor))
  })
  it('invalid number of args between modules', () => {
    const module0 = new sm.module.Linear(5, 3)
    const module1 = new sm.module.LSTM(3, 2)
    const seq = new sm.module.Sequential(module0, module1)
    const tensor = sm.rand([5])

    expectThrows(() => seq(tensor))
  })
  it('invalid input tensor shape', () => {
    const module = new sm.module.Linear(5, 3)
    const seq = new sm.module.Sequential(module)
    const tensor = sm.tensor(new Float32Array([Math.random(), Math.random()]))
    expectThrows(() => seq(tensor))
  })
  it('invalid tensor shape between modules', () => {
    const module0 = new sm.module.Linear(5, 3)
    const module1 = new sm.module.LSTM(5, 2)
    const seq = new sm.module.Sequential(module0, module1)

    const tensor = sm.rand([5])

    expectThrows(() => seq(tensor))
  })
  it('calculates gradient when empty', () => {
    const seq = new sm.module.Sequential()
    const tensor = sm.rand([3]).requireGrad()

    const result = seq(tensor).sum()
    result.backward()
    expect(!!tensor.grad).toBe(true)
  })
  it('calculates gradient with single module, single tensor arg', () => {
    const module = new sm.module.Linear(5, 3)
    const seq = new sm.module.Sequential(module)
    const tensor = sm.rand([5]).requireGrad()

    const result = seq(tensor).sum()
    result.backward()
    expect(!!tensor.grad).toBe(true)
  })
  it('calculates gradient with single module, multiple tensor args', () => {
    const module = new sm.module.TransformerDotProductAttention(3)
    const seq = new sm.module.Sequential(module)

    const input0 = sm.rand([2, 3]).requireGrad()
    const input1 = sm.rand([2, 3]).requireGrad()
    const input2 = sm.rand([2, 3]).requireGrad()

    const result = seq(input0, input1, input2).sum()
    result.backward()
    expect(!!input0.grad).toBe(true)
    expect(!!input1.grad).toBe(true)
    expect(!!input2.grad).toBe(true)
  })
  it('calculates gradient with two modules', () => {
    const module0 = new sm.module.Linear(5, 3)
    const module1 = new sm.module.Linear(3, 2)
    const seq = new sm.module.Sequential(module0, module1)

    const tensor = sm.rand([5]).requireGrad()
    const result = seq(tensor).sum()
    result.backward()
    expect(!!tensor.grad).toBe(true)
  })
})
