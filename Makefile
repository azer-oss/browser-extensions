include .env

BIN=./node_modules/.bin

watch-chrome: compile-chrome
	@$(BIN)/chokidar "*.json" "chrome/*.js" "lib/*.js" -c "make compile-chrome"

compile-chrome:
	@echo "  >  Compiling Chrome..."
	@$(BIN)/browserify chrome/background.js -o chrome-dist/background.js

sign-for-firefox: compile-chrome
	@cd chrome-dist && web-ext sign --api-key=$(MOZ_API_KEY) --api-secret=$(MOZ_API_SECRET)
	@mv chrome-dist/web-ext-artifacts/* .
	@rm -rf chrome-dist/web-ext-artifacts

watch-safari: compile-safari
	@$(BIN)/chokidar "*.json" "safari/*.js" "lib/*.js" -c "make compile-safari"

compile-safari:
	@echo "  >  Compiling Safari..."
	@$(BIN)/browserify safari/global.js -o kozmos.safariextension/global.js
	@$(BIN)/browserify safari/injected.js -o kozmos.safariextension/injected.js
