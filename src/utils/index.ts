export const getRandomItem = <T>(arr: T[]) => {
  const idx = Math.floor(Math.random() * arr.length)
  return { val: arr[idx], idx }
}
