import os from 'os'
import { sdk } from './sdk'
import { parseCookie, uiPort } from './utils'
import { store } from './fileModels/store.yaml'

export const main = sdk.setupMain(async ({ effects, started }) => {
  // setup a watch on the store file for changes (this restarts the service)
  const conf = await store.read().const(effects)

  if (!conf) {
    throw new Error('Not configured')
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
  if (conf.node.type == 'mainnet' || conf.node.type == 'testnet') {
    mounts = mounts.mountDependency({
      dependencyId:
        conf.node.type == 'mainnet' ? 'bitcoind' : 'bitcoind-testnet',
      volumeId: 'main',
      //subpath: '.cookie',
      //mountpoint: '/mnt/bitcoind/.cookie',
      //type: 'file',
      subpath: null,
      mountpoint: '/mnt/bitcoind',
      // @todo: this should be readonly, but we need to change its permissions
      readonly: true,
    })
  }

  // main subcontainer (the webtop container)
  // @todo: review this (should the service do this or can the sdk be smarter?)
  //const imageId = os.arch() == 'x64' ? 'main' : 'main-aarch'
  const subcontainer = await sdk.SubContainer.of(
    effects,
    {
      //imageId: imageId,
      imageId: 'main',
    },
    mounts,
    'main',
  )

  let RPC_HOST = ''
  let RPC_USERNAME = ''
  let RPC_PASSWORD = ''

  if (conf.node.type == 'mainnet' || conf.node.type == 'testnet') {
    RPC_HOST =
      conf.node.type == 'mainnet'
        ? 'bitcoind.startos'
        : 'bitcoind-testnet.startos'

    // grab the RPC username and password from the .cookie file
    const result = (await subcontainer.exec(['cat', '/mnt/bitcoind/.cookie']))
      .stdout as string
    ;[RPC_USERNAME, RPC_PASSWORD] = parseCookie(result)
  } else {
    // custom node, use the configured values
    RPC_HOST = conf.node.host || ''
    RPC_USERNAME = conf.node.user || ''
    RPC_PASSWORD = conf.node.password || ''
  }

  /*
   * Daemons
   */
  return sdk.Daemons.of(effects, started).addDaemon('primary', {
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
        sdk.healthCheck.checkWebUrl(
          effects,
          'http://pushtx.startos:' + uiPort,
          {
            successMessage: 'Push TX API is ready',
            errorMessage: 'Push TX API is unreachable',
          },
        ),
    },
    requires: [],
  })
})
