import * as sm from "shumaiml";
import {
  it,
  expect,
  describe
} from 'bun:test';
import {
  expectArraysClose
} from "./utils";

describe('ops', () => {
  it('should support basic math operators (add, sub, mul, div)', () => {
    const a = sm.scalar(4);
    const b = sm.scalar(2);
    expect(sm.add(a, b).valueOf()).toBe(6);
    expect(sm.sub(a, b).valueOf()).toBe(2);
    expect(sm.mul(a, b).valueOf()).toBe(8);
    expect(sm.div(a, b).valueOf()).toBe(2);
  });

  it('should work for exp', () => {
    const a = sm.tensor(new Float32Array([1, 2, 0]))
    const r = sm.exp(a);
    expect(expectArraysClose(r.valueOf(), [Math.exp(1), Math.exp(2), 1])).toBe(true);
  });

  it('should work for log', () => {
    const a = sm.tensor(new Float32Array([1, 2]))
    const r = sm.log(a);
    expect(expectArraysClose(r.valueOf(), [Math.log(1), Math.log(2)])).toBe(true);
  });

  it('should work for floor', async () => {
    const a = sm.tensor(new Float32Array([1.5, 2.1, -1.4]));
    const r = sm.floor(a);
    expect(expectArraysClose(r.valueOf(), [1, 2, -2])).toBe(true);
  });

  it('should work for ceil', async () => {
    const a = sm.tensor(new Float32Array([1.5, 2.1, -1.4]));
    const r = sm.ceil(a);
    expect(expectArraysClose(r.valueOf(), [2, 3, -1])).toBe(true);
  });

  it('should work for abs', async () => {
    const a = sm.tensor(new Float32Array([1, -2, 0, 3, -0.1]));
    const r = sm.abs(a);
    expect(expectArraysClose(r.valueOf(), [1, 2, 0, 3, 0.1])).toBe(true);
  });

  it('should copy', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4]));
    const b = a.copy();
    const length = a.elements
    for (let i = 0; i < length; i++) {
      expect(a[i]).toBe(b[i]);
    }
  });

  it('should reshape', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2]);
    const b = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2])

    for (let i = 0; i < a.shape.length; i++) {
      expect(a.shape[i]).toBe(b.shape[i]);
    }
  });
});