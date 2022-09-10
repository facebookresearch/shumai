import { setRandomSeed } from 'bun:jsc'
import { Base_Eval_Optimizer } from '.'
import { getRandomItem } from '../..'
setRandomSeed(Math.random() * 100000)

type PoolMapItem = { sum: number; pool: number[]; count: number; isValid: boolean }

/**
 * Fast Optimizer: hacked together, splits the input space
 * into `split_count` number of pools, randomly selecting
 * pools to sample from (pools w inputs that are fewer steps,
 * i.e. don't skew total time of operation too much, are less risky
 * and more likely to be sampled from).
 *
 * Repeat until multiple pools have been sampled from more than
 * `samples_before_elim` times; if any of the pools eligible for
 * elimination have the lowest average of all of the pools,
 * the pool is eliminated by setting `isValid` to false in
 * `sampling_pool_map` (avoid sampling from pool directly)
 *
 * If no pool is randomly selected (possible given element of chance),
 * the `current_in` value is set to either the best performing input
 * that's been sampled only once or the best performing input that's
 * been sampled more than once (depending on which result is better,
 * i.e. lower)
 */
export class Fast extends Base_Eval_Optimizer {
  private sampling_pool_map: Map<number, PoolMapItem> = new Map()

  // tracks # of pools eliminated
  private pools_eliminated = 0

  // tracks # of rand samples taken between pool eliminations
  private sample_count = 0

  // max # of samples per pool
  public max_sample_count = 1000

  // min # of samples before pool eligible for elim
  public samples_before_elim = 5

  // # of pools to split explored input space
  public split_count = 4

  // tracks idx of last pool sampled
  private pool_idx = 0

  public avg_res: Map<number, { avg: number; count: number; isValid: boolean }> = new Map()

  constructor(lowerBounds = 25, upperBounds = 500) {
    super(lowerBounds, upperBounds)
    this.getSamplingPools(lowerBounds, upperBounds)
    this.current_in = getRandomItem(this.sampling_pool_map.get(0).pool).val
  }

  /**
   * initialize pools by spliting
   * `this.input_range` into `this.split_count`
   * pools
   */
  private getSamplingPools(low: number, high: number) {
    this.sampling_pool_map.clear()
    const dif = high - low
    const splitSize = Math.floor(dif / this.split_count)
    const rmdr = dif % this.split_count
    for (let i = 0; i < this.split_count; i++) {
      this.sampling_pool_map.set(i, {
        sum: 0,
        pool: this.calcRange(
          low + i * splitSize,
          i === this.split_count - 1
            ? low + (i + 1) * splitSize + rmdr
            : low + (i + 1) * splitSize - 1
        ),
        count: 0,
        isValid: true
      })
    }
  }

  private updatePool(res: number) {
    const tempPool = <PoolMapItem>this.sampling_pool_map.get(this.pool_idx)
    if (!tempPool) return
    tempPool.sum += res
    tempPool.count++
    if (tempPool) this.sampling_pool_map.set(this.pool_idx, tempPool)
  }

  /* checks if valid pools are consecutive (i.e no invalid in between) */
  private isConsecutive(arr: number[]) {
    const length = arr.length,
      zeroIdxVal = arr[0]

    for (let i = 0; i < length; i++) {
      if (zeroIdxVal + i !== arr[i]) return false
    }
    return true
  }

