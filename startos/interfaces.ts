import { sdk } from './sdk'
import { uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiMulti = sdk.MultiHost.of(effects, 'main')
  const uiMultiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
    addSsl: {},
  })

  const ui = sdk.createInterface(effects, {
    name: 'NFC Push TX API',
    id: 'ui',
    description: 'NFC Push TX API',
    type: 'api',
    schemeOverride: null,
    masked: false,    
    username: null,
    path: '#',
    query: {},
  })

  const uiReceipt = await uiMultiOrigin.export([ui])

  return [uiReceipt]
})
