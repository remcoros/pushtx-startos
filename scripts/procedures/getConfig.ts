import { compat } from "../deps.ts";

export const [getConfig, setConfigMatcher] = compat.getConfigAndMatcher({
  "tor-address": {
    name: "Tor Address",
    description: "The Tor address for the main ui.",
    type: "pointer",
    subtype: "package",
    "package-id": "pushtx",
    target: "tor-address",
    interface: "main",
  },
  "lan-address": {
    name: "Lan Address",
    description: "The Lan address for the main ui.",
    type: "pointer",
    subtype: "package",
    "package-id": "pushtx",
    target: "lan-address",
    interface: "main",
  },
  node: {
    type: "union",
    name: "Bitcoin node",
    description: "The Bitcoin Core node to use",
    tag: {
      id: "type",
      name: "Select Bitcoin Node",
      "variant-names": {
        mainnet: "Bitcoin Core",
        testnet: "Bitcoin Core (testnet4)",
        custom: "Custom",
      },
      description: "The Bitcoin Core node to use",
    },
    default: "mainnet",
    variants: {
      mainnet: {
        user: {
          type: "pointer",
          name: "RPC Username",
          description: "The username for Bitcoin Core's RPC interface",
          subtype: "package",
          "package-id": "bitcoind",
          target: "config",
          multi: false,
          selector: "$.rpc.username",
        },
        password: {
          type: "pointer",
          name: "RPC Password",
          description: "The password for Bitcoin Core's RPC interface",
          subtype: "package",
          "package-id": "bitcoind",
          target: "config",
          multi: false,
          selector: "$.rpc.password",
        },
      },
      testnet: {
        user: {
          type: "pointer",
          name: "RPC Username",
          description: "The username for Bitcoin Core's RPC interface",
          subtype: "package",
          "package-id": "bitcoind-testnet",
          target: "config",
          multi: false,
          selector: "$.rpc.username",
        },
        password: {
          type: "pointer",
          name: "RPC Password",
          description: "The password for Bitcoin Core's RPC interface",
          subtype: "package",
          "package-id": "bitcoind-testnet",
          target: "config",
          multi: false,
          selector: "$.rpc.password",
        },
      },
      custom: {
        host: {
          type: "string",
          name: "Url",
          description: "Url of a Bitcoin json-rpc server",
          nullable: true,
          pattern: "http(s)?://.*",
          "pattern-description": "URL of a Bitcoin json-rpc server",
          copyable: true,
          placeholder: "http://hostname",
          default: "",
        },
        user: {
          type: "string",
          name: "Username",
          description: "Username of custom Bitcoin json-rpc server",
          nullable: true,
          pattern: ".*",
          "pattern-description": "",
          copyable: true,
          placeholder: "bitcoin",
          default: "bitcoin",
        },
        password: {
          type: "string",
          name: "Password",
          description: "Password of custom Bitcoin json-rpc server",
          nullable: true,
          pattern: ".*",
          "pattern-description": "",
          copyable: true,
          placeholder: "",
          default: "",
          masked: true,
        },
      },
    },
  },
});

export type Config = typeof setConfigMatcher._TYPE;
