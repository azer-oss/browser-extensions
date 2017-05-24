include .env

BIN=./node_modules/.bin

all: compile

watch:
	@$(BIN)/chokidar "*.json" "*.js" "src/*.js" "make"

compile:
	@echo "  >  Compiling JS..."
	@$(BIN)/browserify background.js -o dist/background.js

sign-for-firefox: compile
	@cd dist && web-ext sign --api-key=$(MOZ_API_KEY) --api-secret=$(MOZ_API_SECRET)
	@mv dist/web-ext-artifacts/* .
	@rm -rf dist/web-ext-artifacts
