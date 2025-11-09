PACKAGE_ID := $(shell grep -o "id: '[^']*'" startos/manifest.ts | sed "s/id: '\([^']*\)'/\1/")
INGREDIENTS := $(shell start-cli s9pk list-ingredients 2> /dev/null)

.PHONY: all clean install check-deps check-init ingredients x86 arm

.DELETE_ON_ERROR:

all: ${PACKAGE_ID}.s9pk
	@echo " Done!"
	@echo " Filesize:$(shell du -h $(PACKAGE_ID).s9pk) is ready"

check-deps:
	@if ! command -v start-cli > /dev/null; then \
		echo "Error: start-cli not found. Please install it first."; \
		exit 1; \
	fi
	@if ! command -v npm > /dev/null; then \
		echo "Error: npm (Node Package Manager) not found. Please install Node.js and npm."; \
		exit 1; \
	fi

check-init:
	@if [ ! -f ~/.startos/developer.key.pem ]; then \
		start-cli init-key; \
	fi

ingredients: $(INGREDIENTS)
	@echo "Re-evaluating ingredients..."

${PACKAGE_ID}.s9pk: $(INGREDIENTS) | check-deps check-init
	@$(MAKE) --no-print-directory ingredients
	start-cli s9pk pack

javascript/index.js: $(shell git ls-files startos) tsconfig.json node_modules package.json
	npm run build

assets:
	mkdir -p assets

node_modules: package-lock.json
	npm ci

package-lock.json: package.json
	npm i

clean:
	rm -rf ${PACKAGE_ID}.s9pk
	rm -rf javascript
	rm -rf node_modules

scripts/embassy.js: $(TS_FILES)
	deno run --allow-read --allow-write --allow-env --allow-net scripts/bundle.ts

docker-images/aarch64.tar: manifest.yaml Dockerfile docker_entrypoint.sh $(SOURCES)
ifeq ($(ARCH),x86_64)
else
	mkdir -p docker-images
	docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) \
		--platform=linux/arm64 -o type=docker,dest=docker-images/aarch64.tar .
endif

docker-images/x86_64.tar: manifest.yaml Dockerfile docker_entrypoint.sh $(SOURCES)
ifeq ($(ARCH),aarch64)
else
	mkdir -p docker-images
	docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) \
		--platform=linux/amd64 -o type=docker,dest=docker-images/x86_64.tar .
endif

$(PKG_ID).s9pk: manifest.yaml instructions.md icon.png LICENSE scripts/embassy.js docker-images/aarch64.tar docker-images/x86_64.tar
ifeq ($(ARCH),aarch64)
	@echo "start-sdk: Preparing aarch64 package ..."
else ifeq ($(ARCH),x86_64)
	@echo "start-sdk: Preparing x86_64 package ..."
else
	@echo "start-sdk: Preparing Universal Package ..."
endif
	@start-sdk pack
