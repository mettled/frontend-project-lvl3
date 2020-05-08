install:
	npm install

lint:
	npx eslint .

dev:
	npx webpack-dev-server --open

build:
	npx webpack

watch:
	npx webpack --watch