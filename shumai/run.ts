#!/usr/bin/env bun

import * as sm from '@shumai/shumai'
import { existsSync } from 'fs'

const bun = process.argv[0]
const this_file = process.argv[1]
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(`Usage: shumai [serve|train|infer]`)
  process.exit(0)
}

const command = args[0]
if (command === 'serve') {
  if (args.length < 2) {
    sm.network.serve_runner()
  } else {
    const m = await import(`${process.cwd()}/${args[1]}`)
    sm.network.serve_model(m.default, m.backward, m.options)
  }
} else if (command === 'train') {
  if (args.length < 2) {
    console.log(`Usage: shumai train [endpoint|model.ts]`)
    process.exit(1)
  }
  const model = args[1]
  if (existsSync(model)) {
  } else {
  }
} else if (command === 'infer') {
  if (args.length < 2) {
    console.log(`Usage: shumai infer [endpoint|model.ts]`)
    process.exit(1)
  }
  const model = args[1]
  if (existsSync(model)) {
  } else {
  }
}
