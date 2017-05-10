BIN=./node_modules/.bin

all: compile-js

watch: compile-js
	@$(BIN)/chokidar "*.json" "*.js" "src/*.js" "*.css" -c "make"

compile-js:
	@echo "  >  Compiling JS..."
	@$(BIN)/browserify background.js -o build/background.js
	@$(BIN)/browserify content.js -o build/content.js

compile-css:
	@echo "  >  Compiling CSS..."
	@cat *.css > build/dist.css
