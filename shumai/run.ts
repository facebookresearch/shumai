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
    const m = await import(`${process.cwd()}/${args[1]}`)
    if (m.default === undefined) {
      throw `Please export a default function from ${model}`
    }
    if (m.backward === undefined) {
      throw `Please export a backward optimization function from ${model}`
    }
    if (m.loss === undefined) {
      throw `Please export a loss function from ${model}`
    }
    let loss = null
    console.log('sdf')
    sm.io.readlinesCallback(
      '/dev/stdin',
      (line) => {
        const [example, ref] = line.split('|')
        if (ref === undefined) {
          throw `No reference provided for example!`
        }
        const X = sm.io.decodeReadable(example)
        const Y = sm.io.decodeReadable(ref)
        const Y_hat = m.default(X)
        loss = m.loss(Y, Y_hat)
        m.backward(loss.backward())
        sm.util.tuiLoad(loss.toFloat32())
      },
      () => {
        if (loss !== null) {
          console.log(loss.toFloat32())
        }
      }
    )
  } else {
    throw `training over the network is not yet supported (TODO: expose loss function)`
  }
} else if (command === 'infer') {
  if (args.length < 2) {
    console.log(`Usage: shumai infer [endpoint|model.ts]`)
    process.exit(1)
  }
  const model = args[1]
  if (existsSync(model)) {
    const m = await import(`${process.cwd()}/${model}`)
    if (m.default === undefined) {
      throw `Please export a default function from ${model}`
    }
    sm.io.readlinesCallback('/dev/stdin', (line) => {
      const t = sm.io.decodeReadable(line)
      const out = m.default(t)
      console.log(sm.io.encodeReadable(out))
    })
  } else {
    const m = sm.network.remote_model(model)
    await new Promise((resolve) => {
      sm.io.readlinesCallback(
        '/dev/stdin',
        (line) => {
          const t = sm.io.decodeReadable(line)
          m(t).then((out) => {
            console.log(sm.io.encodeReadable(out))
          })
        },
        resolve
      )
    })
  }
}
