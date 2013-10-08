all: dist

js-dist:
	@find js/ -type f -name "header.*" | xargs cat > dist/js/greppy.js
	@find js/ -type f -not -name "header.*" -not -name "footer.*" | sort | xargs cat >> dist/js/greppy.js
	@find js/ -type f -name "footer.*" | xargs cat >> dist/js/greppy.js
	@node_modules/.bin/uglifyjs dist/js/greppy.js > dist/js/greppy.min.js

css-dist:
	@find less/ -type f | xargs cat > dist/css/greppy.less
	@./node_modules/.bin/lessc dist/css/greppy.less dist/css/greppy.css
	@./node_modules/.bin/lessc --compress --yui-compress dist/css/greppy.less dist/css/greppy.min.css
	@rm -f dist/css/greppy.less

dist: js-dist css-dist

.PHONY: dist

