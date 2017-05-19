BIN=./node_modules/.bin

all: compile

watch:
	@$(BIN)/chokidar "*.json" "*.js" "src/*.js" "make"

compile:
	@echo "  >  Compiling JS..."
	@$(BIN)/browserify background.js -o dist/background.js
