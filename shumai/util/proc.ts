import { spawn } from 'bun'

/** Runs all arguments as commands in parallel. */
export function run(...args) {
  const procs: Promise<string>[] = []
  for (const arg of args) {
    const s = <ReadableStream>spawn(arg.split(' '), {
      stdout: 'pipe',
      stderr: null
    }).stdout
    procs.push(new Response(s).text())
  }
  return Promise.all(procs)
}
