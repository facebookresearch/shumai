import { spawn } from 'bun'

/** Runs all arguments as commands in parallel. */
export function run(...args) {
  const procs = []
  for (const arg of args) {
    procs.push(
      new Response(
        spawn(arg.split(' '), {
          stdout: 'inherit'
        }).stdout
      ).text()
    )
  }
  return Promise.all(procs)
}
