// uiPort
export const uiPort = 8080

export function parseCookie(cookie: string | null): [string, string] {
  const parts = cookie?.trim().split(':')
  if (!parts || parts.length !== 2) {
    throw new Error('Invalid .cookie format')
  }
  return [parts[0], parts[1]]
}
