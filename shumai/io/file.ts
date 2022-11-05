import { createReadStream } from 'node:fs'

/**
 *
 * An extremely fast JavaScript native (bun) line reader for use with
 * arbitrary files.  This is included as a utility for manual data pre-processing.
 *
 * @example
 *
 * ```javascript
 * for await (let line of sm.io.readlines('myfile.txt')) {
 *   console.log(line.split(',')[0])
 * }
 * ```
 *
 * @param filename - The file to open and asynchronously read from
 * @param utfLabel - The label of the encoder
 * @param buffer_len - The size of the buffer to read into before flushing to the user
 * @returns A generator of each line in the file
 */
export async function* readlines(filename: string, utfLabel: Encoding = 'utf-8', buffer_len = 16) {
  const stream = Bun.file(filename).stream()
  const reader = stream.getReader()
  const td = new TextDecoder(utfLabel)
  let overflow = null
  let buffer = []

  function flush_buffer() {
    const flushed = []
    for (const b of buffer) {
      flushed.push(td.decode(b))
    }
    buffer = []
    return flushed
  }

  function add_to_buffer(b) {
    buffer.push(b)
    if (buffer.length >= buffer_len) {
      return flush_buffer()
    }
    return []
  }

  while (true) {
    const b = await reader.read()
    if (!b.value) {
      break
    }
    const value = b.value
    let i = -1
    let last_nl = 0
    while ((i = value.indexOf('\n'.charCodeAt(0), i + 1)) >= 0) {
      const next_line = value.slice(last_nl, i)
      if (overflow && overflow.length) {
        const merge = new Uint8Array(overflow.length + next_line.length)
        merge.set(overflow)
        merge.set(next_line, overflow.length)
        for (const d of add_to_buffer(merge)) {
          yield d
        }
        overflow = null
      } else {
        for (const d of add_to_buffer(next_line)) {
          yield d
        }
      }
      if (i >= 0) {
        last_nl = i + 1
      }
    }
    if (last_nl != value.length) {
      overflow = value.slice(last_nl, value.length)
    }
  }
  if (overflow) {
    for (const d of add_to_buffer(overflow)) {
      yield d
    }
  }
  for (const d of flush_buffer()) {
    yield d
  }
}

export function readlinesCallback(
  filename: string,
  callback,
  utfLabel: Encoding = 'utf-8',
  buffer_len = 16
) {
  const stdin = createReadStream(filename)
  const td = new TextDecoder(utfLabel)
  let overflow = null
  let buffer = []

  function flush_buffer() {
    const flushed = []
    for (const b of buffer) {
      flushed.push(td.decode(b))
    }
    buffer = []
    return flushed
  }

  function add_to_buffer(b) {
    buffer.push(b)
    if (buffer.length >= buffer_len) {
      return flush_buffer()
    }
    return []
  }
  stdin.on('data', (value) => {
    let i = -1
    let last_nl = 0
    while ((i = value.indexOf('\n'.charCodeAt(0), i + 1)) >= 0) {
      const next_line = value.slice(last_nl, i)
      if (overflow && overflow.length) {
        const merge = new Uint8Array(overflow.length + next_line.length)
        merge.set(overflow)
        merge.set(next_line, overflow.length)
        for (const d of add_to_buffer(merge)) {
          callback(d)
        }
        overflow = null
      } else {
        for (const d of add_to_buffer(next_line)) {
          callback(d)
        }
      }
      if (i >= 0) {
        last_nl = i + 1
      }
    }
    if (last_nl != value.length) {
      overflow = value.slice(last_nl, value.length)
    }
  })
  stdin.on('close', () => {
    if (overflow) {
      for (const d of add_to_buffer(overflow)) {
        callback(d)
      }
    }
    for (const d of flush_buffer()) {
      callback(d)
    }
  })
}
