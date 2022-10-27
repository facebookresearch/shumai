#!/usr/bin/env bun

import * as sm from '@shumai/shumai'

const bun = process.argv[0]
const this_file = process.argv[1]
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(`Usage: shumai [serve|serve_model]`)
  process.exit(0)
}

const command = args[0]
if (command === 'serve') {
  sm.network.serve_runner()
}
if (command === 'serve_model') {
  if (args.length < 2) {
    console.log(`Usage: shumai serve_model [file]`)
    process.exit(1)
  }
  const m = await import(`${process.cwd()}/${args[1]}`)
  sm.network.serve_model(m.default, m.backward, m.options)
}
