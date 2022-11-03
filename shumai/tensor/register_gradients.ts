import type { Tensor } from './tensor'
import * as base from './tensor'
import * as ops from './tensor_ops'
const sm = { ...base, ...ops }

type ArgType = Tensor | number | number[] | BigInt64Array | boolean

export interface GradContext {
  op_inputs: [Tensor, ...ArgType[]]
  op_result: Tensor
  grad_idx: number // index of the input to be differentiated
  grad_result: Tensor
}

function recoverShape(tensor: Tensor, originalShape: number[], lostAxes: number[]) {
  const shapeForBroadcast = [...originalShape]
  for (let axis of lostAxes) {
    if (axis < 0) {
      axis += originalShape.length
    }
    shapeForBroadcast[axis] = 1
  }
  const tensorForBroadcast = tensor.reshape(shapeForBroadcast)
  return tensorForBroadcast.add(sm.full(originalShape, 0))
}

function possiblyReduce(grad_out: Tensor, grad: GradContext) {
  const input = <Tensor>grad.op_inputs[grad.grad_idx]
  const new_shape = input.shape
  if (grad.grad_result.shape.length != input.shape.length) {
    for (let i = 0; i < grad.grad_result.shape.length - input.shape.length; ++i) {
      new_shape.push(1)
    }
  }
  const reduction_axes = []
  for (let i = 0; i < new_shape.length; ++i) {
    if (new_shape[i] === 1 && grad.grad_result.shape[i] !== 1) {
      reduction_axes.push(i)
    }
  }
  if (reduction_axes.length) {
    return grad_out.sum(reduction_axes, true)
  }
  return grad_out
}

