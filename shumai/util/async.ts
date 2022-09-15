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
export function all(...args: Promise<any>[]) {
  return Promise.all(args)
}
