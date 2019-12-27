## browser-extensions

This is the source code of [Kozmos](http://getkozmos.com)' browser extensions. 

![](https://cldup.com/nrk7XgbqdA.png)

## Commands

Google Chrome:
* `make compile-chrome`: Compile Google Chrome distribution. 
* `make watch-chrome`: Watch for changes and recompile

Firefox:
* `make compile-firefox`: Outputs a signed XPI file in the root directory.
* Use `watch-chrome` for development.  They share the same code.

Safari:
* `make compile-safari`: Compiles source code into Safari extension directory.
* `make watch-safari`: Watch for changes and recompile.
