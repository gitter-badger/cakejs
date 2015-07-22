install:
	@echo make: installing dependency \'babel\'
	@npm install -s -g babel
	@echo make: installing dependency \'mocha\'
	@npm install -s -g mocha
	@echo make: installing dependency \'browserify\'
	@npm install -s -g browserify
	@npm install > /dev/null

watch:
	@babel --watch --stage 0 --optional runtime --out-dir dist/src src

rebuild: index
	@node utils/rebuild.js

build: clean index
	@rsync -ax --exclude dist --exclude tests --exclude node_modules --exclude Makefile --exclude LICENSE --exclude npm-debug.log --exclude package.json --exclude README.md --exclude utils * dist
	@babel --stage 0 --optional runtime --out-dir dist/src dist/src > /dev/null
	@babel --stage 0 --optional runtime --out-dir dist/bin dist/bin > /dev/null
	@browserify dist/webroot/js/* -t [ babelify --stage 0 ] --standalone client --outfile dist/webroot/js/*

clean:
ifneq ($(wildcard dist/.*),)
	@rm -r dist
endif

test-silent:
	@cp -R tests dist/tests
	@babel --stage 0 --optional runtime --out-dir dist/tests tests > /dev/null
	@mocha --bail --slow 300 --timeout 5000 --ui exports dist/tests > /dev/null	

ifeq ($(wildcard dist/.*),)
test: build
else
test:
endif	
ifneq ($(wildcard dist/tests/.*),)
	@rm -r dist/tests
endif
	@cp -R tests dist/tests
	@babel --stage 0 --optional runtime --out-dir dist/tests/Fixture dist/tests/Fixture > /dev/null
	@babel --stage 0 --optional runtime --out-dir dist/tests/TestCase dist/tests/TestCase > /dev/null
	@babel --stage 0 --optional runtime --out-dir dist/tests/test_app/TestApp dist/tests/test_app/TestApp > /dev/null
	@babel --stage 0 --optional runtime --out-dir dist/tests/test_app/Plugin/TestPlugin/src dist/tests/test_app/Plugin/TestPlugin/src > /dev/null
	@mocha --recursive --slow 300 --timeout 5000 --ui exports -r dist/tests/bootstrap.js dist/tests/TestCase/TestSuite/FixtureTest

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

index:
	@node utils/indexer.js src

release-patch: build test-silent
	@$(call release,patch)

release-minor: build test-silent
	@$(call release,minor)

release-major: build test-silent
	@$(call release,major)

publish:
	git push --tags origin HEAD:master
	npm publish
	
reset:
	git fetch --all
	git reset --hard origin/master