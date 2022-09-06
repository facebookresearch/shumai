import { getRandomItem } from '.'
import { setRandomSeed } from 'bun:jsc'
import type { Tensor } from '@shumai/shumai'

setRandomSeed(Math.random() * 100000)

export enum EvalTunerType {
  STOCH_HILL_CLIMB
}

/* TODO: more algos supported & tinker w hillclimb defaults */
export class EvalTuner {
  public type: EvalTunerType
  public best_time: number
  public last_i: number
  public done = false

  private evalFn: StochHillClimb

  private _last_time: number

  set last_time(value: number) {
    this._last_time = value
  }

  constructor(
    type: EvalTunerType = EvalTunerType.STOCH_HILL_CLIMB,
    lowerBound = 1,
    upperBound = 500
  ) {
    this.type = type
    switch (type) {
      case EvalTunerType.STOCH_HILL_CLIMB:
        this.evalFn = new StochHillClimb(lowerBound, upperBound)
        break
      default:
        throw new Error('EvalTunerType: not supported')
    }
    this.best_time = Infinity
    this.last_i = 0
  }

  get best_delta() {
    return this.evalFn.bestIn
  }

  step(t: Tensor, i: number, usedDelta?: number) {
    if (!usedDelta) usedDelta = this.evalFn.done ? this.evalFn.bestIn : this.evalFn.currentIn
    const delta = i - this.last_i
    if (delta >= usedDelta) {
      // see how well we did this time
      t.eval()
      const time_spent = (performance.now() - this._last_time) / delta
      // console.log('delta', usedDelta, 'took', time_spent, 'ms per increment')
      if (this.evalFn.update(time_spent)) this.done = true
      this.last_i = i
      this._last_time = performance.now()
    }
  }
}

class StochHillClimb {
  // array of possible inputs
  public range: number[]
  // current pool for rand exploration
  public current_pool: number[]
  // max # of samples taken in each pool
  public maxSamples = 6
  // tracks # of rand samples taken from pool
  private randSamples = 0
  // size of pool sampled
  public poolSize = 24
  // map of previously tested inputs and their results
  public prev_tested: Map<number, number> = new Map()
  // map of all tested inputs (count and val = avg)
  public all_tested: Map<number, { count: number; val: number }> = new Map()
  // temp store of results for rand exploration around selection
  public recent_results: Map<number, { count: number; val: number }> = new Map()
  // best input value (set when optimization is done)
  public bestIn: number
  // flag for when optimization is done
  public done = false
  // input value being tested
  public currentIn: number
  // # of sample pops to be taken before `done`
  public max_total_sample_pops = 100
  // # of sample pops taken
  private pops_sampled = 0
  // lowerBounds of input space
  public lowerBounds: number
  // upperBounds of input space
  public upperBounds: number

  constructor(lowerBounds = 50, upperBounds = 500) {
    this.range = this.calcRange(lowerBounds, upperBounds)
    this.lowerBounds = lowerBounds
    this.upperBounds = upperBounds
    const randStart = this.initRand(75, 150)
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
    Math.floor(Math.random() * ((high || this.upperBounds) - (low || this.lowerBounds) + 1)) +
    (low || this.lowerBounds)

  private getNewVal() {
    // sample from current_pool until maxSamples reached
    if (this.randSamples < this.maxSamples) {
      const { val, idx } = getRandomItem(this.current_pool)
      this.currentIn = val
      // TODO: this.current_pool.splice(idx, 1)
    } else if (this.pops_sampled < this.max_total_sample_pops) {
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
      this.currentIn = val
      // TODO: this.current_pool.splice(idx, 1)
    } else {
      let bestRes = Infinity
      for (const [key, { count, val }] of this.all_tested) {
        if (count > 1 && val < bestRes) {
          bestRes = val
          this.bestIn = key
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
        const lowerBounds = (val || this.currentIn) - Math.floor(this.poolSize / 2)
        if (lowerBounds < this.range[0]) {
          return this.range[0]
        } else {
          return lowerBounds
        }
      }
      default: {
        const upperBounds = (val || this.currentIn) + Math.floor(this.poolSize / 2)
        if (upperBounds > this.range[this.range.length - 1]) {
          return this.range[this.range.length - 1]
        } else {
          return upperBounds
        }
      }
    }
  }

  public update(time_spent: number) {
    // update state w input & resulting time_spent
    const recent_res = this.recent_results.get(this.currentIn)
    if (recent_res) {
      const { count: tempCount, val } = recent_res
      const value = (val * tempCount + time_spent) / (tempCount + 1)
      this.recent_results.set(this.currentIn, { count: tempCount + 1, val: value })
    } else {
      this.recent_results.set(this.currentIn, { count: 1, val: time_spent })
    }
    this.prev_tested.set(this.currentIn, time_spent)
    const avg_data = this.all_tested.get(this.currentIn)
    if (avg_data) {
      const { count: tempCount, val } = avg_data
      const value = (val * tempCount + time_spent) / (tempCount + 1)
      this.all_tested.set(this.currentIn, { count: tempCount + 1, val: value })
    } else {
      this.all_tested.set(this.currentIn, { count: 1, val: time_spent })
    }

    if (!this.done) {
      if (time_spent < this.bestIn) {
        this.bestIn = this.currentIn
      }
      this.randSamples++
      return this.getNewVal()
    }
  }

  private calcRange(low: number, high: number) {
    const length = high - low + 1
    const res = new Array(length)
    for (let i = 0; i < length; i++) {
      res[i] = low + i
    }
    return res
  }
}
