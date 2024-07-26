#!/bin/sh

set -ea

echo
echo "Starting NFC Push TX..."
echo

if [ $(yq e '.advanced.use_custom_node' /home/app/start9/config.yaml) = "false" ]; then
    export RPC_HOST="bitcoind.embassy:8332"
    export RPC_USERNAME=$(yq e '.bitcoind_rpcusername' /home/app/start9/config.yaml)
    export RPC_PASSWORD=$(yq e '.bitcoind_rpcpassword' /home/app/start9/config.yaml)
    echo "Use built-in Bitcoin Core node: $RPC_USERNAME@$RPC_HOST"
else
    export RPC_HOST=$(yq e '.advanced.custom_rpchost' /home/app/start9/config.yaml)
    export RPC_USERNAME=$(yq e '.advanced.custom_rpcusername' /home/app/start9/config.yaml)
    export RPC_PASSWORD=$(yq e '.advanced.custom_rpcpassword' /home/app/start9/config.yaml)
    echo "Use custom Bitcoin Core node: $RPC_USERNAME@$RPC_HOST"
fi

cd /app
dotnet PushTX.dll
