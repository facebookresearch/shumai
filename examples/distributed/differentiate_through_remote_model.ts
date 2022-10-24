import * as sm from '@shumai/shumai'

// remote identity function
const model = sm.io.remote_model('0.0.0.0:3000')

const val = sm.scalar(1).requireGrad()

for (const _i of sm.util.range(300)) {
  const input = sm.randn([1])
  const out_ref = input.mul(sm.scalar(2))
  const out = await model(input.mul(val))

  // ensure we can differentiate through it
  const l = sm.loss.mse(out, out_ref)
  sm.optim.sgd(await l.backward(), 1e-2)
}
console.log(val.toFloat32())
