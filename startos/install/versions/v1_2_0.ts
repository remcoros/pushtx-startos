import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v1_2_0 = VersionInfo.of({
  version: '1.2.0:0.1',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
