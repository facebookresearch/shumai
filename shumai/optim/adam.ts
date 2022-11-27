import * as sm from '../tensor'
import { tidy } from '../util/memory'
import { Optimizer } from './optim'

export class Adam extends Optimizer {
  m: Record<number, sm.Tensor>
  v: Record<number, sm.Tensor>
  lr: sm.Tensor
  b1: sm.Tensor
  b2: sm.Tensor
  eps: sm.Tensor
  constructor(lr = 0.001, b1 = 0.9, b2 = 0.999, eps = 1e-8) {
    super()
    this.lr = sm.scalar(lr)
    this.b1 = sm.scalar(b1)
    this.b2 = sm.scalar(b2)
    this.eps = sm.scalar(eps)
    this.m = {}
    this.v = {}
    this.t = 0
  }
  step(grads: Record<string, { grad: sm.Tensor; tensor: sm.Tensor; id: number }>) {
    tidy(() => {
      const one = sm.scalar(1)
      this.t = this.t + 1
      const b1_p = this.b1.power(sm.scalar(this.t))
      const b2_p = this.b2.power(sm.scalar(this.t))
      // sqrt(1 - b2^t) / sqrt(1 - b1^t)
      const decay = sm.sqrt(one.sub(b2_p)).div(sm.sqrt(one.sub(b1_p)))
      const a = this.lr.mul(decay)
      for (const [, v] of Object.entries(grads)) {
        const { tensor: t, grad: g_, id: id } = v
        const g = g_.detach()
        if (this.m[id] === undefined) {
          this.m[id] = sm.full(t.shape, 0).untidy()
          this.v[id] = sm.full(t.shape, 0).untidy()
        }
        this.m[id] = this.b1.mul(this.m[id]).add(one.sub(this.b1).mul(g)).untidy()
        this.v[id] = this.b2
          .mul(this.v[id])
          .add(one.sub(this.b2).mul(g.mul(g)))
          .untidy()
        const delta = a.mul(this.m[id].div(this.v[id].sqrt()).add(this.eps))
        t.update(t.detach().sub(delta)).untidy()
        t.grad = null
      }
    })
  }
}
