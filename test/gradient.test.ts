import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { calcSizeFromShape, expectArraysClose, isShape } from './utils'

function sampleSphere(args) {
  const u = sm.randn(args)
  const d = sm.sum(u.mul(u)).sqrt()
  return u.div(d)
}

function checkBackward(f, args, idx, epsilon = 1e-3) {
  args[idx].requires_grad = true
  const eps = sm.scalar(epsilon)
  const ref = f(...args)
  const jacobian = sampleSphere(ref.shape)
  const grad = sm.gradient_functions[ref.op]
  const args_a = [...args]
  const args_b = [...args]
  args_a[idx] = args_a[idx].add(eps.mul(jacobian))
  args_b[idx] = args_b[idx].sub(eps.mul(jacobian))
  const a = f(...args_a)
  const b = f(...args_b)
  const finite_diff = a
    .sub(b)
    .div(eps.mul(sm.scalar(2)))
    .sum()
  ref.backward(jacobian)
  const grad_diff = args[idx].grad.sum()
  expectArraysClose(finite_diff.toFloat32Array(), grad_diff.toFloat32Array(), epsilon)
}

describe('gradients', () => {
  it('amax', () => {
    {
      const a = sm.randn([128])
      checkBackward(sm.amax, [a, [0], true], 0)
    }
    {
      const a = sm.randn([8, 128])
      checkBackward(sm.amax, [a, [1], true], 0)
    }
  })
  it('mul', () => {
    const a = sm.randn([128])
    const b = sm.randn([128])
    checkBackward(sm.mul, [a, b], 0)
    checkBackward(sm.mul, [a, b], 1)
  })
  it('add', () => {
    const a = sm.randn([128])
    const b = sm.randn([128])
    checkBackward(sm.add, [a, b], 0)
    checkBackward(sm.add, [a, b], 1)
  })
  it('sub', () => {
    const a = sm.randn([128])
    const b = sm.randn([128])
    checkBackward(sm.sub, [a, b], 0)
    checkBackward(sm.sub, [a, b], 1)
  })
  it('exp', () => {
    const a = sm.randn([128])
    checkBackward(sm.exp, [a], 0, 1e-2)
  })
  it('tanh', () => {
    const a = sm.randn([128])
    checkBackward(sm.tanh, [a], 0)
  })
  it('erf', () => {
    const a = sm.randn([128])
    checkBackward(sm.erf, [a], 0)
  })
  it('sigmoid', () => {
    const a = sm.randn([128])
    checkBackward(sm.sigmoid, [a], 0)
  })
  it('maximum', () => {
    const a = sm.randn([128])
    const b = sm.randn([128])
    checkBackward(sm.maximum, [a, b], 0)
  })
  it('minimum', () => {
    const a = sm.randn([128])
    const b = sm.randn([128])
    checkBackward(sm.minimum, [a, b], 0)
  })
  it('abs', () => {
    const a = sm.randn([128])
    checkBackward(sm.abs, [a], 0)
  })
  it('log', () => {
    const a = sm.rand([128]).add(sm.scalar(2))
    checkBackward(sm.log, [a], 0)
  })
  it('sum', () => {
    const a = sm.rand([128]).add(sm.scalar(2))
    checkBackward(sm.sum, [a], 0, 1e-2)
  })
  it('softmax', () => {
    const a = sm.randn([1, 8])
    checkBackward(sm.softmax, [a, 1], 0)
  })
})
