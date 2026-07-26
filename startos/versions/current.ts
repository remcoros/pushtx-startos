import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.3.0:5',
  releaseNotes: {
    en_US:
      'Prevents unnecessary PushTX restarts while Bitcoin Core is shutting down.',
    es_ES:
      'Evita reinicios innecesarios de PushTX mientras Bitcoin Core se está apagando.',
    de_DE:
      'Verhindert unnötige PushTX-Neustarts beim Herunterfahren von Bitcoin Core.',
    pl_PL:
      'Zapobiega niepotrzebnym restartom PushTX podczas wyłączania Bitcoin Core.',
    fr_FR:
      "Évite les redémarrages inutiles de PushTX pendant l'arrêt de Bitcoin Core.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
