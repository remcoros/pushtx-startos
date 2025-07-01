import { sdk } from '../sdk'
import { T, utils } from '@start9labs/start-sdk'
import { createDefaultStore, store } from '../fileModels/store.yaml'
import { Variants } from '@start9labs/start-sdk/base/lib/actions/input/builder'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  server: Value.dynamicUnion(async ({ effects }) => {
    // determine default server type and disabled options
    const installedPackages = await effects.getInstalledPackages()
    let serverType: 'mainnet' | 'testnet' | 'custom' = 'custom'

    if (installedPackages.includes('bitcoind')) {
      serverType = 'mainnet'
    } else if (installedPackages.includes('bitcoind-testnet')) {
      serverType = 'testnet'
    } else {
      serverType = 'custom'
    }

    return {
      name: 'Server',
      description: 'Bitcoin/Electrum Server',
      default: serverType,
      disabled: false,
      variants: Variants.of({
        mainnet: {
          name: 'Bitcoin Core',
          spec: InputSpec.of({}),
        },
        testnet: {
          name: 'Bitcoin Core (testnet4)',
          spec: InputSpec.of({}),
        },
        custom: {
          name: 'Custom',
          spec: InputSpec.of({
            host: Value.text({
              name: 'Hostname',
              description: 'RPC hostname for your Bitcoin node.',
              required: true,
              default: '',
              placeholder: '',
              masked: false,
            }),
            user: Value.text({
              name: 'Username',
              description: 'RPC username for your Bitcoin node.',
              required: true,
              default: 'bitcoin',
              placeholder: '',
              masked: false,
            }),
            password: Value.text({
              name: 'Password',
              description: 'RPC password for your Bitcoin node.',
              required: true,
              default: '',
              placeholder: '',
              masked: true,
            }),
          }),
        },
      }),
    }
  }),
})

export const config = sdk.Action.withInput(
  // id
  'config',

  // metadata
  async ({ effects }) => ({
    name: 'Settings',
    description: 'Bitcoin Node settings',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => readSettings(effects),

  // the execution function
  ({ effects, input }) => writeSettings(effects, input),
)

type InputSpec = typeof inputSpec._TYPE
type PartialInputSpec = typeof inputSpec._PARTIAL

async function readSettings(effects: T.Effects): Promise<PartialInputSpec> {
  let settings = await store.read().once()
  if (!settings) {
    await createDefaultStore(effects)
    settings = (await store.read().once())!
  }

  return {
    server: {
      selection: settings.node.type,
      value: {
        host: settings.node.host,
        user: settings.node.user,
        password: settings.node.password,
      },
    },
  }
}

async function writeSettings(effects: T.Effects, input: PartialInputSpec) {
  let customValues =
    input.server?.selection === 'custom' ? input.server.value : undefined
  await store.merge(effects, {
    node: {
      type:
        input.server?.selection === 'mainnet'
          ? 'mainnet'
          : input.server?.selection === 'testnet'
            ? 'testnet'
            : 'custom',
      host: customValues?.host ?? '',
      user: customValues?.user ?? '',
      password: customValues?.password ?? '',
    },
  })
}
