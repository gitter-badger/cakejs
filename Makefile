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
	@mkdir build
	@babel --stage 0 --optional runtime --out-dir build/src src > /dev/null
	@babel --stage 0 --modules commonStrict --out-dir build/pub pub > /dev/null

clean:
ifneq ($(wildcard build/.*),)
	@rm -r build
endif

test-silent:
	@cp -R tests build/tests
	@babel --stage 0 --optional runtime --out-dir build/tests tests > /dev/null
	@mocha --bail --slow 300 --timeout 5000 --ui exports build/tests > /dev/null	
	
test: build
	@cp -R tests build/tests
	@babel --stage 0 --optional runtime --out-dir build/tests tests > /dev/null
	@mocha --bail --slow 300 --timeout 5000 --ui exports build/tests

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
	
reset:
	git fetch --all
	git reset --hard origin/master