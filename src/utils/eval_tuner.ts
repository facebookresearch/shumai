import type { Tensor } from '../tensor/tensor'

export enum EvalTunerType {
  HILLCLIMB = 'hillclimb'
}

/* TODO: more algos supported & tinker w hillclimb defaults */
export class EvalTuner {
  public type: EvalTunerType
  public best_delta: number
  public best_time: number
  public last_i: number
  private prev_tested: Map<number, boolean> = new Map()

  private last_time: number

  constructor() {
    this.best_delta = 25
    this.best_time = Infinity
    this.last_i = 0
  }

  /** hill climbing algo double/then half distance until optimal found */
  calculate_better_delta(time_spent: number) {
    this.prev_tested.set(this.best_delta, true)
    if (time_spent < this.best_time) {
      this.best_time = time_spent
      this.best_delta *= 2
    } else {
      const tempDelta = Math.floor(this.best_delta * 0.75)
      if (!this.prev_tested.has(tempDelta)) {
        this.best_delta = tempDelta
      } else {
        return true
      }
    }
  }

  step(t: Tensor, i: number) {
    const delta = i - this.last_i
    if (delta >= this.best_delta) {
      // see how well we did this time
      t.eval()
      const time_spent = (performance.now() - this.last_time) / delta
      console.log('delta', this.best_delta, 'took', time_spent, 'ms per increment')
      const isDone = this.calculate_better_delta(time_spent)
      this.last_i = i
      this.last_time = performance.now()
      return isDone
    }
  }
}
