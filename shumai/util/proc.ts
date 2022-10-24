import { spawn } from 'bun'

/** Runs all arguments as commands in parallel. */
export function run(...args) {
  const procs = []
  for (const arg of args) {
    const s = <ReadableStream>spawn(arg.split(' '), {
      stdout: 'inherit'
    }).stdout
    procs.push(new Response(s).text())
  }
  return Promise.all(procs)
}
