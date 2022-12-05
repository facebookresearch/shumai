import { Tensor } from '../tensor/tensor'

interface BaseScaler {
  fit: (x: Tensor) => void
  transform: (x: Tensor) => Tensor
}

export class StandardScaler implements BaseScaler {
  public withMean = true
  public withStd = true
  public mean: Tensor
  public var: Tensor

  constructor() {
    this.withMean = true
    this.withStd = true
  }

  public fit(x: Tensor) {
    this.reset()
    this.mean = x.mean([0])
    this.var = x.std()
  }

  private reset() {
    this.mean = null
    this.var = null
  }

  public transform(x: Tensor): Tensor {
    const shape = x.shape
    const dtype = x.dtype
    const xOut = x.deepCopy().valueOf()
    const mean = Array.isArray(this.mean.valueOf()) ? this.mean.valueOf()[0] : this.mean.valueOf()
    const usedVar = this.var.valueOf()
    console.log('mean', mean)
    console.log('usedVar', usedVar)
    const len = xOut.length
    for (let i = 0; i < len; i++) {
      xOut[i] = (xOut[i] - mean) / usedVar
    }
    return new Tensor(xOut).reshape(shape).astype(dtype)
  }
}
