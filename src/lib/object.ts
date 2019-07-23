export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const ret: any = {}
  keys.forEach((key: K) => {
    ret[key] = obj[key]
  })
  return ret
}
