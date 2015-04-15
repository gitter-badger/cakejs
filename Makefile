DEP_BABEL = $(shell npm ls -g | grep 'babel')
DEP_MOCHA = $(shell npm ls -g | grep 'mocha')

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

build: check clean
	@babel --stage 0 --optional runtime --out-dir lib src > /dev/null
	@babel --stage 0 --modules commonStrict --out-dir lib/Client src/Client > /dev/null

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

define release
	VERSION=`node -pe "require('./package.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
	node -e "\
		var j = require('./package.json');\
		j.version = \"$$NEXT_VERSION\";\
		var s = JSON.stringify(j, null, 2);\
		require('fs').writeFileSync('./package.json', s);" && \
	git commit -m "release $$NEXT_VERSION" -- package.json && \
	git tag "$$NEXT_VERSION" -m "release $$NEXT_VERSION"
endef

release-patch: build test
	@$(call release,patch)

release-minor: build test
	@$(call release,minor)

release-major: build test
	@$(call release,major)

publish:
	git push --tags origin HEAD:master
	npm publish