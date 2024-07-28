#!/bin/sh

set -ea

echo
echo "Starting NFC Push TX..."
echo

if [ $(yq e '.advanced.use_custom_node' /home/app/start9/config.yaml) = "false" ]; then
    export RPC_HOST="http://bitcoind.embassy:8332"
    export RPC_USERNAME=$(yq e '.bitcoind_rpcusername' /home/app/start9/config.yaml)
    export RPC_PASSWORD=$(yq e '.bitcoind_rpcpassword' /home/app/start9/config.yaml)
    echo "Use built-in Bitcoin Core node: $RPC_USERNAME@$RPC_HOST"
else
    export RPC_HOST=$(yq e '.advanced.custom_rpchost' /home/app/start9/config.yaml)
    export RPC_USERNAME=$(yq e '.advanced.custom_rpcusername' /home/app/start9/config.yaml)
    export RPC_PASSWORD=$(yq e '.advanced.custom_rpcpassword' /home/app/start9/config.yaml)
    echo "Use custom Bitcoin Core node: $RPC_USERNAME@$RPC_HOST"
fi

# Run nginx
NGINX_CONF='
server {
    listen 443 ssl;
    ssl_certificate /mnt/cert/main.cert.pem;
    ssl_certificate_key /mnt/cert/main.key.pem;
    server_name  localhost;

    location / {
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Host $host;
      proxy_redirect off;
      proxy_pass http://0.0.0.0:8080;
    }
}
'

echo "$NGINX_CONF" > /etc/nginx/http.d/default.conf
#sed -i "s#ssl_protocols TLSv1.1#ssl_protocols#g" /etc/nginx/nginx.conf

nginx -g 'daemon off;' &

cd /app
dotnet PushTX.dll
