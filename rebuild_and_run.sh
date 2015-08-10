tsc -p src
tsc -p examples/todo
tsc -p test

node node_modules/mocha/bin/mocha -R spec
