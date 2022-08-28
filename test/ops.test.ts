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

  it('should reshape', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2]);
    const b = sm.tensor(new Float32Array([1, 2, 3, 4])).reshape([2, 2]);

    for (let i = 0; i < a.shape.length; i++) {
      expect(a.shape[i]).toBe(b.shape[i]);
    }
  });

  it('should work for transpose', () => {
    const t = sm.tensor(new Float32Array([1, 11, 2, 22, 3, 33, 4, 44])).reshape([2, 4]);
    const r = sm.transpose(t, [1, 0]);

    const expected_shape = [4, 2];
    for (let i = 0; i < r.shape.length; i++) {
      expect(r.shape[i]).toBe(expected_shape[i]);
    }
    expectArraysClose(r.valueOf(), [1, 3, 11, 33, 2, 4, 22, 44]);
  });

  it('should work for negative', () => {
    const a = sm.tensor(new Float32Array([1, -3, 2, 7, -4]));
    const r = sm.negative(a);
    expectArraysClose(r.valueOf(), [-1, 3, -2, -7, 4]);
  });

  it('should support basic math operators (add, sub, mul, div)', () => {
    const a = sm.scalar(4);
    const b = sm.scalar(2);
    expect(sm.add(a, b).valueOf()).toBe(6);
    expect(sm.sub(a, b).valueOf()).toBe(2);
    expect(sm.mul(a, b).valueOf()).toBe(8);
    expect(sm.div(a, b).valueOf()).toBe(2);
  });

  it('should work for exp', () => {
    const a = sm.tensor(new Float32Array([1, 2, 0]));
    const r = sm.exp(a);
    expectArraysClose(r.valueOf(), [Math.exp(1), Math.exp(2), 1]);
  });

  it('should work for log', () => {
    const a = sm.tensor(new Float32Array([1, 2]));
    const r = sm.log(a);
    expectArraysClose(r.valueOf(), [Math.log(1), Math.log(2)]);
  });

  it('should work for floor', () => {
    const a = sm.tensor(new Float32Array([1.5, 2.1, -1.4]));
    const r = sm.floor(a);
    expectArraysClose(r.valueOf(), [1, 2, -2]);
  });

  it('should work for ceil', () => {
    const a = sm.tensor(new Float32Array([1.5, 2.1, -1.4]));
    const r = sm.ceil(a);
    expectArraysClose(r.valueOf(), [2, 3, -1]);
  });

  it('should work for abs', () => {
    const a = sm.tensor(new Float32Array([1, -2, 0, 3, -0.1]));
    const r = sm.abs(a);
    expectArraysClose(r.valueOf(), [1, 2, 0, 3, 0.1]);
  });

  it('should work for minimum', () => {
    const a = sm.tensor(new Float32Array([0.5, 3, -0.1, -4]));
    const b = sm.tensor(new Float32Array([0.2, 0.4, 0.25, 0.15]));
    const r = sm.minimum(a, b);
    expectArraysClose(r.valueOf(), [0.2, 0.4, -0.1, -4]);
  });

  it('should work for maximum', () => {
    const a = sm.tensor(new Float32Array([0.5, 3, -0.1, -4]));
    const b = sm.tensor(new Float32Array([0.2, 0.4, 0.25, 0.15]));
    const r = sm.maximum(a, b);
    expectArraysClose(r.valueOf(), [0.5, 3, 0.25, 0.15]);
  });

  it('should work for mul', async () => {
    const shape = [2, 2];
    const a = sm.tensor(new Float32Array([1, 2, -3, -4])).reshape(shape);
    const b = sm.tensor(new Float32Array([5, 3, 4, -7])).reshape(shape);
    const r = sm.mul(a, b);

    for (let i = 0; i < a.shape.length; i++) {
      expect(r.shape[i]).toBe(shape[i]);
    }
    expectArraysClose(r.valueOf(), [5, 6, -12, 28]);
  });

  it('should copy', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4]));
    const b = a.copy();
    const length = a.elements
    for (let i = 0; i < length; i++) {
      expect(a[i]).toBe(b[i]);
    }
  });
});