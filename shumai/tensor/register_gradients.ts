import type { Tensor } from './tensor'
import * as base from './tensor'
import * as ops from './tensor_ops'
const sm = { ...base, ...ops }

type ArgType = Tensor | number | number[] | BigInt64Array | boolean

export interface GradContext {
  forward_inputs: [Tensor, ...ArgType[]]
  forward_output: Tensor
  backward_input: Tensor // the associated gradient of forward_output
  backward_output_index: number // // index of the associated forward input to be differentiated
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

function possiblyReduce(grad_out: Tensor, ctx: GradContext) {
  const input = <Tensor>ctx.forward_inputs[ctx.backward_output_index]
  const new_shape = input.shape
  if (ctx.backward_input.shape.length != input.shape.length) {
    for (let i = 0; i < ctx.backward_input.shape.length - input.shape.length; ++i) {
      new_shape.push(1)
    }
  }
  const reduction_axes = []
  for (let i = 0; i < new_shape.length; ++i) {
    if (new_shape[i] === 1 && ctx.backward_input.shape[i] !== 1) {
      reduction_axes.push(i)
    }
  }
  if (reduction_axes.length) {
    return grad_out.sum(reduction_axes, true)
  }
  return grad_out
}

const impls = {
  add: (ctx: GradContext) => {
    return possiblyReduce(ctx.backward_input, ctx)
  },
  conv2d: (ctx: GradContext) => {
    const [x, w, sx, sy, px, py, dx, dy, g] = <
      [Tensor, Tensor, number, number, number, number, number, number, number]
    >ctx.forward_inputs
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
    const channel_out = ctx.backward_input.shape[1]
    const channel_in = x.shape[1]
    /* eslint-enable @typescript-eslint/no-unused-vars */

    const k = w.shape[2]
    if (ctx.backward_output_index === 0) {
      const padding = k - 1 - (sx - 1) - px
      let dxgrad = ctx.backward_input
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
        const shape = ctx.backward_input.shape
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

    const dwgrad = ctx.backward_input.transpose([0, 1])
    let dwx = x.transpose([0, 1])
    if (g > 1) {
      dwx = x.reshape([x.shape[0], g, x.shape[1] / g].concat(x.shape.slice(2)))
      dwx = dwx.transpose([0, 2])
      dwx = dwx.reshape([dwx.shape[0], dwx.shape[1] * dwx.shape[2]].concat(dwx.shape.slice(3)))
    }
    return sm.conv2d(dwx, dwgrad, 1, 1, px, px, sx, sx, g)
  },
  div: (ctx: GradContext) => {
    const recip = sm.scalar(1).div(<Tensor>ctx.forward_inputs[1])
    const go = ctx.backward_input.mul(recip)
    if (ctx.backward_output_index === 0) {
      return possiblyReduce(go, ctx)
    } else if (ctx.backward_output_index === 1) {
      return possiblyReduce(go.negative().mul(recip), ctx)
    }
  },
  sqrt: (ctx: GradContext): Tensor => {
    return ctx.backward_input.div(ctx.forward_output.mul(sm.scalar(2)))
  },
  exp: (ctx: GradContext) => {
    return sm.exp(ctx.forward_inputs[0])
  },
  matmul: (ctx: GradContext) => {
    if (ctx.backward_output_index === 0) {
      const y = <Tensor>ctx.forward_inputs[1]
      if (ctx.backward_input.shape.length === 1 && y.shape.length === 1) {
        // backward_input and y are 1D column vectors
        const expandedGradIn = ctx.backward_input.reshape([ctx.backward_input.shape[0], 1])
        const expandedY = y.reshape([y.shape[0], 1])
        return expandedGradIn.matmul(expandedY.T())
      }
      return ctx.backward_input.matmul(y.T()) // this is 1D if backward_input is a 1D row vector
    } else if (ctx.backward_output_index === 1) {
      const x = <Tensor>ctx.forward_inputs[0]
      if (ctx.backward_input.shape.length === 1 && x.shape.length === 1) {
        // backward_input and x are 1D row vectors
        const expandedGradIn = ctx.backward_input.reshape([1, ctx.backward_input.shape[0]])
        const expandedX = x.reshape([1, x.shape[0]])
        return expandedX.T().matmul(expandedGradIn)
      }
      return x.T().matmul(ctx.backward_input) // this is 1D if backward_input is a 1D column vector
    } else {
      throw new Error(`Invalid GradContext argument`)
    }
  },
  maximum: (ctx: GradContext) => {
    const a_idx = ctx.backward_output_index
    const b_idx = <0 | 1>(1 - ctx.backward_output_index)
    const mask = (<Tensor>ctx.forward_inputs[a_idx]).greaterThan(<Tensor>ctx.forward_inputs[b_idx])
    return mask.mul(ctx.backward_input)
  },
  mean: (ctx: GradContext) => {
    const inShape = (<Tensor>ctx.forward_inputs[0]).shape
    let axes = <number[]>ctx.forward_inputs[1]
    if (axes.length === 0) {
      axes = inShape.map((x, i) => i) // All axes
    }

    let num = 1
    for (const axis of axes) {
      num *= inShape[axis]
    }

    return recoverShape(ctx.backward_input.div(sm.scalar(num)), inShape, axes)
  },
  var: (ctx: GradContext) => {
    const input = <Tensor>ctx.forward_inputs[0]
    const inShape = input.shape
    let axes = <number[]>ctx.forward_inputs[1]
    if (axes.length === 0) {
      axes = inShape.map((x, i) => i)
    }

    const bias = <boolean>ctx.forward_inputs[2]
    let num = 1
    for (const axis of axes) {
      num *= inShape[axis]
    }
    if (bias) {
      num -= 1
    }

    const expandedGradIn = recoverShape(ctx.backward_input, inShape, axes)
    const expandedMean = recoverShape(input.mean(axes), inShape, axes)

    return expandedGradIn.mul(sm.scalar(2 / num)).mul(input.sub(expandedMean))
  },
  mul: (ctx: GradContext) => {
    const backward_output_index = <0 | 1>(1 - ctx.backward_output_index)
    return possiblyReduce(
      (<Tensor>ctx.forward_inputs[backward_output_index]).mul(ctx.backward_input),
      ctx
    )
  },
  greaterThanEqual: (ctx: GradContext) => {
    return ctx.backward_input.mul(ctx.forward_output).mul(sm.scalar(1).sub(ctx.forward_output))
  },
  logicalNot: (ctx: GradContext) => {
    return ctx.backward_input.mul(ctx.forward_output).mul(sm.scalar(1).sub(ctx.forward_output))
  },
  sigmoid: (ctx: GradContext) => {
    return ctx.backward_input.mul(ctx.forward_output).mul(sm.scalar(1).sub(ctx.forward_output))
  },
  clip: (ctx: GradContext) => {
    const result = <Tensor>ctx.forward_output
    const low = <Tensor>ctx.forward_inputs[1]
    const high = <Tensor>ctx.forward_inputs[2]

    const lowMask = result.greaterThan(low)
    const highMask = result.lessThan(high)
    const lowHighMask = lowMask.bitwiseAnd(highMask)
    const gradMask = sm.where(lowHighMask, ctx.forward_output, sm.full(ctx.forward_output.shape, 0))

    return gradMask
  },
  erf: (ctx: GradContext) => {
    const input = <Tensor>ctx.forward_inputs[0]
    return ctx.backward_input
      .mul(sm.scalar(2))
      .div(sm.sqrt(sm.scalar(Math.PI)))
      .mul(sm.exp(input.mul(input).mul(sm.scalar(-1))))
  },
  minimum: (ctx: GradContext) => {
    const input = <Tensor>ctx.forward_inputs[0]
    const rhsVal = <Tensor>ctx.forward_inputs[1]
    const mask = input.lessThan(rhsVal).astype(ctx.backward_input.dtype)
    return mask.mul(ctx.backward_input)
  },
  sub: (ctx: GradContext) => {
    if (ctx.backward_output_index) {
      return possiblyReduce(ctx.backward_input.negative(), ctx)
    }
    return possiblyReduce(ctx.backward_input, ctx)
  },
  sum: (ctx: GradContext) => {
    const inShape = ctx.forward_inputs[0].shape
    let axes = <number[]>ctx.forward_inputs[1]
    if (axes.length === 0) {
      axes = inShape.map((x, i) => i) // All axes
    }
    return recoverShape(ctx.backward_input, inShape, axes)
  },
  tanh: (ctx: GradContext) => {
    return sm.scalar(1).sub(ctx.forward_output.mul(ctx.forward_output))
  },
  concatenate: (ctx: GradContext): Tensor => {
    const axis = <number>ctx.forward_inputs[ctx.forward_inputs.length - 1]
    const { backward_output_index } = ctx
    const prevTensors = <Tensor[]>ctx.forward_inputs.slice(0, backward_output_index)
    const start = prevTensors.reduce((r, t) => r + t.shape[axis], 0)
    const end = start + (<Tensor>ctx.forward_inputs[backward_output_index]).shape[axis]
    const range = ctx.forward_output.shape.map(() => ':')
    range[axis] = start + ':' + end

    return ctx.backward_input.index(range)
  },
  transpose: (ctx: GradContext): Tensor => {
    const forwardAxes = <number[]>ctx.forward_inputs[1]
    const reverseAxes = [...forwardAxes]
    for (let i = 0; i < forwardAxes.length; i++) {
      reverseAxes[forwardAxes[i]] = i
    } // If forwardAxes === [], reverseAxes === []
    return ctx.backward_input.transpose(reverseAxes)
  },
  reshape: (ctx: GradContext): Tensor => {
    const inShape = (<Tensor>ctx.forward_inputs[0]).shape
    return ctx.backward_input.reshape(inShape)
  },
  where: (ctx: GradContext): Tensor => {
    const zeros = sm.full(ctx.backward_input.shape, 0)
    if (ctx.backward_output_index === 0) {
      throw new Error(`Gradient cannot be propagated to the cond Tensor`)
    } else if (ctx.backward_output_index === 1) {
      return sm.where(ctx.forward_inputs[0], ctx.backward_input, zeros)
    } else if (ctx.backward_output_index === 2) {
      return sm.where(ctx.forward_inputs[0], zeros, ctx.backward_input)
    } else {
      throw new Error(`Invalid Grad argument`)
    }
  }
}

Object.assign(sm.gradient_functions, impls)
