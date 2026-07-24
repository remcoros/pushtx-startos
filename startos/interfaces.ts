import { sdk } from './sdk'
import { uiHostId, uiInterfaceId, uiPort } from './utils'
import { i18n } from './i18n'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiMulti = sdk.MultiHost.of(effects, uiHostId)
  const uiMultiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
    addSsl: {},
  })

  const ui = sdk.createInterface(effects, {
    name: i18n('NFC Push TX API'),
    id: uiInterfaceId,
    description: i18n('NFC Push TX API'),
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
