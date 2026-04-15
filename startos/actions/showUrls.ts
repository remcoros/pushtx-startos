import { ActionResultMember } from '@start9labs/start-sdk/base/lib/osBindings'
import { store } from '../fileModels/store.yaml'
import { sdk } from '../sdk'
import { i18n } from '../i18n'

// Capitalise a packageId for use as a label (e.g. 'cloudflared' → 'Cloudflared')
function labelFromPackageId(packageId: string): string {
  return packageId.charAt(0).toUpperCase() + packageId.slice(1)
}

export const showUrls = sdk.Action.withoutInput(
  // id
  'show-urls',

  // metadata
  async ({ effects }) => {
    const conf = await store.read().const(effects)
    return {
      name: i18n('Show Push TX URLs'),
      description: i18n('Show the Push TX URLs'),
      warning: null,
      allowedStatuses: 'any',
      group: 'NFC Push TX',
      visibility: conf ? 'enabled' : 'hidden',
    }
  },

  // execution function
  async ({ effects }) => {
    const ui = await sdk.serviceInterface.getOwn(effects, 'ui').const()
    const results: ActionResultMember[] = []

    // --- Public domain (clearnet domain) ---
    const public_domain_urls = ui?.addressInfo
      ?.filter({
        predicate: ({ metadata }) => metadata.kind === 'public-domain',
      })
      .format()

    if (public_domain_urls && public_domain_urls.length > 0) {
      for (const url of public_domain_urls) {
        results.push({
          type: 'single',
          name: i18n('Public Domain URL'),
          description: i18n(
            'Use this url to access Push TX from anywhere via your public domain.',
          ),
          value: url,
          copyable: true,
          masked: false,
          qr: true,
        })
      }
    }

    // --- Plugin-provided addresses (Tor, Cloudflared, etc.) ---
    // Each installed plugin (identified by packageId) gets its own section.
    const all_plugin_addresses = ui?.addressInfo
      ?.filter({ kind: ['plugin'] })
      .format('hostname-info')

    if (all_plugin_addresses && all_plugin_addresses.length > 0) {
      // Group by packageId
      const byPackage = new Map<string, typeof all_plugin_addresses>()
      for (const address of all_plugin_addresses) {
        if (address.metadata.kind !== 'plugin') continue
        const pkgId = address.metadata.packageId
        if (!byPackage.has(pkgId)) byPackage.set(pkgId, [])
        byPackage.get(pkgId)!.push(address)
      }

      for (const [packageId, addresses] of byPackage) {
        const label = labelFromPackageId(packageId)
        const pluginFilled = ui?.addressInfo?.filter({
          predicate: (h) =>
            h.metadata.kind === 'plugin' && h.metadata.packageId === packageId,
        })
        for (const address of addresses) {
          const url = pluginFilled?.toUrl(address)
          if (!url) continue
          results.push({
            type: 'single',
            name: `${label} URL`,
            description: i18n(
              'Use this url to access NFC Push TX via this service.',
            ),
            value: url,
            copyable: true,
            masked: false,
            qr: true,
          })
        }
      }
    }

    // --- mDNS (local .local addresses) ---
    const local_urls = ui?.addressInfo
      ?.filter({ kind: ['mdns'] })
      .format()

    if (local_urls && local_urls.length > 0) {
      for (const url of local_urls) {
        results.push({
          type: 'single',
          name: i18n('Local URL'),
          description: i18n(
            'Use this url to setup NFC Push TX over LAN (with mDNS/.local support).',
          ),
          value: url,
          copyable: true,
          masked: false,
          qr: true,
        })
      }
    }

    // --- IPv4 (public only) ---
    const ipv4_urls = ui?.addressInfo
      ?.filter({ kind: ['ipv4'], visibility: 'public' })
      .format()

    if (ipv4_urls && ipv4_urls.length > 0) {
      for (const url of ipv4_urls) {
        results.push({
          type: 'single',
          name: i18n('IPv4 URL'),
          description: i18n('Use this url to setup NFC Push TX over LAN.'),
          value: url,
          copyable: true,
          masked: false,
          qr: true,
        })
      }
    }

    if (results.length === 0) {
      results.push({
        type: 'single',
        name: i18n('No URLs available'),
        description: i18n('No URLs available for NFC Push TX.'),
        value: '',
        copyable: false,
        masked: false,
        qr: false,
      })
    }

    return {
      version: '1',
      title: i18n('NFC Push TX Url'),
      message: null,
      result: {
        type: 'group',
        value: results,
      },
    }
  },
)
