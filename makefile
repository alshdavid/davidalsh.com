clean:
	rm -rf dist

build-markdown:
	find ./src -type f -name "*.md" -exec sh -c 'cd .github/scripts && pnpm script compile-markdown "{}"' \;

build-ejs2:
	cd src && \
	find ./ -type f -name "*.ejs" -exec sh -c 'cd .github/scripts && pnpm script compile-ejs "{}"' \;

build-ejs:
	cd .github/scripts && \
	pnpm script crawl \
		--cwd ../../src \
		--target .*\.ejs$$ \
		--ignore partials \
		--run-script compile-ejs

build: clean build-markdown
