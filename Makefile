DEP_BABEL = $(shell npm ls -g | grep 'babel')
DEP_MOCHA = $(shell npm ls -g | grep 'mocha')

check:
ifeq ($(DEP_BABEL),)
	$(error npm:Babel was not installed, globally)
endif
ifeq ($(DEP_MOCHA),)
	$(error npm:Mocha was not installed, globally)
endif

install:
ifeq ($(DEP_BABEL),)
	@echo make: installing dependency \'babel\'
	@npm install -g babel
endif
ifeq ($(DEP_MOCHA),)
	@echo make: installing dependency \'mocha\'
	@npm install -g mocha
endif

build: check clean
	@babel --stage 0 --optional runtime --out-dir lib src > /dev/null

clean:
ifneq ($(wildcard lib/.*),)
	@rm -r lib
endif

test-silent:
	@babel --stage 0 --optional runtime --out-dir lib/Tests tests > /dev/null
	@mocha --ui exports lib/Tests > /dev/null	
	
test: build
	@babel --stage 0 --optional runtime --out-dir lib/Tests tests > /dev/null
	@mocha --ui exports lib/Tests