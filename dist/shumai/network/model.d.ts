/// <reference types="bun-types" />
import type { Errorlike, Server } from 'bun';
import { Module } from '../module';
import { OptimizerFn } from '../optim';
import * as sm from '../tensor';
/**
 * Connect to a remote model as if it were a local differentiable function.
 *
 * @remarks
 *
 * This function assumes a server running {@link network.serve_model | `network.serve_model`}.
 *
 * @example
 *
 * Similar to {@link network.tfetch | `network.tfetch`}, the `await` keyword may be used:
 *
 * ```javascript
 * const model = sm.network.remote_model('localhost:3000')
 * const input = sm.randn([128])
 * // await is necessary, as model invocation is asynchronous
 * const output = await model(input)
 * const loss = sm.loss.mse(output, reference)
 * // note the use of the await keyword for the backward pass
 * await loss.backward()
 * ```
 * or chained callbacks:
 *
 * ```javascript
 * model(input).then((output) => {
 *   loss_fn(output).backward()
 * }).then(() => {
 *   console.log('backward executed!')
 * })
 * ```
 *
 * @param url - The location of the remote model (must be running {@link network.serve_model | `network.serve_model`}).
 * @returns An asynchronous function that can be invoked with an input tensor.
 */
export declare function remote_model(url: string, backward_url?: string, error_handler?: any): (t: sm.Tensor) => Promise<any>;
export declare type OpStats = {
    bytes: bigint;
    time: number;
};
export declare type TensorOpStats = Record<string, OpStats>;
export declare type RouteStats = {
    hits: number;
    seconds: number;
    op_stats?: OpStats;
};
export declare type NetworkServeOpts = {
    port?: string | number;
    hostname?: string;
    baseURI?: string;
    maxRequestBodySize?: number;
    development?: boolean;
    error?: (this: Server, request: Errorlike) => Response | Promise<Response> | undefined | Promise<undefined>;
};
/**
 * Spawn an HTTP server to handle tensor input and output requests.
 *
 * @remarks
 * This function does not return.  The default port is 3000.
 *
 * @example
 *
 * ```javascript
 * // any function with tensor inputs/outputs can be served
 * function genRandTensor() {
 *   return sm.rand([128])
 * }
 *
 * // async functions can be served as well
 * async function talkToServer() {
 *   const t = await sm.network.tfetch(different_server)
 *   return t.mul(sm.rand([128]))
 * }
 *
 * sm.network.serve({
 *   genRandTensor: genRandTensor,
 *   remoteCall: talkToServer
 * })
 * ```
 *
 * The above functions are accessible from a different process with {@link network.tfetch | `network.tfetch`}:
 * ```javascript
 * const t0 = await sm.network.tfetch(`${host}:3000/genRandTensor`)
 * const t1 = await sm.network.tfetch(`${host}:3000/remoteCall`)
 * ```
 *
 * @param request_dict - A map of endpoint names to the underlying (possibly async) function calls.
 * @param options - A set of options passed to the underlying Bun.serve call.
 */
export declare function serve(request_dict: Record<string, (...args: unknown[]) => Promise<unknown> | unknown | void>, options: NetworkServeOpts): void;
/**
 * Serve a model with forward and optimization endpoints.
 *
 * @remarks
 *
 * This server is to be used with {@link network.remote_model | `network.remote_model`}.
 * The function does not return.
 *
 * @example
 *
 * ```javascript
 * const weight = sm.randn([128, 128]).requireGrad()
 * function model(input) {
 *   return input.matmul(weight).maximum(sm.scalar(0))
 * }
 *
 * function optimize(differentiated_tensors) {
 *   for (let t of differentiated_tensors) {
 *     t.update(t.add(t.grad.mul(sm.scalar(1e-3))))
 *   }
 * }
 * sm.network.serve_model(model, optimize)
 * ```
 *
 * Additional functions can also be served (as in {@link network.serve | `network.serve`}):
 *
 * ```javascript
 * function extraMethod() {
 *   return sm.identity(7)
 * }
 * sm.network.serve_model(model, sm.optim.sgd, {port:3000}, {
 *   ident: extraMethod
 * })
 * ```
 *
 * @param fn - A function that will run on forward calls
 * @param grad_update - A function that will run on backward calls, with a list of differentiated tensors passed in
 * @param options - An optional list of options passed to the underlying Bun.serve call
 * @param req_map - An optional map of additional handlers passed to the underlying {@link network.serve | `network.serve`} call
 *
 */
export declare function serve_model(fn: ((t: sm.Tensor) => sm.Tensor | Promise<sm.Tensor>) | Module, grad_update?: OptimizerFn, options?: NetworkServeOpts, req_map?: Record<string, (...args: unknown[]) => Promise<unknown> | unknown | void>): void;
