FROM mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim as build

# these are specified in Makefile
ARG PLATFORM
ARG YQ_VERSION
ARG YQ_SHA

WORKDIR /app

COPY ./src /app

RUN \
  dotnet restore && \
  dotnet publish -c Release -o out

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

FROM mcr.microsoft.com/dotnet/runtime:8.0-bookworm-slim

WORKDIR /app

COPY --from=build /app/out /app
COPY --from=build /usr/local/bin/yq /usr/local/bin/yq
COPY ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
