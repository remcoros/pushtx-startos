import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'pushtx',
  title: 'NFC Push TX',
  license: 'MIT',
  packageRepo: 'https://github.com/remcoros/pushtx-startos',
  upstreamRepo: 'https://github.com/remcoros/pushtx-startos',
  supportSite: 'https://github.com/remcoros/pushtx-startos/issues',
  docsUrls: ['https://github.com/remcoros/pushtx-startos/blob/main/instructions.md'],
  marketingUrl: 'https://pushtx.org/',
  donationUrl: 'https://github.com/remcoros/',
  description: {
    short: {
      en_US:
        'NFC Push TX allows single-tap broadcast of freshly-signed transactions from a COLDCARD and hopefully others soon(tm)',
      es_ES:
        'NFC Push TX permite la difusión con un solo toque de transacciones recién firmadas desde un COLDCARD y esperamos que otros pronto(tm)',
      de_DE:
        'NFC Push TX ermöglicht die Übertragung frisch signierter Transaktionen von einem COLDCARD mit nur einem Tipp und hoffentlich bald auch von anderen(tm)',
      pl_PL:
        'NFC Push TX umożliwia jednodotykowe nadawanie świeżo podpisanych transakcji z COLDCARD i miejmy nadzieję, że wkrótce także z innych(tm)',
      fr_FR:
        "NFC Push TX permet la diffusion en un seul clic de transactions fraîchement signées depuis un COLDCARD et espérons d'autres bientôt(tm)",
    },
    long: {
      en_US:
        'Once enabled with a URL, the COLDCARD will show the NFC animation after signing the transaction. When the user taps their phone, the phone will see an NFC tag with URL inside. That URL contains the signed transaction ready to go, and once opening in the mobile browser of the phone, that URL will load. The page will connect to your Bitcoin node and send the transaction on the public Bitcoin network.',
      es_ES:
        'Una vez habilitado con una URL, el COLDCARD mostrará la animación NFC después de firmar la transacción. Cuando el usuario toca su teléfono, el teléfono verá una etiqueta NFC con URL dentro. Esa URL contiene la transacción firmada lista para usar, y una vez que se abra en el navegador móvil del teléfono, esa URL se cargará. La página se conectará a tu nodo Bitcoin y enviará la transacción en la red pública de Bitcoin.',
      de_DE:
        'Sobald es mit einer URL aktiviert ist, zeigt die COLDCARD die NFC-Animation nach dem Signieren der Transaktion an. Wenn der Benutzer sein Telefon berührt, sieht das Telefon ein NFC-Tag mit einer URL darin. Diese URL enthält die signierte Transaktion, die bereit ist zu senden, und sobald sie im mobilen Browser des Telefons geöffnet wird, wird diese URL geladen. Die Seite verbindet sich mit Ihrem Bitcoin-Knoten und sendet die Transaktion im öffentlichen Bitcoin-Netzwerk.',
      pl_PL:
        'Po włączeniu z URL-em, COLDCARD pokaże animację NFC po podpisaniu transakcji. Gdy użytkownik dotknie telefonu, telefon zobaczy tag NFC z URL-em w środku. Ten URL zawiera podpisaną transakcję gotowną do wysłania, a po otwarciu w przeglądarce mobilnej telefonu, ten URL zostanie załadowany. Strona połączy się z twoim węzłem Bitcoin i wyśle transakcję w publicznej sieci Bitcoin.',
      fr_FR:
        "Une fois activé avec une URL, le COLDCARD affichera l'animation NFC après la signature de la transaction. Lorsque l'utilisateur tapote son téléphone, le téléphone verra une balise NFC avec une URL à l'intérieur. Cette URL contient la transaction signée prête à être envoyée, et une fois ouverte dans le navigateur mobile du téléphone, cette URL se chargera. La page se connectera à votre nœud Bitcoin et enverra la transaction sur le réseau Bitcoin public.",
    },
  },
  volumes: ['main'],
  images: {
    main: {
      source: {
        dockerBuild: {
          workdir: '.',
          dockerfile: 'Dockerfile',
        },
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'aarch64',
    },
  },
  dependencies: {
    bitcoind: {
      description: 'Used to connect to your Bitcoin node.',
      optional: true,
      metadata: {
        title: 'A Bitcoin Full Node',
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
    'bitcoind-testnet': {
      description: 'Used to connect to your Bitcoin node.',
      optional: true,
      metadata: {
        title: 'A Bitcoin Testnet Node',
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
  },
})
