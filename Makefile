include .env

BIN=./node_modules/.bin

watch-chrome: compile-chrome
	@$(BIN)/chokidar "*.json" "chrome/*.js" "lib/*.js" -c "make compile-chrome"

compile-chrome:
	@echo "  >  Compiling Chrome..."
	@$(BIN)/browserify chrome/background.js -o chrome-dist/background.js
	@$(BIN)/browserify chrome/content.js -o chrome-dist/content.js

zip-chrome:
	@zip -r chrome-dist.zip chrome-dist

compile-firefox: compile-chrome
	@cd chrome-dist && web-ext sign --api-key=$(MOZ_API_KEY) --api-secret=$(MOZ_API_SECRET)
	@mv chrome-dist/web-ext-artifacts/* .
	@rm -rf chrome-dist/web-ext-artifacts

watch-safari: compile-safari
	@$(BIN)/chokidar "*.json" "safari/*.js" "lib/*.js" -c "make compile-safari"

compile-safari:
	@echo "  >  Compiling Safari..."
	@$(BIN)/browserify safari/global.js -o kozmos.safariextension/global.js
	@$(BIN)/browserify safari/injected.js -o kozmos.safariextension/injected.js

watch-newtab: compile-newtab
	@$(BIN)/chokidar "newtab/*.js" "lib/*.js" "chrome/*.js" "chrome/*.json" "newtab/*.json" "newtab/*.css" "newtab/*.html" \
		-c 'if [[ {path} == *.js ]]; then make compile-newtab-js; elif [[ {path} == *.json ]]; then make compile-newtab-js; else; make compile-newtab-html; fi'

compile-newtab: compile-newtab-js compile-newtab-html

compile-newtab-js:
	@echo "Compiling chrome-dist/newtab.js"
	@$(BIN)/browserify --debug newtab/newtab.js > chrome-dist/newtab.js

compile-newtab-html:
	@echo "Compiling chrome-dist/newtab.html"
	@echo "" > chrome-dist/newtab.html
	@cp newtab/header.html chrome-dist/newtab.html
	@cat newtab/*.css | $(BIN)/postcss --no-map -u postcss-clean >> chrome-dist/newtab.html
	@cat newtab/footer.html >> chrome-dist/newtab.html


watch-popup: compile-popup
	@$(BIN)/chokidar "popup/*.js" "lib/*.js" "popup/*.json" "popup/*.css" "popup/*.html" \
		-c 'if [[ {path} == *.js ]]; then make compile-popup-js; elif [[ {path} == *.json ]]; then make compile-popup-js; else; make compile-popup-html; fi'

compile-popup: compile-popup-js compile-popup-html

compile-popup-js:
	@echo "Compiling chrome-dist/popup.js"
	@$(BIN)/browserify --debug popup/popup.js > chrome-dist/popup.js

compile-popup-html:
	@echo "Compiling chrome-dist/popup.html"
	@echo "" > chrome-dist/popup.html
	@cp popup/header.html chrome-dist/popup.html
	@cat popup/*.css | $(BIN)/postcss --no-map -u postcss-clean >> chrome-dist/popup.html
	@cat popup/footer.html >> chrome-dist/popup.html
