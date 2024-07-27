FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine as build

WORKDIR /app

COPY ./src/PushTX .
  
RUN \
    dotnet restore && \
    dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine

RUN apk update && \
    apk add --no-cache \
    nginx yq \
    rm -rf \
    /tmp/* \
    /var/cache/apk/* \
    /var/tmp/*

WORKDIR /app

COPY --chmod=755 ./docker_entrypoint.sh /app/docker_entrypoint.sh
COPY --from=build /app/out /app
