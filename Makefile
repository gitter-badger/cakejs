index:
	@node utils/indexer.js src

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