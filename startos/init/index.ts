import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../install/versionGraph'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { config } from '../actions/config'
import { createDefaultStore } from '../fileModels/store.yaml'

const setupPostInstall = sdk.setupOnInit(async (effects, kind) => {
  if (kind == 'install') {
    await createDefaultStore(effects)

    // require the config action to run once, to have a password for the ui set
    await sdk.action.createOwnTask(effects, config, 'critical', {
      reason: 'Configure default settings',
    })
  }
})

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
  setupPostInstall,
)

export const uninit = sdk.setupUninit(versionGraph)
