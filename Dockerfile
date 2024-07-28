# QEMU crashes when building arm64 container, so we use this pattern to create a multi-platform build:
# https://devblogs.microsoft.com/dotnet/improving-multiplatform-container-support/
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build

# implicitly set by docker build
ARG TARGETARCH

# install nodejs/npm to build cc-implementation
RUN apk update && apk add --no-cache nodejs npm

WORKDIR /app

COPY ./src .

# regenerate index.html from source
RUN \
    cd /app/cc-implementation && \
    npm install && \
    npm run build

# compile PushTX app for target architecture (arm64/amd64)
RUN \
    cd /app/PushTX && \
    dotnet restore -a $TARGETARCH && \
    dotnet publish -a $TARGETARCH --no-restore -c Release -o out

# start from aspnet runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine

# install nginx and yq
RUN \
    apk update && \
    apk add --no-cache nginx yq && \
    rm -rf \
      /tmp/* \
      /var/cache/apk/* \
      /var/tmp/*

WORKDIR /app

COPY --chmod=755 ./docker_entrypoint.sh /app/docker_entrypoint.sh
COPY --from=build /app/PushTX/out /app
