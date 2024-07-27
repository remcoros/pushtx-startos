FROM mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim as build

# these are specified in Makefile
ARG PLATFORM
ARG YQ_VERSION
ARG YQ_SHA

# Install necessary packages
RUN \
  apt-get update && \
  DEBIAN_FRONTEND=noninteractive \
  apt-get install -y --no-install-recommends \
    # install wget and certificates
    ca-certificates wget && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

RUN \
  # install yq
  wget -qO /tmp/yq https://github.com/mikefarah/yq/releases/download/v${YQ_VERSION}/yq_linux_${PLATFORM} && \
  echo "${YQ_SHA} /tmp/yq" | sha256sum -c || exit 1 && \ 
  mv /tmp/yq /usr/local/bin/yq && chmod +x /usr/local/bin/yq

WORKDIR /app

COPY ./src/PushTX .
  
RUN \
    dotnet restore && \
    dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine

RUN apk update && \
    apk add --no-cache \
    nginx \
    rm -rf \
    /tmp/* \
    /var/cache/apk/* \
    /var/tmp/*

WORKDIR /app

COPY --from=build /app/out /app
COPY --from=build /usr/local/bin/yq /usr/local/bin/yq
COPY --chmod=755 ./docker_entrypoint.sh /app/docker_entrypoint.sh
