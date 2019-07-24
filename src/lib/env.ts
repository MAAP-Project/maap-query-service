import { pick } from "./object";

export function envPick<
  T extends Record<string, string | undefined>,
  K extends keyof T
>(env: T, ...keys: K[]): Record<K, string> {
  const ret = pick(env, ...keys)
  const unsetKeys = Object.entries(ret)
    .filter(([key, value]: [string, any]) => ['', undefined].includes(value))
    .map(([key, value]: [string, any]) => key)
  if (unsetKeys.length) {
    throw new Error(`ERROR: Required keys are unset: ${unsetKeys.join(', ')}`)
  }
  return ret as Record<K, string>
}
