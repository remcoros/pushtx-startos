// uiPort
export const uiPort = 8080

export const bitcoinCoreNodes = {
  mainnet: {
    rpcUrl: 'http://bitcoind.startos:8332',
    cookiePath: '.cookie',
  },
  testnet: {
    rpcUrl: 'http://bitcoind-testnet.startos:48332',
    cookiePath: 'testnet4/.cookie',
  },
} as const

export function parseCookie(cookie: string | null): [string, string] {
  const parts = cookie?.trim().split(':')
  if (!parts || parts.length !== 2) {
    throw new Error('Invalid .cookie format')
  }
  return [parts[0], parts[1]]
}
