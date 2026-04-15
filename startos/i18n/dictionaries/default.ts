export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Not configured': 1,
  'Push TX API is ready': 2,
  'Push TX API is unreachable': 3,

  // interfaces.ts
  'NFC Push TX API': 100,

  // actions/showUrls.ts
  'Show Push TX URLs': 200,
  'Show the Push TX URLs': 201,
  'Local URL': 202,
  'Use this url to setup NFC Push TX over LAN (with mDNS/.local support).': 203,
  'IPv4 URL': 204,
  'Use this url to setup NFC Push TX over LAN.': 205,
  'No URLs available': 208,
  'No URLs available for NFC Push TX.': 209,
  'NFC Push TX Url': 210,
  'Public Domain URL': 211,
  'Use this url to access Push TX from anywhere via your public domain.': 212,
  'Use this url to access NFC Push TX via this service.': 213,

  // actions/config.ts
  'Node': 300,
  'Bitcoin Node': 301,
  'Bitcoin Core': 302,
  'Bitcoin Core (testnet4)': 303,
  'Custom': 304,
  'Hostname': 305,
  'RPC hostname for your Bitcoin node.': 306,
  'Username': 307,
  'RPC username for your Bitcoin node.': 308,
  'Password': 309,
  'RPC password for your Bitcoin node.': 310,
  'Settings': 311,
  'Bitcoin Node settings': 312,

  // manifest/index.ts
  'Used to connect to your Bitcoin node.': 400,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
