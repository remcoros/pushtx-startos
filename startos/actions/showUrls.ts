import { ActionResultMember } from '@start9labs/start-sdk/base/lib/osBindings'
import { store } from '../fileModels/store.yaml'
import { sdk } from '../sdk'
import { ipv4 } from '@start9labs/start-sdk/base/lib/util/patterns'

export const showUrls = sdk.Action.withoutInput(
  // id
  'show-urls',

  // metadata
  async ({ effects }) => {
    var conf = await store.read().const(effects)
    return {
      name: 'Show Push TX URLs',
      description: 'Show the Push TX URLs',
      warning: null,
      allowedStatuses: 'any',
      group: 'NFC Push TX',
      visibility: conf ? 'enabled' : 'hidden',
    }
  },

  // execution function
  async ({ effects }) => {
    const ui = await sdk.serviceInterface.getOwn(effects, 'ui').const()
    const local_address = ui?.addressInfo?.localHostnames?.[0]?.hostname
    const ipv4_address = ui?.addressInfo?.ipv4Hostnames?.[0]?.hostname
    const tor_address = ui?.addressInfo?.onionHostnames?.[0]?.hostname

    let results: ActionResultMember[] = []
    if (local_address) {
      results.push({
        type: 'single',
        name: 'Local URL',
        description:
          'Use this url to setup NFC Push TX over LAN (with mDNS/.local support).',
        value: `https://${local_address}#`,
        copyable: true,
        masked: false,
        qr: true,
      })
    }
    if (ipv4_address) {
      results.push({
        type: 'single',
        name: 'IPv4 URL',
        description: 'Use this url to setup NFC Push TX over LAN.',
        value: `https://${ipv4_address}#`,
        copyable: true,
        masked: false,
        qr: true,
      })
    }
    if (tor_address) {
      results.push({
        type: 'single',
        name: 'Tor URL',
        description: 'Use this url to setup NFC Push TX over Tor.',
        value: `https://${tor_address}#`,
        copyable: true,
        masked: false,
        qr: true,
      })
    }

    if (results.length === 0) {
      results.push({
        type: 'single',
        name: 'No URLs available',
        description: 'No URLs available for NFC Push TX.',
        value: '',
        copyable: false,
        masked: false,
        qr: false,
      })
    }
    
    return {
      version: '1',
      title: 'NFC Push TX Url',
      message: null,
      result: {
        type: 'group',
        value: results,
      },
    }
  },
)
