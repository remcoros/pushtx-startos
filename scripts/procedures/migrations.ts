import { compat, types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration = compat.migrations
  .fromMapping({
    "1.1.0": {
      up: compat.migrations.updateConfig(
        (config: any) => {
          if (config.advanced["use_custom_node"] === true) {
            config.node = {};
            config.node["type"] = "custom";
            config.node["host"] = config.advanced["custom_rpchost"];
            config.node["user"] = config.advanced["custom_rpcusername"];
            config.node["password"] = config.advanced["custom_rpcpassword"];
          }
          delete config.advanced["use_custom_node"];
          delete config.advanced["custom_rpchost"];
          delete config.advanced["custom_rpcusername"];
          delete config.advanced["custom_rpcpassword"];
          return config;
        },
        true,
        { version: "1.1.0", type: "up" },
      ),
      down: compat.migrations.updateConfig(
        (config: any) => {
          if (config.node.type === "mainnet") {
            config.advanced = {};
            config.advanced["use_custom_node"] = false;
            config.node["host"] = config.advanced["custom_rpchost"];
            config.node["user"] = config.advanced["custom_rpcusername"];
            config.node["password"] = config.advanced["custom_rpcpassword"];
          } else if (config.node.type === "testnet") {
            config.advanced = {};
            config.advanced["use_custom_node"] = true;
            config.advanced["custom_rpchost"] =
              "http://bitcoind-testnet.embassy:48332";
            config.advanced["custom_rpcusername"] = config.node["user"];
            config.advanced["custom_rpcpassword"] = config.node["password"];
          } else if (config.node.type === "custom") {
            config.advanced = {};
            config.advanced["use_custom_node"] = true;
            config.advanced["custom_rpchost"] = config.node["host"];
            config.advanced["custom_rpcusername"] = config.node["user"];
            config.advanced["custom_rpcpassword"] = config.node["password"];
          }
          delete config["node"];
          return config;
        },
        true,
        { version: "1.1.0", type: "down" },
      ),
    },
  }, "1.1.0");
