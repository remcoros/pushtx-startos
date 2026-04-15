import { store } from './fileModels/store.yaml'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const conf = await store.read().const(effects)

  // Auto-detect Tor: include as a dependency if it is installed/running.
  // This is opt-in — Tor is optional; PushTX works without it.
  const torIp = await sdk.getContainerIp(effects, { packageId: 'tor' }).const()
  const torDep = torIp
    ? {
        tor: {
          kind: 'running' as const,
          versionRange: '>=0.4.9.5:0',
          healthChecks: [],
        },
      }
    : {}

  // no node dependencies if no config or custom node type
  if (!conf || conf.node.type === 'custom') {
    return { ...torDep }
  }

  const serverType = conf.node.type

  if (serverType == 'mainnet') {
    return {
      bitcoind: {
        kind: 'running' as const,
        healthChecks: [],
        versionRange: '^28.1.0-0',
      },
      ...torDep,
    }
  }

  if (serverType == 'testnet') {
    return {
      'bitcoind-testnet': {
        kind: 'exists' as const,
        healthChecks: [],
        versionRange: '^28.1.0-0',
      },
      ...torDep,
    }
  }

  return { ...torDep }
})
