export abstract class Base_Eval_Optimizer {
  // lowerBounds of input space
  public lower_bounds: number
  // upper bounds of input space
  public upper_bounds: number
  // array of all possible inputs
  public input_range: number[]

  // input value being tested
  public current_in: number

  // flag for when `done` optimizing
  public done = false
  // best input value (set w `done`)
  public best_in: number

  // map of all tested inputs (count=# of times tested, val=avg)
  public all_tested: Map<number, { count: number; val: number }> = new Map()

  public update(time_spent: number): boolean {
    return true
  }

  public getBestInput() {
    let bestIn: number,
      bestVal = Infinity
    for (const [key, { val }] of this.all_tested) {
      if (val < bestVal) {
        bestVal = val
        bestIn = key
      }
    }
    this.best_in = bestIn
    return bestIn
  }

  constructor(low: number, high: number) {
    this.lower_bounds = low
    this.upper_bounds = high
    this.input_range = this.calcRange(low, high)
  }

  public calcRange(low: number, high: number) {
    const length = high - low + 1
    const res = new Array(length)
    for (let i = 0; i < length; i++) {
      res[i] = low + i
    }
    return res
  }
}
