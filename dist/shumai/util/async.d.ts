/** Sleeps for the number of milliseconds passed in. */
export declare function sleep(ms: number): Promise<unknown>;
/** Executes passed in Promises/async calls in parallel, collecting results into the output array.
 *
 * @example
 * ```javascript
 * const vals = await sm.util.all(
 *   sm.util.sleep(100),
 *   (async () => {
 *     await sm.util.sleep(100)
 *     return 8
 *   })()
 * )
 * expect(vals[1]).toBe(8)
 * ```
 *
 * */
export declare function all<T extends any[]>(...args: Promise<T[number]>[]): Promise<Awaited<T>[]>;
