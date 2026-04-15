import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './index'

export const versionGraph = VersionGraph.of({
  current,
  other,
})
