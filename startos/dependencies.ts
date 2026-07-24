import { store } from './fileModels/store.yaml'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const conf = await store.read().const(effects)

  // Optional URL-plugin integration follows install state, not a private
  // cross-package container address.
  const torInstalled =
    (await sdk.getStatus(effects, { packageId: 'tor' }).const()) !== null
  const torDep = torInstalled
    ? {
        tor: {
          kind: 'exists' as const,
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
        versionRange: '>=28.3:5',
      },
      ...torDep,
    }
  }

  if (serverType == 'testnet') {
    return {
      'bitcoind-testnet': {
        kind: 'exists' as const,
        healthChecks: [],
        versionRange: '>=28.3:5',
      },
      ...torDep,
    }
  }

  return { ...torDep }
})
