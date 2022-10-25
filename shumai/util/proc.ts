import { spawn } from 'bun'
import { remote_model } from '../io'
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

export function remote_runner(url) {
  async function get_logs() {
    const res = await fetch(`${url}/logs`)
    try {
      return await res.json()
    } catch (e) {
      return { stdout: '', stderr: '' }
    }
  }

  return {
    async shell(cmd) {
      const response = await fetch(`${url}/shell`, {
        method: 'POST',
        body: cmd
      })
      return await response.text()
    },

    logs: get_logs,

    async load(file) {
      const bundled = await run(
        `esbuild --target=esnext --format=esm --platform=node --external:bun* --external:@shumai* --bundle ${file}`
      )
      await fetch(`${url}/load`, {
        method: 'POST',
        body: bundled
      })
      const chunks = url.split(':')
      return remote_model(`${chunks[0]}:3001`, null, async (e) => {
        const logs = await get_logs()
        throw `Error using remote runner: ${e}, logs below:\n${logs.stderr}`
      })
    }
  }
}

export function serve_runner() {
  let bg_run = null
  const handler = {
    async shell(req: Request) {
      const cmd = await req.text()
      return new Response((await run(cmd))[0])
    },
    async load(req: Request) {
      if (bg_run) {
        console.log(`killing old server, pid=${bg_run.pid}`)
        try {
          bg_run.kill(9)
        } catch (e) {
          console.log(`not found, ignoring`)
        }
        bg_run = null
      }
      const file = await req.text()
      await Bun.write(`entry.ts`, file)
      console.log('receieved new server file')
      bg_run = spawn(['bun', 'entry.ts'], {
        stdout: Bun.file('stdout.log'),
        stderr: Bun.file('stderr.log')
      })
      console.log(`spawned new server, pid=${bg_run.pid}`)
      return new Response('done')
    },
    async logs(req: Request) {
      const [stdout, stderr] = await all(
        Bun.file('stdout.log').text(),
        Bun.file('stderr.log').text()
      )
      return new Response(
        JSON.stringify({
          stdout: stdout,
          stderr: stderr
        })
      )
    }
  }
  Bun.serve({
    async fetch(req: Request) {
      const segments = req.url.split('/')
      const path = segments[segments.length - 1]
      if (path in handler) {
        return await handler[path](req)
      }
    },
    port: 3113
  })
}
