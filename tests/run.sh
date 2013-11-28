#!/bin/sh

bower install

echo "Starting tests..."

node ./tests/server/app.js &
testServerPid=$!

mocha-phantomjs -R list "http://localhost:3000/"

kill $testServerPid
