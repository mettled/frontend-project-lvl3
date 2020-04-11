install:
	npm install

start:
	npx babel-node 

lint:
	npx eslint .

dev:
	npx webpack

watch:
	npx webpack --watch