import { spawn } from 'bun'
import { all, sleep } from '../util'

/** Runs all arguments as commands in parallel. */
export function run(...args) {
  const procs = []
  for (const arg of args) {
    const s = <ReadableStream>spawn(arg.split(' '), {
      stdout: 'pipe',
      stderr: null
    }).stdout
    procs.push(new Response(s).text())
  }
  return Promise.all(procs)
}
