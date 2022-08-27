import * as sm from "../shumai";
import {
  it,
  expect,
  describe
} from 'bun:test';
/* Run w `bun wiptest` */

describe('ops', () => {
  it('should support basic math operators (add, sub, mul, div)', () => {
    const a = sm.scalar(4);
    const b = sm.scalar(2);
    expect(sm.add(a, b).valueOf()).toBe(6);
    expect(sm.sub(a, b).valueOf()).toBe(2);
    expect(sm.mul(a, b).valueOf()).toBe(8);
    expect(sm.div(a, b).valueOf()).toBe(2);
  });

  it('should copy', () => {
    const a = sm.tensor(new Float32Array([1, 2, 3, 4]));
    const b = a.copy();
    const length = b.elements
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