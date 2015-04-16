install:
	@echo make: installing dependency \'babel\'
	@npm install -s -g babel
	@echo make: installing dependency \'mocha\'
	@npm install -s -g mocha
	@echo make: installing dependency \'browserify\'
	@npm install -s -g browserify
	@npm install > /dev/null

build: clean index
	@mkdir dist
	@babel --stage 0 --optional runtime --out-dir dist/src src > /dev/null
	@mkdir dist/pub
	@browserify pub/client.js -t [ babelify --stage 0 ] --outfile dist/pub/client.js

clean:
ifneq ($(wildcard dist/.*),)
	@rm -r dist
endif

test-silent:
	@cp -R tests dist/tests
	@babel --stage 0 --optional runtime --out-dir dist/tests tests > /dev/null
	@mocha --bail --slow 300 --timeout 5000 --ui exports dist/tests > /dev/null	
	
test: build
	@cp -R tests dist/tests
	@babel --stage 0 --optional runtime --out-dir dist/tests tests > /dev/null
	@mocha --bail --slow 300 --timeout 5000 --ui exports dist/tests

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