const impls = {
  add: (grad: GradContext) => {
    return possiblyReduce(grad.grad_result, grad)
  },
  conv2d: (grad: GradContext) => {
    const [x, w, sx, sy, px, py, dx, dy, g] = <
      [Tensor, Tensor, number, number, number, number, number, number, number]
    >grad.op_inputs
    if (dx !== 1 || dy !== 1) {
      throw new Error(
        `cannot differentiate convolution with dilation (${dx}, ${dy}), please file an issue.`
      )
    } else if (sx !== sy) {
      throw new Error(
        `cannot differentiate convolution with stride (${sx}, ${sy}), please file an issue.`
      )
    } else if (px !== py) {
      throw new Error(
        `cannot differentiate convolution with padding (${px}, ${py}), please file an issue.`
      )
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const batch = x.shape[0]
    const channel_out = grad.grad_result.shape[1]
    const channel_in = x.shape[1]
    /* eslint-enable @typescript-eslint/no-unused-vars */

    const k = w.shape[2]
    if (grad.grad_idx === 0) {
      const padding = k - 1 - (sx - 1) - px
      let dxgrad = grad.grad_result
      if (sx > 1) {
        dxgrad = dxgrad.reshape(dxgrad.shape.concat([1, 1]))
        dxgrad = dxgrad
          .pad([
            [0, 0],
            [0, 0],
            [sx - 1, 0],
            [sx - 1, 0]
          ])
          .transpose([3, 4])
        const shape = grad.grad_result.shape
        dxgrad = dxgrad.reshape(shape.slice(0, 2).concat(shape.slice(2).map((x) => x * 2)))
        dxgrad = dxgrad.pad([
          [0, 0],
          [0, 0],
          [0, sx - 1],
          [0, sx - 1]
        ])
      }
      let dxw = w.flip(2).flip(3)
      if (g > 1) {
        dxw = dxw.reshape([g, dxw.shape[0] / g].concat(dxw.shape.slice(1)))
        dxw = dxw.transpose([0, 2])
        dxw = dxw.reshape([dxw.shape[0] * dxw.shape[1]].concat(dxw.shape.slice(2)))
      } else {
        dxw = dxw.transpose([1, 0, 2, 3])
      }
      return sm.conv2d(dxgrad, dxw, 1, 1, padding, padding, 1, 1, g)
    }

    const dwgrad = grad.grad_result.transpose([0, 1])
    let dwx = x.transpose([0, 1])
    if (g > 1) {
      dwx = x.reshape([x.shape[0], g, x.shape[1] / g].concat(x.shape.slice(2)))
      dwx = dwx.transpose([0, 2])
      dwx = dwx.reshape([dwx.shape[0], dwx.shape[1] * dwx.shape[2]].concat(dwx.shape.slice(3)))
    }
    return sm.conv2d(dwx, dwgrad, 1, 1, px, px, sx, sx, g)
  },
  div: (grad: GradContext) => {
    const recip = sm.scalar(1).div(<Tensor>grad.op_inputs[1])
    const go = grad.grad_result.mul(recip)
    if (grad.grad_idx === 0) {
      return possiblyReduce(go, grad)
    } else if (grad.grad_idx === 1) {
      return possiblyReduce(go.negative().mul(recip), grad)
    }
  },
  sqrt: (grad: GradContext): Tensor => {
    return grad.grad_result.div(grad.op_result.mul(sm.scalar(2)))
  },
  exp: (grad: GradContext) => {
    return sm.exp(grad.op_inputs[0])
  },
  matmul: (grad: GradContext) => {
    if (grad.grad_idx === 0) {
      const y = <Tensor>grad.op_inputs[1]
      if (grad.grad_result.shape.length === 1 && y.shape.length === 1) {
        // grad_in and y are 1D column vectors
        const expandedGradIn = grad.grad_result.reshape([grad.grad_result.shape[0], 1])
        const expandedY = y.reshape([y.shape[0], 1])
        return expandedGradIn.matmul(expandedY.T())
      }
      return grad.grad_result.matmul(y.T()) // this is 1D if grad_in is a 1D row vector
    } else if (grad.grad_idx === 1) {
      const x = <Tensor>grad.op_inputs[0]
      if (grad.grad_result.shape.length === 1 && x.shape.length === 1) {
        // grad_in and x are 1D row vectors
        const expandedGradIn = grad.grad_result.reshape([1, grad.grad_result.shape[0]])
        const expandedX = x.reshape([1, x.shape[0]])
        return expandedX.T().matmul(expandedGradIn)
      }
      return x.T().matmul(grad.grad_result) // this is 1D if grad_in is a 1D column vector
    } else {
      throw new Error(`Invalid GradContext argument`)
    }
  },
  maximum: (grad: GradContext) => {
    const a_idx = grad.grad_idx
    const b_idx = <0 | 1>(1 - grad.grad_idx)
    const mask = (<Tensor>grad.op_inputs[a_idx]).greaterThan(<Tensor>grad.op_inputs[b_idx])
    return mask.mul(grad.grad_result)
  },
  mean: (grad: GradContext) => {
    const inShape = (<Tensor>grad.op_inputs[0]).shape
    let axes = <number[]>grad.op_inputs[1]
    if (axes.length === 0) {
      axes = inShape.map((x, i) => i) // All axes
    }

    let num = 1
    for (const axis of axes) {
      num *= inShape[axis]
    }

    return recoverShape(grad.grad_result.div(sm.scalar(num)), inShape, axes)
  },
  var: (grad: GradContext) => {
    const input = <Tensor>grad.op_inputs[0]
    const inShape = input.shape
    let axes = <number[]>grad.op_inputs[1]
    if (axes.length === 0) {
      axes = inShape.map((x, i) => i)
    }

    const bias = <boolean>grad.op_inputs[2]
    let num = 1
    for (const axis of axes) {
      num *= inShape[axis]
    }
    if (bias) {
      num -= 1
    }

    const expandedGradIn = recoverShape(grad.grad_result, inShape, axes)
    const expandedMean = recoverShape(input.mean(axes), inShape, axes)

    return expandedGradIn.mul(sm.scalar(2 / num)).mul(input.sub(expandedMean))
  },
  mul: (grad: GradContext) => {
    const grad_idx = <0 | 1>(1 - grad.grad_idx)
    return possiblyReduce((<Tensor>grad.op_inputs[grad_idx]).mul(grad.grad_result), grad)
  },
  greaterThanEqual: (grad: GradContext) => {
    const o = sm.scalar(1).sub(grad.op_result)
    return grad.op_result.mul(o)
  },
  logicalNot: (grad: GradContext) => {
    const o = sm.scalar(1).sub(grad.op_result)
    return grad.op_result.mul(o)
  },
  sigmoid: (grad: GradContext) => {
    const o = sm.scalar(1).sub(grad.op_result)
    return grad.op_result.mul(o)
  },
  clip: (grad: GradContext) => {
    const result = <Tensor>grad.op_result
    const low = <Tensor>grad.op_inputs[1]
    const high = <Tensor>grad.op_inputs[2]

    const lowMask = result.greaterThan(low)
    const highMask = result.lessThan(high)
    const lowHighMask = lowMask.bitwiseAnd(highMask)
    const gradMask = sm.where(lowHighMask, grad.op_result, sm.full(grad.op_result.shape, 0))

    return gradMask
  },
  sub: (grad: GradContext) => {
    if (grad.grad_idx) {
      return possiblyReduce(grad.grad_result.negative(), grad)
    }
    return possiblyReduce(grad.grad_result, grad)
  },
  sum: (grad: GradContext) => {
    const inShape = grad.op_inputs[0].shape
    let axes = <number[]>grad.op_inputs[1]
    if (axes.length === 0) {
      axes = inShape.map((x, i) => i) // All axes
    }
    return recoverShape(grad.grad_result, inShape, axes)
  },
  tanh: (grad: GradContext) => {
    return sm.scalar(1).sub(grad.op_result.mul(grad.op_result))
  },
  concatenate: (grad: GradContext): Tensor => {
    const axis = <number>grad.op_inputs[grad.op_inputs.length - 1]
    const { grad_idx } = grad
    const prevTensors = <Tensor[]>grad.op_inputs.slice(0, grad_idx)
    const start = prevTensors.reduce((r, t) => r + t.shape[axis], 0)
    const end = start + (<Tensor>grad.op_inputs[grad_idx]).shape[axis]
    const range = grad.op_result.shape.map(() => ':')
    range[axis] = start + ':' + end

    return grad.grad_result.index(range)
  },
  transpose: (grad: GradContext): Tensor => {
    const forwardAxes = <number[]>grad.op_inputs[1]
    const reverseAxes = [...forwardAxes]
    for (let i = 0; i < forwardAxes.length; i++) {
      reverseAxes[forwardAxes[i]] = i
    } // If forwardAxes === [], reverseAxes === []
    return grad.grad_result.transpose(reverseAxes)
  },
  reshape: (grad: GradContext): Tensor => {
    const inShape = (<Tensor>grad.op_inputs[0]).shape
    return grad.grad_result.reshape(inShape)
  }
}

Object.assign(sm.gradient_functions, impls)
