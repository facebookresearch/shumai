import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'
import { calcSizeFromShape, expectArraysClose, isShape } from './utils'

function sampleSphere(args) {
  const u = sm.randn(args)
  const d = sm.sum(u.mul(u)).sqrt()
  return u.div(d)
}

function checkGrad(f, args, idx, jacobian, epsilon = 1e-3) {
  const eps = sm.scalar(epsilon)
  const ref = f(...args)
  const grad = sm.gradient_functions[ref.op]
  const args_a = [...args]
  const args_b = [...args]
  args_a[idx] = args_a[idx].add(eps.mul(jacobian))
  args_b[idx] = args_b[idx].sub(eps.mul(jacobian))
  const a = f(...args_a)
  const b = f(...args_b)
  const finite_diff = a.sub(b).div(eps.mul(sm.scalar(2)))
  const ctx = <sm.GradContext>{
    backward_output_index: idx,
    forward_inputs: args,
    forward_output: ref,
    backward_input: jacobian
  }
  const grad_diff = grad(ctx)
  expectArraysClose(finite_diff.toFloat32Array(), grad_diff.toFloat32Array(), epsilon)
}

describe('gradients', () => {
  it('mul', () => {
    const a = sm.randn([128])
    const b = sm.randn([128])
    checkGrad(sm.mul, [a, b], 0, sampleSphere([1]))
    checkGrad(sm.mul, [a, b], 1, sampleSphere([1]))
  })
  it('add', () => {
    const a = sm.randn([128])
    const b = sm.randn([128])
    checkGrad(sm.add, [a, b], 0, sampleSphere(a.shape))
    checkGrad(sm.add, [a, b], 1, sampleSphere(b.shape))
  })
  it('sub', () => {
    const a = sm.randn([128])
    const b = sm.randn([128])
    checkGrad(sm.sub, [a, b], 0, sampleSphere(a.shape))
    checkGrad(sm.sub, [a, b], 1, sampleSphere(b.shape))
  })
  it('exp', () => {
    const a = sm.randn([128])
    checkGrad(sm.exp, [a], 0, sampleSphere(a.shape), 1e-2)
  })
  it('tanh', () => {
    const a = sm.randn([128])
    checkGrad(sm.tanh, [a], 0, sampleSphere(a.shape))
  })
  it('erf', () => {
    const a = sm.randn([128])
    checkGrad(sm.erf, [a], 0, sampleSphere(a.shape))
  })
  it('sigmoid', () => {
    const a = sm.randn([128])
    checkGrad(sm.sigmoid, [a], 0, sampleSphere(a.shape))
  })
  it('maximum', () => {
    const a = sm.randn([128])
    const b = sm.randn([128])
    checkGrad(sm.maximum, [a, b], 0, sampleSphere(a.shape))
  })
  it('minimum', () => {
    const a = sm.randn([128])
    const b = sm.randn([128])
    checkGrad(sm.minimum, [a, b], 0, sampleSphere(a.shape))
  })
  it('abs', () => {
    const a = sm.randn([128])
    checkGrad(sm.abs, [a], 0, sampleSphere(a.shape))
  })
  it('log', () => {
    const a = sm.randn([128]).add(sm.scalar(1))
    checkGrad(sm.log, [a], 0, sampleSphere(a.shape))
  })
})
