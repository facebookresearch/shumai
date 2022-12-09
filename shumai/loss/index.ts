import * as sm from '../tensor'
export * from './mse'

export type LossFn = (a: sm.Tensor, b: sm.Tensor) => sm.Tensor

/**
 * Mean absolute error for regression
 * Also known as L1-loss
 *
 * $$\frac{1}{n}\sum_{i=1}^{n}|y_{i}-\hat{y}_{i}|$$
 */
export function mae(): LossFn {
  return (y, p) => sm.mean(sm.abs(sm.sub(y, p)))
}

/**
 * Cross-entropy loss for multi-class classification
 * Use with softmax on the final activation layer
 *
 * $$-\sum_{k=1}^Ky_{i,k}\log\hat{y}_{i,k}$$
 */
export function crossEntropy(): LossFn {
  return (y, p) => sm.mul(sm.scalar(-1), sm.mean(sm.sum(sm.mul(y, clippedLog(p)), [1])))
}

/**
 * Binary cross-entropy loss for two-class classification
 * Use with sigmoid on the final activation layer
 *
 * $$-y_i\log\hat{y}_i+(1-y_i)\log(1-\hat{y}_i)$$
 */
export function binaryCrossEntropy(): LossFn {
  return (y, p) =>
    sm.mul(
      sm.scalar(-1),
      sm.mean(
        sm.add(
          sm.mul(y, clippedLog(p)),
          sm.mul(sm.scalar(1).sub(y), clippedLog(sm.scalar(1).sub(p)))
        )
      )
    )
}

/** Ensures we have a finite loss near log(0), matches torch implementation */
function clippedLog(x: sm.Tensor): sm.Tensor {
  return sm.maximum(sm.log(x), sm.scalar(-100))
}
