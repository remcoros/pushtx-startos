import { ActionResultMember } from '@start9labs/start-sdk/base/lib/osBindings'
import { store } from '../fileModels/store.yaml'
import { sdk } from '../sdk'

export const showUrls = sdk.Action.withoutInput(
  // id
  'show-urls',

  // metadata
  async ({ effects }) => {
    const conf = await store.read().const(effects)
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
    const local_addresses = ui?.addressInfo
      ?.filter({ kind: ['mdns'] })
      .format('hostname-info')
    const ipv4_addresses = ui?.addressInfo
      ?.filter({ kind: ['ipv4'] })
      .format('hostname-info')

    // Tor onion addresses are provided by the tor package via the url-v0 plugin.
    // They appear as kind='plugin' with metadata.packageId === 'tor'.
    const tor_addresses = ui?.addressInfo
      ?.filter({
        predicate: ({ metadata }) =>
          metadata.kind === 'plugin' && metadata.packageId === 'tor',
      })
      .format('hostname-info')

    const results: ActionResultMember[] = []

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
          description:
            'Use this url to setup NFC Push TX over Tor (requires the Tor package).',
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
