import { Tensor } from '../tensor/tensor'

abstract class BaseScaler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public fit(x: Tensor): any {
    // must be implemented when extending BaseScaler
  }

  public transform(x: Tensor): Tensor {
    // must be implemented when extending BaseScaler
    return x
  }
}

export class StandardScaler extends BaseScaler {
  public withMean = true
  public withStd = true
  public scale: Tensor
  public mean: Tensor
  public var: Tensor

  constructor() {
    super()
    this.withMean = true
    this.withStd = true
  }

  public fit(x: Tensor) {
    this.reset()
    this.mean = x.mean([0], true)
    this.var = x.std([0], true)
  }

  private reset() {
    this.mean = null
    this.scale = null
    this.var = null
  }

  public transform(x: Tensor): Tensor {
    const shape = x.shape
    const xOut = x.deepCopy().asContiguousTensor().valueOf()
    const len = xOut.length
    for (let i = 0; i < len; i++) {
      xOut[i] = (xOut[i] - this.mean.valueOf()) / this.var.valueOf()
    }
    return new Tensor(xOut).reshape(shape).astype(x.dtype)
  }
}
