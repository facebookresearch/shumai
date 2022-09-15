export function sleep(ms: number) {
  return new Promise((r, _) => {
    setTimeout(r, ms)
  })
}

export function all(...args: Promise[]) {
  return Promise.all(args)
}
