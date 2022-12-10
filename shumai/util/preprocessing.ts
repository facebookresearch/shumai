import { add, mul, scalar, sub, Tensor } from '../tensor'

interface BaseScaler {
  fit: (x: Tensor) => void
  transform: (x: Tensor) => Tensor
}

/**
 * referenced a go port of sklearn
 * reference: https://github.com/pa-m/sklearn/blob/beb861ee48b18c004bb3ec55d18bdfb42fc4a07f/preprocessing/data.go#L132
 *    - `matmul` equivalent to gonum.mat's `Dense.Mul`
 *    - `mul` equivalent to gonum.mat's `Dense.ElemMul`
 */
export class StandardScaler implements BaseScaler {
  public withMean = true
  public withStd = true
  private nSamplesSeen = 0
  public mean: Tensor
  public var: Tensor
  public scale: Tensor

  constructor() {
    this.withMean = true
    this.withStd = true
  }

  public fit(x: Tensor) {
    this.reset()
    let usedX = x
    if (x.shape.length === 1) {
      usedX = x.deepCopy().reshape([x.shape[0], 1])
    }
    return this.partialFit(usedX)
  }

  private reset() {
    this.nSamplesSeen = 0
    this.mean = null
    this.var = null
  }

  public partialFit(x: Tensor) {
    const [nSamples, nFeatures] = x.shape,
      dtype = x.dtype
    if (nSamples == 0) throw new Error('cannot calc fit for StandardScaler with `x.shape[0] == 0`')
    if (this.nSamplesSeen == 0) {
      this.var = new Tensor(new Float32Array(nFeatures).fill(0)).astype(dtype)
      this.mean = new Tensor(new Float32Array(nFeatures).fill(0)).astype(dtype)
      this.scale = new Tensor(new Float32Array(nFeatures).fill(0)).astype(dtype)
    }

    const { updatedMean, updatedVariance, updatedSampleCount } = incrementalMeanVar(
      x,
      this.mean,
      this.var,
      this.nSamplesSeen
    )
    this.mean = updatedMean
    this.var = updatedVariance
    this.nSamplesSeen = updatedSampleCount
    const tmp_scale = this.var.valueOf(),
      len = tmp_scale.length
    for (let i = 0; i < len; i++) {
      if (tmp_scale[i] == 0) {
        tmp_scale[i] = 1
      }
      tmp_scale[i] = Math.sqrt(tmp_scale[i])
    }
    this.scale = new Tensor(tmp_scale)
  }

  public transform(x: Tensor) {
    let isShapeCoerced = false,
      usedX = x
    if (x.shape.length === 1) {
      isShapeCoerced = true
      usedX = x.deepCopy().reshape([x.shape[0], 1])
    }
    const [xRows, xCols] = usedX.shape
    const xOut = new Tensor(new Float32Array(usedX.elements).fill(0)).astype(usedX.dtype).valueOf()
    const tmp_contig = usedX.valueOf()
    const tmp_mean = this.mean.valueOf(),
      tmp_scale = this.scale.valueOf()
    for (let i = 0; i < xCols; i++) {
      let mean = 0,
        scale = 1
      if (this.withMean) {
        mean = tmp_mean[i]
      }
      if (this.withStd) {
        scale = tmp_scale[i]
      }
      for (let jX = 0, jXout = 0; jX < xRows * xCols; jX = jX + xCols, jXout = jXout + xCols) {
        xOut[jXout + i] = (tmp_contig[jX + i] - mean) / scale
      }
    }
    const outShape = isShapeCoerced ? [xRows] : [xRows, xCols]
    return new Tensor(xOut).reshape(outShape).astype(x.dtype)
  }
}

function incrementalMeanVar(
  x: Tensor,
  lastMean: Tensor,
  lastVariance: Tensor,
  lastSampleCount: number
) {
  /**
   * old = stats until now
   * new = the current increment
   * updated = the aggregated stats
   */
  const [newSampleCount, nFeatures] = x.shape

  // lastSum = lastMean * lastSampleCount
  const lastSum = lastMean.deepCopy().mul(scalar(lastSampleCount).astype(x.dtype))

  // new sum
  let newSum = new Tensor(new Float32Array(nFeatures).fill(0)).astype(x.dtype)
  for (let i = 0; i < newSampleCount; i++) {
    newSum = newSum.add(x.index([i, ':']))
  }
  const updatedSampleCount = lastSampleCount + newSampleCount

  // updatedMean = (lastSum + newSum) / updatedSampleCount
  const updatedMean = lastSum.add(newSum).div(scalar(updatedSampleCount).astype(x.dtype))

  // newUnnormalizedVariance = X.var(axis=0) * newSampleCount
  let newUnnormalizedVariance = new Tensor(new Float32Array(nFeatures).fill(0)).astype(x.dtype),
    updatedUnnormalizedVariance: Tensor

  const newMean = newSum.mul(scalar(1 / newSampleCount).astype(x.dtype))

  let tmp: Tensor
  for (let i = 0; i < newSampleCount; i++) {
    tmp = sub(x.index([i, ':']), newMean)
    tmp = tmp.mul(tmp)
    newUnnormalizedVariance = newUnnormalizedVariance.add(tmp)
  }

  if (lastSampleCount == 0) {
    // avoid division by 0
    updatedUnnormalizedVariance = newUnnormalizedVariance.deepCopy()
  } else {
    const lastOverNewCount = lastSampleCount / newSampleCount
    let lastUnnormalizedVariance = lastVariance.deepCopy()
    lastUnnormalizedVariance = lastUnnormalizedVariance.mul(
      scalar(lastOverNewCount).astype(x.dtype)
    )

    /**
     * updatedUnnormalizedVariance = (
     *    lastUnnormalizedVariance +
     *    newUnnormalizedVariance +
     *    lastOverNewCount / updatedSampleCount *
     *    (lastSum / lastOverNewCount - newSum) ** 2)
     */
    tmp = lastSum.deepCopy()
    tmp = tmp.mul(scalar(1 / lastOverNewCount).astype(x.dtype))
    tmp = tmp.add(newSum)
    tmp = tmp.matmul(tmp)
    tmp = tmp.mul(scalar(lastOverNewCount / updatedSampleCount).astype(x.dtype))

    updatedUnnormalizedVariance = lastUnnormalizedVariance.deepCopy()
    updatedUnnormalizedVariance = updatedUnnormalizedVariance.add(newUnnormalizedVariance)
    updatedUnnormalizedVariance = updatedUnnormalizedVariance.add(tmp)
  }
  // updatedVariance = updatedUnnormalizedVariance / updatedSampleCount
  let updatedVariance = updatedUnnormalizedVariance.deepCopy()
  updatedVariance = updatedVariance.mul(scalar(1 / updatedSampleCount).astype(x.dtype))
  return { updatedMean, updatedVariance, updatedSampleCount }
}
