install:
	npm install

start:
	npx babel-node 

lint:
	npx eslint .

dev:
	NODE_ENV=development npx webpack

open:
	NODE_ENV=development npx webpack --open

build:
	NODE_ENV=production npx webpack

watch:
	npx webpack --watch