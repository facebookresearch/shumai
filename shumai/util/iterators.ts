export function* range(
  length_or_start: number,
  end_: number | null = null,
  stride_: number | null = null
) {
  let start = 0
  let end: number = length_or_start
  let stride = 1
  if (end_) {
    start = length_or_start
    end = end_
  }
  if (stride_) {
    stride = stride_
  }
  for (let i = start; i < end; i += stride) {
    yield i
  }
}

const chars = ['⡆', '⠇', '⠋', '⠙', '⠸', '⢰', '⣠', '⣄']
export function* viter(arraylike) {
  const len = arraylike.length
  if (!len) {
    throw `Cannot yet viter over unbounded iterables. Please file an issue!`
  }
  for (let i = 0; i < len; ++i) {
    const t = Math.floor(performance.now() / 100)
    console.log(
      `\u001b[2K${chars[t % chars.length]}${Math.floor((100 * i) / len)
        .toString()
        .padStart(2)}% (${i + 1}/${len})\u001b[A`
    )
    yield arraylike[i]
  }
  console.log(`\u001b[2K100% ${len}/${len}\u001b[A\n`)
}

export function shuffle<T>(array: T[]): T[] {
  let curr_idx: number = array.length
  let rand_idx: number

  while (curr_idx != 0) {
    rand_idx = Math.floor(Math.random() * curr_idx)
    curr_idx--
    ;[array[curr_idx], array[rand_idx]] = [array[rand_idx], array[curr_idx]]
  }

  return array
}
