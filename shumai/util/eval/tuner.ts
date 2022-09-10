import { type Base_Eval_Optimizer, EvalOptimizers } from './optimizers'
import type { Tensor } from '@shumai/shumai'

/* TODO: more algos supported & tinker w hillclimb defaults */
export class EvalTuner {
  public type: EvalOptimizers
  public best_time: number
  public last_i: number
  public done = false
  public best_delta: number

  public evalFn: Base_Eval_Optimizer

  private _last_time: number

  set last_time(value: number) {
    this._last_time = value
  }

  constructor(evalFn: Base_Eval_Optimizer) {
    this.evalFn = evalFn
    this.best_time = Infinity
    this.last_i = 0
  }

  step(t: Tensor, i: number, usedDelta?: number) {
    if (!usedDelta) usedDelta = this.evalFn.done ? this.evalFn.best_in : this.evalFn.current_in
    const delta = i - this.last_i
    if (delta >= usedDelta) {
      // see how well we did this time
      t.eval()
      const time_spent = (performance.now() - this._last_time) / delta
      // console.log('delta', usedDelta, 'took', time_spent, 'ms per increment')
      if (this.evalFn.update(time_spent)) this.done = true
      this.last_i = i
      this.best_delta = this.evalFn.getBestInput()
      this._last_time = performance.now()
    }
  }
}
