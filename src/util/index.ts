import { setRandomSeed } from 'bun:jsc'

setRandomSeed(Math.random() * 100000)

export const getRandomItem = <T>(arr: T[]) => {
  const idx = Math.floor(Math.random() * arr.length)
  return { val: arr[idx], idx }
}
