import { util } from '@shumai/shumai'
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
export function tuiLoad(str: string) {
  const t = Math.floor(performance.now() / 100)
  console.log(`\u001b[2K${chars[t % chars.length]}${str}\u001b[A`)
}

function formatSeconds(seconds) {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((seconds - hours * 3600) / 60)).padStart(2, '0')
  seconds = String(Math.floor(seconds - hours * 3600 - minutes * 60)).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export function* viter(arrayLike: util.ArrayLike | number, callback?: (_: number) => string) {
  let len: number,
    is_num = false
  if (typeof arrayLike === 'number') {
    len = arrayLike
    is_num = true
  } else {
    len = arrayLike.length
  }
  if (!len) {
    throw `Cannot yet viter over unbounded iterables. Please file an issue!`
  }
  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    minimumSignificantDigits: 3,
    maximumSignificantDigits: 3
  })
  const rtf = new Intl.RelativeTimeFormat('en', {
    localeMatcher: 'best fit',
    numeric: 'always',
    style: 'long'
  })
  const eta = (i, run_per_sec) => {
    const eta_tot = (len - i) / (run_per_sec + 1e-3)
    return `@ ${formatter.format(run_per_sec)} iter/sec, done ${rtf.format(eta_tot, 'seconds')}`
  }
  let last_run = performance.now()
  let total_run = 0
  for (let i = 0; i < len; ++i) {
    const new_run = performance.now()
    total_run += (new_run - last_run)
    last_run = new_run
    const run_per_sec = 1e3 * i / total_run

    tuiLoad(
      `${Math.floor((100 * i) / len)
        .toString()
        .padStart(2)}% (${i + 1}/${len} ${eta(i, run_per_sec)})${callback ? ' ' + callback(i) : ''}`
    )
    yield is_num ? i : arrayLike[i]
  }
  console.log(`\u001b[2K100% ${len}/${len}${callback ? ' ' + callback(len) : ''}\u001b[A\n`)
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
