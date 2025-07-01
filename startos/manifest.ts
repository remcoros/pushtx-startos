import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'pushtx',
  title: 'NFC Push TX',
  license: 'MIT',
  wrapperRepo: 'https://github.com/remcoros/pushtx-startos',
  upstreamRepo: 'https://github.com/remcoros/pushtx-startos',
  supportSite: 'https://github.com/remcoros/pushtx-startos/issues',
  marketingSite: 'https://pushtx.org/',
  donationUrl: 'https://lnpay.me',
  description: {
    short:
      'NFC Push TX allows single-tap broadcast of freshly-signed transactions from a COLDCARD and hopefully others soon(tm)',
    long: 'Once enabled with a URL, the COLDCARD will show the NFC animation after signing the transaction. When the user taps their phone, the phone will see an NFC tag with URL inside. That URL contains the signed transaction ready to go, and once opening in the mobile browser of the phone, that URL will load. The page will connect to your Bitcoin node and send the transaction on the public Bitcoin network.',
  },
  volumes: ['main'],
  images: {
    main: {
      arch: ['x86_64', 'aarch64'],
      source: {
        dockerBuild: {
          workdir: '.',
          dockerfile: 'Dockerfile',
        },
      },
    },
  },
  hardwareRequirements: {
    //arch: ['x86_64', 'aarch64'],
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description: 'Used to connect to your Bitcoin node.',
      optional: true,
      s9pk: null,
    },
    'bitcoind-testnet': {
      description: 'Used to connect to your Bitcoin node.',
      optional: true,
      s9pk: null,
    },
  },
})
