import { all, run } from '../util'
import { remote_model } from './model'

export function remote_runner(url) {
  async function get_logs() {
    const res = await fetch(`${url}/logs`)
    try {
      return await (<Promise<{ stdout: string; stderr: string }>>res.json())
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

    async serve_model(file, port = 3000) {
      const [bundled] = await run(
        `esbuild --target=esnext --format=esm --platform=node --external:bun* --external:@shumai* --bundle ${file}`
      )
      await fetch(`${url}/serve_model`, {
        method: 'POST',
        body: bundled
      })
      const chunks = url.split(':')
      return remote_model(`${chunks[0]}:${port}`, null, async (e) => {
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
    async serve_model(req: Request) {
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
      // TODO find cleaner way to call `shumai serve_model`
      bg_run = Bun.spawn(['bun', `${import.meta.dir}/../run.ts`, 'serve_model', 'entry.ts'], {
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
  const port = 3113
  console.log(`serving runner on port ${port}`)
  Bun.serve({
    async fetch(req: Request) {
      const segments = req.url.split('/')
      const path = segments[segments.length - 1]
      if (path in handler) {
        return await handler[path](req)
      }
    },
    port: port
  })
}
