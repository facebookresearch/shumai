/**
 * Below are some examples of how to use functions in the `network` namespace.
 *
 * ### Inference
 *
 * Want to expose your model to the network? Use {@link network.serve | `network.serve`}:
 *
 * ```javascript
 * import * as sm from '@shumai/shumai'
 * import { model } from './model'
 *
 * sm.network.serve({
 *   run_model: (_, input) => {
 *     // output tensors are automatically serialized
 *     return model(input)
 *   }
 * })
 * ```
 *
 * A client can use {@link network.tfetch | `network.tfetch`} (basically `fetch` but for Tensors):
 *
 * ```javascript
 * import * as sm from '@shumai/shumai'
 *
 * const input = sm.randn([128])
 * const url = 'localhost:3000/run_model'
 * const output = await sm.network.tfetch(url, input)
 * ```
 * ### Training
 *
 * Want to train your model over the network? Just add an endpoint for a backward pass to `network.serve`:
 *
 * ```javascript
 * sm.network.serve({
 *   run_model: (user, input) => {
 *     const out = model(input)
 *     // capture a backward pass
 *     user.opt = (jacobian) => {
 *       sm.optim.sgd(out.backward(jacobian), 1e-3)
 *     }
 *     return out
 *   }
 *   optimize_model: (user, jacobian) => {
 *     // run it when that same user gives us a jacobian
 *     user.opt(jacobian)
 *   }
 * })
 * ```
 *
 * And the client can feed the jacobian with `network.tfetch`:
 *
 * ```javascript
 * const url = 'localhost:3000'
 * for (let i of sm.range(100)) {
 *   const [input, ref_output] = get_data()
 *   const output = await sm.network.tfetch(`${url}/run_model`, input)
 *
 *   // get the jacobian from a loss function
 *   output.requires_grad = true
 *   const loss = sm.loss.mse(output, ref_output)
 *   loss.backward()
 *
 *   // send that jacobian back
 *   await sm.network.tfetch(`${url}/optimize_model`, output.grad)
 * }
 * ```
 *
 * ### Wrappers
 *
 * Shumai provides wrapper for the above setup code. {@link network.serve_model | `network.serve_model`} will create `/forward` and `/optimize` endpoints for you.
 *
 * ```javascript
 * import * as sm from '@shumai/shumai'
 * import { model } from './model'
 *
 * sm.network.serve_model(model, sm.optim.sgd)
 * ```
 *
 * And the client can attach with {@link network.remote_model | `network.remote_model`}, which attaches a hook to `backward` for automatic gradients.
 *
 * ```javascript
 * import * as sm from '@shumai/shumai'
 *
 * const model = sm.network.remote_model('localhost:3000')
 *
 * for (let i of sm.range(100)) {
 *   const [input, ref_output] = get_data()
 *   const output = await model(input)
 *
 *   const loss = sm.loss.mse(ref_output, output)
 *
 *   // async now, as it propagates through the network
 *   await loss.backward()
 * }
 * ```
 *
 * ### Composition
 *
 * Want to run more than just a trivial remote trainer? Below is a distributed model parallel and pipelined server.  We invoke multiple remote models and then make our own model server.
 *
 * ```javascript
 * import * as sm from '@shumai/shumai'
 *
 * const A = sm.network.remote_model('localhost:3001')
 * const B = sm.network.remote_model('localhost:3002')
 * const C = sm.network.remote_model('localhost:3003')
 *
 * // no need to wrap this, autograd knows what's up
 * const weight = sm.randn([128, 128]).requireGrad()
 *
 * function model(input) {
 *   // this will run in parallel
 *   const [a, b] = await sm.util.all(
 *     A(input),
 *     B(input)
 *   )
 *   // automatically pipelined (isn't async great?)
 *   const c = await C(a)
 *   return c.mul(b).matmul(weight)
 * }
 *
 * sm.network.serve_model(model, sm.optim.sgd)
 * ```
 *
 * Same client as before :)
 *
 * ### What about debugging?
 *
 * All `network.serve*` methods automatically give us basic `/statistics` as JSON:
 *
 * ```bash
 * $ curl -s localhost:3000/statistics | jq
 * (env) bwasti@bwasti-mbp shumai % curl -s localhost:3000/statistics|jq
 * {
 *   "forward": {
 *     "hits": 1000,
 *     "seconds": 0.12337932200005891
 *   },
 *   "optimize": {
 *     "hits": 1000,
 *     "seconds": 0.16975503499999103
 *   }
 * }
 * ```
 * but we can always add more:
 *
 * ```javascript
 * sm.network.serve_model(model, sm.optim.sgd, {port:3000}, {
 *   statistics: () => {
 *     return {weight: weight.mean().toFloat32()}
 *   }
 * })
 * ```
 *
 * ```bash
 * $ curl -s localhost:3000/statistics | jq .weight
 * 0.1128062978386879
 * ```
 * including recursively:
 *
 * ```javascript
 * sm.network.serve_model(model, sm.optim.sgd, {port:3000}, {
 *   statistics: async () => {
 *     return {A: await (await fetch('localhost:3001/statistics')).json()}
 *   }
 * })
 * ```
 * @module
 */
export * from './model'
export * from './runner'
export * from './tensor'
