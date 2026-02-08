import { LangDict } from './default'

export default {
  es_ES: {
    // main.ts
    1: 'No configurado',
    2: 'La API Push TX está lista',
    3: 'La API Push TX no está accesible',

    // interfaces.ts
    100: 'API NFC Push TX',

    // actions/showUrls.ts
    200: 'Mostrar URLs de Push TX',
    201: 'Mostrar las URLs de Push TX',
    202: 'URL local',
    203: 'Usa esta URL para configurar NFC Push TX sobre LAN (con soporte mDNS/.local).',
    204: 'URL IPv4',
    205: 'Usa esta URL para configurar NFC Push TX sobre LAN.',
    206: 'URL Tor',
    207: 'Usa esta URL para configurar NFC Push TX sobre Tor.',
    208: 'No hay URLs disponibles',
    209: 'No hay URLs disponibles para NFC Push TX.',
    210: 'URL de NFC Push TX',

    // actions/config.ts
    300: 'Servidor',
    301: 'Servidor Bitcoin/Electrum',
    302: 'Bitcoin Core',
    303: 'Bitcoin Core (testnet4)',
    304: 'Personalizado',
    305: 'Nombre de host',
    306: 'Nombre de host RPC para tu nodo Bitcoin.',
    307: 'Nombre de usuario',
    308: 'Nombre de usuario RPC para tu nodo Bitcoin.',
    309: 'Contraseña',
    310: 'Contraseña RPC para tu nodo Bitcoin.',
    311: 'Configuración',
    312: 'Configuración del nodo Bitcoin',

    // manifest/index.ts
    400: 'Usado para conectar a tu nodo Bitcoin.',
  },
  de_DE: {
    // main.ts
    1: 'Nicht konfiguriert',
    2: 'Push TX API ist bereit',
    3: 'Push TX API ist nicht erreichbar',

    // interfaces.ts
    100: 'NFC Push TX API',

    // actions/showUrls.ts
    200: 'Push TX URLs anzeigen',
    201: 'Die Push TX URLs anzeigen',
    202: 'Lokale URL',
    203: 'Verwenden Sie diese URL, um NFC Push TX über LAN einzurichten (mit mDNS/.local-Unterstützung).',
    204: 'IPv4-URL',
    205: 'Verwenden Sie diese URL, um NFC Push TX über LAN einzurichten.',
    206: 'Tor-URL',
    207: 'Verwenden Sie diese URL, um NFC Push TX über Tor einzurichten.',
    208: 'Keine URLs verfügbar',
    209: 'Keine URLs für NFC Push TX verfügbar.',
    210: 'NFC Push TX URL',

    // actions/config.ts
    300: 'Server',
    301: 'Bitcoin/Electrum Server',
    302: 'Bitcoin Core',
    303: 'Bitcoin Core (testnet4)',
    304: 'Benutzerdefiniert',
    305: 'RPC-Hostname für Ihren Bitcoin-Knoten.',
    306: 'Benutzername',
    307: 'RPC-Benutzername für Ihren Bitcoin-Knoten.',
    308: 'Passwort',
    309: 'RPC-Passwort für Ihren Bitcoin-Knoten.',
    310: 'Einstellungen',
    311: 'Bitcoin-Knoten-Einstellungen',
    312: 'Wird verwendet, um eine Verbindung zu Ihrem Bitcoin-Knoten herzustellen.',

    // manifest/index.ts
    400: 'Wird verwendet, um eine Verbindung zu Ihrem Bitcoin-Knoten herzustellen.',
  },
  pl_PL: {
    // main.ts
    1: 'Nie skonfigurowano',
    2: 'API Push TX jest gotowe',
    3: 'API Push TX jest niedostępne',

    // interfaces.ts
    100: 'API NFC Push TX',

    // actions/showUrls.ts
    200: 'Pokaż URL-e Push TX',
    201: 'Pokaż URL-e Push TX',
    202: 'Lokalny URL',
    203: 'Użyj tego URL-a do konfiguracji NFC Push TX przez LAN (z obsługą mDNS/.local).',
    204: 'URL IPv4',
    205: 'Użyj tego URL-a do konfiguracji NFC Push TX przez LAN.',
    206: 'URL Tor',
    207: 'Użyj tego URL-a do konfiguracji NFC Push TX przez Tor.',
    208: 'Brak dostępnych adresów URL',
    209: 'Brak dostępnych adresów URL dla NFC Push TX.',
    210: 'Adres URL NFC Push TX',

    // actions/config.ts
    300: 'Serwer',
    301: 'Serwer Bitcoin/Electrum',
    302: 'Bitcoin Core',
    303: 'Bitcoin Core (testnet4)',
    304: 'Własny',
    305: 'Nazwa hosta',
    306: 'Nazwa hosta RPC dla twojego węzła Bitcoin.',
    307: 'Nazwa użytkownika',
    308: 'Nazwa użytkownika RPC dla twojego węzła Bitcoin.',
    309: 'Hasło',
    310: 'Hasło RPC dla twojego węzła Bitcoin.',
    311: 'Ustawienia',
    312: 'Ustawienia węzła Bitcoin',

    // manifest/index.ts
    400: 'Używany do połączenia z twoim węzłem Bitcoin.',
  },
  fr_FR: {
    // main.ts
    1: 'Non configuré',
    2: "L'API Push TX est prête",
    3: "L'API Push TX est inaccessible",

    // interfaces.ts
    100: 'API NFC Push TX',

    // actions/showUrls.ts
    200: 'Afficher les URLs Push TX',
    201: 'Afficher les URLs Push TX',
    202: 'URL locale',
    203: 'Utilisez cette URL pour configurer NFC Push TX sur le LAN (avec prise en charge de mDNS/.local).',
    204: 'URL IPv4',
    205: 'Utilisez cette URL pour configurer NFC Push TX sur le LAN.',
    206: 'URL Tor',
    207: 'Utilisez cette URL pour configurer NFC Push TX sur Tor.',
    208: 'Aucune URL disponible',
    209: 'Aucune URL disponible pour NFC Push TX.',
    210: 'URL NFC Push TX',

    // actions/config.ts
    300: 'Serveur',
    301: 'Serveur Bitcoin/Electrum',
    302: 'Bitcoin Core',
    303: 'Bitcoin Core (testnet4)',
    304: 'Personnalisé',
    305: "Nom d'hôte",
    306: "Nom d'hôte RPC pour votre nœud Bitcoin.",
    307: "Nom d'utilisateur",
    308: "Nom d'utilisateur RPC pour votre nœud Bitcoin.",
    309: 'Mot de passe',
    310: 'Mot de passe RPC pour votre nœud Bitcoin.',
    311: 'Paramètres',
    312: 'Paramètres du nœud Bitcoin',

    // manifest/index.ts
    400: 'Utilisé pour se connecter à votre nœud Bitcoin.',
  },
} satisfies Record<string, LangDict>