  private elimWorst() {
    const invalid: number[] = []
    let worstKey: number,
      worstVal = -Infinity,
      absWorst = -Infinity,
      absWorstKey: number,
      comp_count = 0
    for (const [key, val] of this.sampling_pool_map) {
      if (!val.isValid) {
        invalid.push(key)
        continue
      }
      const tempAvg = val.sum / val.count
      if (val.count < this.samples_before_elim) {
        if (tempAvg > absWorst) {
          absWorst = tempAvg
          absWorstKey = key
        }
        continue
      } else {
        comp_count++
        if (tempAvg > worstVal) {
          worstKey = key
          worstVal = tempAvg
        }
        if (tempAvg > absWorst) {
          absWorst = tempAvg
          absWorstKey = key
        }
      }
    }
    if (comp_count > 1 && absWorstKey === worstKey) {
      const val = this.sampling_pool_map.get(worstKey)

      val.isValid = false
      this.sampling_pool_map.set(worstKey, val)
      this.pools_eliminated++

      this.samples_before_elim += this.pools_eliminated * 5

      /* TODO: TEST/Possibly use if valid pools are consecutive, form new sampling pools */
      /*
      if (
        this.pools_eliminated === Math.floor(this.split_count / 2) &&
        this.isConsecutive(invalid)
      ) {
        let low = Infinity,
          high = -Infinity
        for (let i = 0; i < this.split_count; i++) {
          if (invalid.includes(i)) continue

          const { pool } = this.sampling_pool_map.get(i)
          if (pool[0] < low) low = pool[0]
          const poolHigh = pool[pool.length - 1]
          if (poolHigh > high) high = poolHigh
        }
        this.getSamplingPools(low, high)
        // this.pools_eliminated = 0
      }*/
    }
  }

  public getPoolAvgs() {
    for (const [key, { sum, count, isValid }] of this.sampling_pool_map) {
      this.avg_res.set(key, { avg: sum / count, count, isValid })
    }
    return this.avg_res
  }

  private getAvgBest(mapRes: Map<number, { count: number; val: number }>) {
    let best: number,
      bestRes = Infinity,
      bestSingle: number,
      bestSingleRes = Infinity
    for (const [key, { count, val }] of mapRes) {
      if (count > 1 && val < bestRes) {
        best = key
        bestRes = val
      }
      if (val < bestSingleRes) {
        bestSingle = key
        bestSingleRes = val
      }
    }
    return { best, bestRes, bestSingle, bestSingleRes }
  }

  private randGreedyPick() {
    const { best, bestRes, bestSingle, bestSingleRes } = this.getAvgBest(this.all_tested)
    let usedInput: number
    if (bestRes < bestSingleRes) {
      usedInput = best
    } else {
      usedInput = bestSingle
    }
    for (const [key, { pool }] of this.sampling_pool_map) {
      if (pool.includes(usedInput)) {
        this.pool_idx = key
        break
      }
    }
    return usedInput
  }

  private getNewVal() {
    this.pool_idx = undefined

    // randomly select from pools, skewing towards pools w lower input vals
    let i = 0
    const indvProb = 0.55 / (this.split_count - this.pools_eliminated)
    for (const [key, { isValid, pool }] of this.sampling_pool_map) {
      if (!isValid) continue
      if (Math.random() < 1 - indvProb * (i += 1)) {
        this.pool_idx = key
        this.current_in = getRandomItem(pool).val
        break
      }
    }

    if (!this.pool_idx) {
      let bestPick: number
      if (this.all_tested.size) {
        bestPick = this.randGreedyPick()
      }
      if (bestPick) {
        this.current_in = bestPick
      } else {
        const validPools = [...this.sampling_pool_map.entries()].filter(
          ([, { isValid }]) => isValid
        )
        const { idx, val } = getRandomItem(validPools.map(([i]) => i))
        this.pool_idx = idx
        this.current_in = getRandomItem<number>(validPools[idx][1].pool).val
      }
    }

    // TODO: fix this logic
    if (this.sample_count >= this.max_sample_count) {
      this.getPoolAvgs()
      return true
    }
  }

  public getAllData() {
    return this.all_tested
  }

  public update(time_spent: number) {
    this.updatePool(time_spent)
    // update state w input & resulting time_spent
    const avg_data = this.all_tested.get(this.current_in)
    if (avg_data) {
      const { count: tempCount, val } = avg_data
      const value = (val * tempCount + time_spent) / (tempCount + 1)
      this.all_tested.set(this.current_in, { count: tempCount + 1, val: value })
    } else {
      this.all_tested.set(this.current_in, { count: 1, val: time_spent })
    }

    // console.log(this.samples_per_pool, this.getPoolAvgs())
    this.elimWorst()
    if (!this.done) {
      if (time_spent < this.best_in) {
        this.best_in = this.current_in
      }
      this.sample_count++
      return this.getNewVal()
    }
  }
}
