import * as sm from '@shumai/shumai'
import { describe, expect, it } from 'bun:test'

describe('asType/dType', () => {
  it('basic', () => {
    for (let i = 0; i < 32; i++) {
      const t = sm.tensor(new Float32Array(new Array(10).map(() => Math.random())))
      expect(t.dtype).toBe(sm.dtype.Float32)

      const t1 = t.astype(sm.dtype.Float64)
      expect(t1.dtype).toBe(sm.dtype.Float64)

      const t2 = t1.astype(sm.dtype.Int16)
      expect(t2.dtype).toBe(sm.dtype.Int16)

      const t3 = t2.astype(sm.dtype.Int32)
      expect(t3.dtype).toBe(sm.dtype.Int32)

      const t4 = t3.astype(sm.dtype.Int64)
      expect(t4.dtype).toBe(sm.dtype.Int64)
      expect(t4.dtype).toBe(sm.dtype.BigInt64)

      const t5 = t4.astype(sm.dtype.BigInt64)
      expect(t5.dtype).toBe(sm.dtype.BigInt64)
      expect(t5.dtype).toBe(sm.dtype.Int64)

      const t6 = t5.astype(sm.dtype.Uint8)
      expect(t6.dtype).toBe(sm.dtype.Uint8)

      const t7 = t6.astype(sm.dtype.Uint16)
      expect(t7.dtype).toBe(sm.dtype.Uint16)

      const t8 = t7.astype(sm.dtype.Uint32)
      expect(t8.dtype).toBe(sm.dtype.Uint32)

      const t9 = t8.astype(sm.dtype.BigUint64)
      expect(t9.dtype).toBe(sm.dtype.BigUint64)
      expect(t9.dtype).toBe(sm.dtype.Uint64)
    }
  })

  it('constructor', () => {
    for (let i = 0; i < 32; i++) {
      let t = sm.tensor(sm.rand([100]).toFloat32Array())
      expect(t.dtype).toBe(sm.dtype.Float32)

      t = sm.tensor(sm.rand([100]).toFloat64Array())
      expect(t.dtype).toBe(sm.dtype.Float64)

      t = sm.tensor(new Int8Array(new Array(10).map(() => Math.random())))
      expect(t.dtype).toBe(sm.dtype.BoolInt8)

      t = sm.tensor(sm.rand([100]).toInt16Array())
      expect(t.dtype).toBe(sm.dtype.Int16)

      t = sm.tensor(sm.rand([100]).toInt32Array())
      expect(t.dtype).toBe(sm.dtype.Int32)

      t = sm.tensor(sm.rand([100]).toBigInt64Array())
      expect(t.dtype).toBe(sm.dtype.BigInt64)
      expect(t.dtype).toBe(sm.dtype.Int64)

      t = sm.tensor(sm.rand([100]).toUint8Array())
      expect(t.dtype).toBe(sm.dtype.Uint8)

      t = sm.tensor(sm.rand([100]).toUint16Array())
      expect(t.dtype).toBe(sm.dtype.Uint16)

      t = sm.tensor(sm.rand([100]).toUint32Array())
      expect(t.dtype).toBe(sm.dtype.Uint32)

      t = sm.tensor(sm.rand([100]).toBigUint64Array())
      expect(t.dtype).toBe(sm.dtype.BigUint64)
    }
  })
})
