import type { Tensor } from '../tensor'
import * as ops from '../tensor/tensor_ops'
const sm = { ...ops }
import { Module } from './module'

export class LSTM extends Module {
  W_f: Tensor
  U_f: Tensor
  b_f: Tensor
  W_i: Tensor
  U_i: Tensor
  b_i: Tensor
  W_o: Tensor
  U_o: Tensor
  b_o: Tensor
  W_c: Tensor
  U_c: Tensor
  b_c: Tensor
  constructor(inp_dim: number, out_dim: number) {
    super()
    this.W_f = sm.randn([inp_dim, out_dim])
    this.U_f = sm.randn([out_dim, out_dim])
    this.b_f = sm.randn([out_dim])
    this.W_i = sm.randn([inp_dim, out_dim])
    this.U_i = sm.randn([out_dim, out_dim])
    this.b_i = sm.randn([out_dim])
    this.W_o = sm.randn([inp_dim, out_dim])
    this.U_o = sm.randn([out_dim, out_dim])
    this.b_o = sm.randn([out_dim])
    this.W_c = sm.randn([inp_dim, out_dim])
    this.U_c = sm.randn([out_dim, out_dim])
    this.b_c = sm.randn([out_dim])
  }

  forward(x: Tensor, h: Tensor, c: Tensor): [Tensor, Tensor] {
    const f_t = x.matmul(this.W_f).add(h.matmul(this.U_f)).add(this.b_f).sigmoid()
    const i_t = x.matmul(this.W_i).add(h.matmul(this.U_i)).add(this.b_i).sigmoid()
    const o_t = x.matmul(this.W_o).add(h.matmul(this.U_o)).add(this.b_o).sigmoid()
    const c_t = x.matmul(this.W_c).add(h.matmul(this.U_c)).add(this.b_c).tanh()
    const new_c = f_t.mul(c).add(i_t.mul(c_t))
    const new_h = o_t.mul(new_c.tanh())
    return [new_h, new_c]
  }
}

export function lstm(inp_dim, out_dim) {
  return new LSTM(inp_dim, out_dim)
}
