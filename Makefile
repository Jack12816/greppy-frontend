# Commands and Paths
SHELL=/bin/bash

NPM := $(shell which npm)
GRUNT := $(shell pwd)/node_modules/.bin/grunt
RELEASE := $(shell pwd)/bin/release

.PHONY: all build install

all:
	##### Provision #####
	# install          Downlaod and install dependencies
	# build            Build the the library (compile and minify)
	#
	##### Development #####
	# watch            Start grunt as file watcher to automatically rebuild the library
	# release          Release a new version of the library

install:
	##### Install #####
	@${NPM} install

release:
	##### Release #####
	@${RELEASE}

watch: install
	##### Watch #####
	@${GRUNT} watch

build: install
	##### Build #####
	@${GRUNT}

