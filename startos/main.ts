import { sdk } from './sdk'
import { bitcoinCoreNodes, parseCookie, uiPort } from './utils'
import { store } from './fileModels/store.yaml'
import { FileHelper } from '@start9labs/start-sdk'
import { i18n } from './i18n'

export const main = sdk.setupMain(async ({ effects }) => {
  // setup a watch on the store file for changes (this restarts the service)
  const conf = await store.read().const(effects)

  if (!conf) {
    throw new Error(i18n('Not configured'))
  }

  /*
   * Subcontainer setup
   */
  let mounts = sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/home/app',
    readonly: false,
  })

  // mount the bitcoin data directory if we are using bitcoind
  // @todo: mount just the .cookie file instead of the entire data directory
  if (conf.node.type == 'mainnet' || conf.node.type == 'testnet') {
    mounts = mounts.mountDependency({
      dependencyId:
        conf.node.type == 'mainnet' ? 'bitcoind' : 'bitcoind-testnet',
      volumeId: 'main',
      subpath: null,
      mountpoint: '/mnt/bitcoind',
      readonly: true,
    })
  }

  // main subcontainer
  const subcontainer = await sdk.SubContainer.eager(
    effects,
    {
      imageId: 'main',
    },
    mounts,
    'main',
  )

  let RPC_HOST = ''
  let RPC_USERNAME = ''
  let RPC_PASSWORD = ''

  if (conf.node.type == 'mainnet' || conf.node.type == 'testnet') {
    const node = bitcoinCoreNodes[conf.node.type]
    const rpcAddress = await sdk.host
      .getBridgeAddress(effects, {
        packageId: node.packageId,
        hostId: node.hostId,
        internalPort: node.internalPort,
        ssl: false,
      })
      .const()
    if (!rpcAddress) {
      throw new Error(i18n('Selected Bitcoin node is unavailable'))
    }
    RPC_HOST = `http://${rpcAddress}`

    // grab the RPC username and password from the .cookie file
    // also using .const() so that if the file changes, the service restarts
    const cookie = await FileHelper.string(
      `${subcontainer.rootfs}/mnt/bitcoind/${node.cookiePath}`,
    )
      // Ignore removal during Bitcoin Core shutdown; restart only after a
      // replacement cookie is written.
      .read(
        (cookie) => cookie,
        (prev, next) => next === null || prev === next,
      )
      .const(effects)
    ;[RPC_USERNAME, RPC_PASSWORD] = parseCookie(cookie)
  } else {
    // custom node, use the configured values
    RPC_HOST = conf.node.host || ''
    RPC_USERNAME = conf.node.user || ''
    RPC_PASSWORD = conf.node.password || ''
  }

  /*
   * Daemons
   */
  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: subcontainer,
    exec: {
      command: ['dotnet', 'PushTX.dll'],
      cwd: '/app',
      env: {
        RPC_HOST,
        RPC_USERNAME,
        RPC_PASSWORD,
      },
    },
    ready: {
      display: 'Push TX API',
      fn: () =>
        sdk.healthCheck.checkWebUrl(effects, 'http://127.0.0.1:' + uiPort, {
          successMessage: i18n('Push TX API is ready'),
          errorMessage: i18n('Push TX API is unreachable'),
        }),
    },
    requires: [],
  })
})
