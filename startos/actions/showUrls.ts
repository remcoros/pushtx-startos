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
    const local_addresses = ui?.addressInfo?.filter({ kind: ['mdns'] }).format('hostname-info')
    const ipv4_addresses = ui?.addressInfo?.filter({ kind: ['ipv4'] }).format('hostname-info')
    const tor_addresses = ui?.addressInfo?.filter({ kind: ['onion'] }).format('hostname-info')

    const addresses = ui?.addressInfo?.filter({
      kind: ['domain', 'mdns', 'ipv4', 'onion'],
    })

    let results: ActionResultMember[] = []
    if (local_addresses && local_addresses.length > 0) {
      for (const address of local_addresses) {
        results.push({
          type: 'single',
          name: 'Local URL',
          description:
            'Use this url to setup NFC Push TX over LAN (with mDNS/.local support).',
          value: `https://${address.hostname}#`,
          copyable: true,
          masked: false,
          qr: true,
        })
      }
    }
    if (ipv4_addresses && ipv4_addresses.length > 0) {
      for (const address of ipv4_addresses) {
        results.push({
          type: 'single',
          name: 'IPv4 URL',
          description: 'Use this url to setup NFC Push TX over LAN.',
          value: `https://${address.hostname}#`,
          copyable: true,
          masked: false,
          qr: true,
        })
      }
    }
    if (tor_addresses && tor_addresses.length > 0) {
      for (const address of tor_addresses) {
        results.push({
          type: 'single',
          name: 'Tor URL',
          description: 'Use this url to setup NFC Push TX over Tor.',
          value: `https://${address.hostname}#`,
          copyable: true,
          masked: false,
          qr: true,
        })
      }
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
