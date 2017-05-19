BIN=./node_modules/.bin

all: compile-js

watch:
	@$(BIN)/chokidar "*.json" "*.js" "src/*.js" "*.css" -c "make"

compile-js:
	@echo "  >  Compiling JS..."
	@$(BIN)/browserify background.js -o build/background.js

compile-css:
	@echo "  >  Compiling CSS..."
	@cat *.css > build/dist.css
