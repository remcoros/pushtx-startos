import { ActionResultMember } from '@start9labs/start-sdk/base/lib/osBindings'
import { store } from '../fileModels/store.yaml'
import { sdk } from '../sdk'

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
    const results: ActionResultMember[] = []

    // --- mDNS (local .local addresses) ---
    const local_addresses = ui?.addressInfo
      ?.filter({ kind: ['mdns'] })
      .format('hostname-info')

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

    // --- IPv4 ---
    const ipv4_addresses = ui?.addressInfo
      ?.filter({ kind: ['ipv4'] })
      .format('hostname-info')

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

    // --- Private domain (LAN / StartOS gateway domain) ---
    const private_domain_addresses = ui?.addressInfo
      ?.filter({
        predicate: ({ metadata }) => metadata.kind === 'private-domain',
      })
      .format('hostname-info')

    if (private_domain_addresses && private_domain_addresses.length > 0) {
      for (const address of private_domain_addresses) {
        results.push({
          type: 'single',
          name: 'Private Domain URL',
          description: 'Use this url to access Push TX via your private domain.',
          value: `https://${address.hostname}#`,
          copyable: true,
          masked: false,
          qr: true,
        })
      }
    }

    // --- Public domain (clearnet domain) ---
    const public_domain_addresses = ui?.addressInfo
      ?.filter({
        predicate: ({ metadata }) => metadata.kind === 'public-domain',
      })
      .format('hostname-info')

    if (public_domain_addresses && public_domain_addresses.length > 0) {
      for (const address of public_domain_addresses) {
        results.push({
          type: 'single',
          name: 'Public Domain URL',
          description:
            'Use this url to access Push TX from anywhere via your public domain.',
          value: `https://${address.hostname}#`,
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
        for (const address of addresses) {
          results.push({
            type: 'single',
            name: `${label} URL`,
            description: `Use this url to access Push TX via ${label}.`,
            value: `https://${address.hostname}#`,
            copyable: true,
            masked: false,
            qr: true,
          })
        }
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
