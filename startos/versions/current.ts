import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.3.0:2',
  releaseNotes: {
    en_US: 'Fixed testnet4 support',
    es_ES: 'Arreglado el soporte para testnet4',
    de_DE: 'Unterstützung für testnet4 behoben',
    pl_PL: 'Naprawiono obsługę testnet4',
    fr_FR: 'Correction du support de testnet4',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
