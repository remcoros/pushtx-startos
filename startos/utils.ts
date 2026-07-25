import {
  rpcHostId as mainnetRpcHostId,
  rpcPort as mainnetRpcPort,
  rpccookiefile as mainnetCookiePath,
} from 'bitcoin-core-startos/startos/utils'
import {
  rpcHostId as testnetRpcHostId,
  rpcPort as testnetRpcPort,
  rpccookiefile as testnetCookiePath,
} from 'bitcoin-core-testnet-startos/startos/utils'

// uiPort
export const uiPort = 8080
export const uiHostId = 'main'
export const uiInterfaceId = 'ui'

export const bitcoinCoreNodes = {
  mainnet: {
    packageId: 'bitcoind',
    hostId: mainnetRpcHostId,
    internalPort: mainnetRpcPort,
    cookiePath: mainnetCookiePath,
  },
  testnet: {
    packageId: 'bitcoind-testnet',
    hostId: testnetRpcHostId,
    internalPort: testnetRpcPort,
    cookiePath: testnetCookiePath,
  },
} as const

export function parseCookie(cookie: string | null): [string, string] {
  const parts = cookie?.trim().split(':')
  if (!parts || parts.length !== 2) {
    throw new Error('Invalid .cookie format')
  }
  return [parts[0], parts[1]]
}
