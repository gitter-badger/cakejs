DEP_BABEL = $(shell npm ls -g | grep 'babel')
DEP_MOCHA = $(shell npm ls -g | grep 'mocha')

check:
ifeq ($(DEP_BABEL),)
	$(error npm:Babel was not installed, globally, run: make install)
endif
ifeq ($(DEP_MOCHA),)
	$(error npm:Mocha was not installed, globally, run: make install)
endif
ifeq ($(wildcard node_modules/.*),)
	$(error npm:Node modules are missing, run: make install)
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
	@npm install > /dev/null

build: check clean
	@babel --stage 0 --optional runtime --out-dir lib src > /dev/null

clean:
ifneq ($(wildcard lib/.*),)
	@rm -r lib
endif

test-silent:
	@cp -R tests lib/Tests
	@babel --stage 0 --optional runtime --out-dir lib/Tests tests > /dev/null
	@mocha --bail --slow 300 --timeout 5000 --ui exports lib/Tests > /dev/null	
	
test: build
	@cp -R tests lib/Tests
	@babel --stage 0 --optional runtime --out-dir lib/Tests tests > /dev/null
	@mocha --bail --slow 300 --timeout 5000 --ui exports lib/Tests
