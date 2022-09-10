import { setRandomSeed } from 'bun:jsc'

setRandomSeed(Math.random() * 100000)

export const getRandomItem = <T>(arr: T[]) => {
  const idx = Math.floor(Math.random() * arr.length)
  return { val: arr[idx], idx }
}

export function shuffle(array: any[]) {
  let curr_idx: number = array.length
  let rand_idx: number

  while (curr_idx != 0) {
    rand_idx = Math.floor(Math.random() * curr_idx)
    curr_idx--
    ;[array[curr_idx], array[rand_idx]] = [array[rand_idx], array[curr_idx]]
  }

  return array
}
