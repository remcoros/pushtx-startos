import { T } from '@start9labs/start-sdk'
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
import { sdk } from './sdk'

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

export function bridgeAddress(
  effects: T.Effects,
  opts: { packageId: string; hostId: string; internalPort: number },
) {
  const watchable = async () => {
    const osIp = await sdk.getOsIp(effects)
    return sdk.host.get(
      effects,
      { packageId: opts.packageId, hostId: opts.hostId },
      (host) => {
        const port = host?.bindings[opts.internalPort]?.net.assignedPort
        return port == null ? null : `${osIp}:${port}`
      },
    )
  }
  return {
    const: async () => (await watchable()).const(),
    once: async () => (await watchable()).once(),
  }
}

export function parseCookie(cookie: string | null): [string, string] {
  const parts = cookie?.trim().split(':')
  if (!parts || parts.length !== 2) {
    throw new Error('Invalid .cookie format')
  }
  return [parts[0], parts[1]]
}
