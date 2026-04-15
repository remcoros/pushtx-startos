import { FileHelper, T, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  node: z.object({
    type: z
      .union([z.literal('mainnet'), z.literal('testnet'), z.literal('custom')])
      .catch('mainnet'),
    host: z.string().optional(),
    user: z.string().optional(),
    password: z.string().optional(),
  }),
})

export type StoreType = z.infer<typeof shape>

export const store = FileHelper.yaml(
  {
    base: sdk.volumes.main,
    subpath: 'start9/config.yaml',
  },
  shape,
)

export const createDefaultStore = async (effects: T.Effects) => {
  // check if the file exists (from previous installs or upgrades)
  const conf = await store.read().once()
  if (conf) {
    return
  }

  // config file does not exist, create it
  await store.write(effects, {
    node: {
      type: 'mainnet',
      host: '',
      user: '',
      password: '',
    },
  })
}
