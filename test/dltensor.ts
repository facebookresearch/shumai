import * as sm from '@shumai/shumai'
import { describe, it } from 'bun:test'
import { expectArraysClose } from './utils'


describe('dltensor', () => {
  it('to and from', () => {
    const a = sm.randn([4,4])
    const dlt = a.toDLTensor()
    const b = sm.fromDLTensor(dlt)
    expectArraysClose(a.toFloat32Array(), b.toFloat32Array())
  })
})
