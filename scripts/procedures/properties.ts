import { matches, types as T, util, YAML } from "../deps.ts";

const { shape, string } = matches;

const noPropertiesFound: T.ResultType<T.Properties> = {
  result: {
    version: 2,
    data: {
      "Not Ready": {
        type: "string",
        value:
          "Could not find properties. NFC Push TX might still be starting...",
        qr: false,
        copyable: false,
        masked: false,
        description: "Properties could not be found",
      },
    },
  },
} as const;

const configMatcher = shape({
  "tor-address": string,
  "lan-address": string,
});

export const properties: T.ExpectedExports.properties = async (
  effects: T.Effects,
) => {
  if (
    await util.exists(effects, {
      volumeId: "main",
      path: "start9/config.yaml",
    }) === false
  ) {
    return noPropertiesFound;
  }
  const config = configMatcher.unsafeCast(YAML.parse(
    await effects.readFile({
      path: "start9/config.yaml",
      volumeId: "main",
    }),
  ));
  const properties: T.ResultType<T.Properties> = {
    result: {
      version: 2,
      data: {
        "NFC Push TX Url (Tor)": {
          type: "string",
          value: `https://${config["tor-address"]}#`,
          description: "Use this link to setup NFC Push TX over Tor.",
          copyable: true,
          qr: true,
          masked: false,
        },
        "NFC Push TX Url (Lan)": {
          type: "string",
          value: `https://${config["lan-address"]}#`,
          description: "Use this link to setup NFC Push TX over Lan.",
          copyable: true,
          qr: true,
          masked: false,
        },
      },
    },
  } as const;
  return properties;
};
