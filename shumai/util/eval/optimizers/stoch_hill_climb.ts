import { Base_Eval_Optimizer } from '.'
import { getRandomItem } from '../../array'

/**
 * Modified StochHillClimb, optimized to aggressively
 * pursue optimal freq to call `eval` on tensor in loop.
 *
 * Given lower and upper bounds of input space, and a random
 * starting point (init starting point randomly selected from
 * range `initLow` - `initHigh`); helps avoid sub-optimal runs);
 * Given the starting point, the algo selects `poolSize` num inputs,
 * evenly split around start point, to comprise`current_pool`. If
 * this would cause `current_pool` to contain values beyond the
 * upper/lower bounds of input space, the invalid inputs are dropped.
 *
 * The algo then selects `maxSamples` # of picks from
 * the sampling pool and updates `recent_results`, Map<number, {count: number; avg: number}>;
 * stores results from sampling `current_pool` of inputs.
 * only used to store the results from sampling the current pool) and `all_tested`
 * (map of all sampled inputs, tracks count, num times sampled, and avg res). Inputs can be
 * sampled multiple times by design (attempt to reduce noise over time).
 *
 * After taking `maxSamples` picks, the algo selects the avg best input
 * from `recent_results`, calculating the new upper and lower bounds
 * for `current_pool` accordingly; `pops_sampled` is incremented by 1 & `recent_results`
 * is reset.
 *
 * When `pops_sampled` === `max_pops_to_sample`, the algo selects the avg best input
 * that's been sampled more than once (to reduce noise) from `all_tested` and sets
 * `done` to true and `best_in` to the selected input.
 */
export class StochHillClimb extends Base_Eval_Optimizer {
  // current pool for rand exploration
  public current_pool: number[]
  // max # of samples taken in each pool
  public maxSamples = 6
  // tracks # of rand samples taken from pool
  private randSamples = 0
  // size of pool sampled
  public poolSize = 24

  // temp store of results for rand exploration around selection
  public recent_results: Map<number, { count: number; val: number }> = new Map()

  // # of sample pops to be taken before `done`
  public max_pops_to_sample = 100
  // # of sample pops taken
  private pops_sampled = 0

  public initLow = 50
  public initHigh = 150

  constructor(lowerBounds = 50, upperBounds = 500) {
    super(lowerBounds, upperBounds)

    const randStart = this.initRand(this.initLow, this.initHigh)
    this.current_pool = this.calcRange(
      this.calcBound('low', randStart),
      this.calcBound('high', randStart)
    )
    this.getNewVal()
  }

  private getAvgBest(mapRes: Map<number, { count: number; val: number }>) {
    let best: number,
      bestResult = Infinity
    for (const [key, { count, val }] of mapRes) {
      if (count > 1 && val < bestResult) {
        best = key
        bestResult = val
      }
    }
    return best
  }

  private initRand = (low?: number, high?: number) =>
    Math.floor(Math.random() * ((high || this.upper_bounds) - (low || this.lower_bounds) + 1)) +
    (low || this.lower_bounds)

  private getNewVal() {
    // sample from current_pool until maxSamples reached
    if (this.randSamples < this.maxSamples) {
      const { val, idx } = getRandomItem(this.current_pool)
      this.current_in = val
      // TODO: this.current_pool.splice(idx, 1)
    } else if (this.pops_sampled < this.max_pops_to_sample) {
      // check recent_results for direction to go
      const best = this.getAvgBest(this.recent_results)

      // reset current_pool to be around best
      const low = this.calcBound('low', best)
      const high = this.calcBound('high', best)
      this.current_pool = this.calcRange(low, high)
      // increment pops_sampled
      this.pops_sampled++

      // reset randSamples
      this.randSamples = 0
      // reset recent_results
      this.recent_results = new Map()

      // select first value from new sample pool
      const { val, idx } = getRandomItem(this.current_pool)
      this.current_in = val
      // TODO: this.current_pool.splice(idx, 1)
    } else {
      let bestRes = Infinity
      for (const [key, { count, val }] of this.all_tested) {
        if (count > 1 && val < bestRes) {
          bestRes = val
          this.best_in = key
        }
      }
      this.done = true
      return true
    }
  }

  /**
   * utility to calculate the lower or upper bound of a sampled
   * range given the center, a limiting range (i.e. all valid to
   * be sampled, and the type of bound
   */
  private calcBound(type: 'low' | 'high', val: number) {
    switch (type) {
      case 'low': {
        const lowerBounds = (val || this.current_in) - Math.floor(this.poolSize / 2)
        if (lowerBounds < this.input_range[0]) {
          return this.input_range[0]
        } else {
          return lowerBounds
        }
      }
      default: {
        const upperBounds = (val || this.current_in) + Math.floor(this.poolSize / 2)
        if (upperBounds > this.input_range[this.input_range.length - 1]) {
          return this.input_range[this.input_range.length - 1]
        } else {
          return upperBounds
        }
      }
    }
  }

  update(time_spent: number) {
    // update state w input & resulting time_spent
    const recent_res = this.recent_results.get(this.current_in)
    if (recent_res) {
      const { count: tempCount, val } = recent_res
      const value = (val * tempCount + time_spent) / (tempCount + 1)
      this.recent_results.set(this.current_in, { count: tempCount + 1, val: value })
    } else {
      this.recent_results.set(this.current_in, { count: 1, val: time_spent })
    }

    const avg_data = this.all_tested.get(this.current_in)
    if (avg_data) {
      const { count: tempCount, val } = avg_data
      const value = (val * tempCount + time_spent) / (tempCount + 1)
      this.all_tested.set(this.current_in, { count: tempCount + 1, val: value })
    } else {
      this.all_tested.set(this.current_in, { count: 1, val: time_spent })
    }

    if (!this.done) {
      if (time_spent < this.best_in) {
        this.best_in = this.current_in
      }
      this.randSamples++
      return this.getNewVal()
    }
  }
}
