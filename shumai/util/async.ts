export function sleep(ms: number) {
  return new Promise((r, _) => {
    setTimeout(r, ms)
  })
}

export function all(...args: Promise<any>[]) {
  return Promise.all(args)
}
