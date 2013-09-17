all: dist

dist:
	node_modules/.bin/uglifyjs dist/js/greppy.js > dist/js/greppy.min.js
	node_modules/.bin/cleancss -o dist/css/greppy.min.css dist/css/greppy.css

.PHONY: dist

