install:
	npm install

start:
	npx babel-node 

lint:
	npx eslint .

dev:
	NODE_ENV=development npx webpack --mode development

open:
	NODE_ENV=development npx webpack --mode development --open

build:
	NODE_ENV=production npx webpack --mode production

watch:
	npx webpack --watch