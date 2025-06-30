import { store } from './fileModels/store.yaml'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const conf = await store.read().const(effects)

  // no dependencies if we have no config or custom node type
  if (!conf || conf.node.type === 'custom') {
    return {}
  }

  var serverType = conf.node.type

  if (serverType == 'mainnet') {
    return {
      bitcoind: {
        kind: 'running',
        healthChecks: [],
        // @todo update version range
        versionRange: '^28.1.0-0',
      },
    }
  }

  if (serverType == 'testnet') {
    return {
      'bitcoind-testnet': {
        kind: 'exists',
        healthChecks: [],
        // @todo update version range
        versionRange: '^28.1.0-0',
      },
    }
  }

  return {}
})
