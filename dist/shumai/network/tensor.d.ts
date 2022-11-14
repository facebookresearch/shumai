import * as sm from '../tensor';
/** @private */
export declare function backoff(callback: any, error_handler?: any): Promise<any>;
/**
 * Similar to the Web standard {@link https://developer.mozilla.org/en-US/docs/Web/API/fetch | fetch} API, this function enables asynchronous transfer of remote tensors.
 *
 * @example
 *
 * The function can be used with the `await` keyword:
 *
 * ```javascript
 * // input and output at once
 * const i = sm.randn([128])
 * const t = await sm.network.tfetch('localhost:3000', i)
 *
 * // no expected return value
 * await sm.network.tfetch('localhost:3000', i)
 *
 * // no input
 * const t = await sm.network.tfetch('localhost:3000')
 * ```
 *
 * or with a chained callbacks:
 *
 * ```javascript
 * sm.network.tfetch('localhost:3000', i).then((t) => {
 *   // t is a tensor or null
 *   if (t) {
 *     console.log(t.shape)
 *   }
 * }).catch((err) => {
 *   console.log('hit an error retrieving this tensor...')
 * })
 * ```
 *
 * @param url - The location to either send or request the tensor from.
 * @param tensor - An optional tensor that will be sent to the remote location.
 * @returns A tensor from the remote location or null (if the response is empty)
 */
export declare function tfetch(url: string, tensor?: sm.Tensor, options?: {
    id?: string;
    grad_fn?: (grad?: any) => Promise<void | sm.Tensor>;
}): Promise<sm.Tensor>;
