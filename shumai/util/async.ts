/** Sleeps for the number of milliseconds passed in. */
export function sleep(ms: number) {
  return new Promise((r, _) => {
    setTimeout(r, ms)
  })
}

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function all<T extends any[]>(...args: Promise<T[number]>[]): Promise<Awaited<T>[]> {
  return Promise.all<T>(args)
}
