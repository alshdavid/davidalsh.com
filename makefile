clean:
	rm -rf dist

build-markdown:
	find ./src -type f -name "*.md" -exec sh -c 'cd .github/scripts && pnpm script compile-markdown "{}"' \;


build: clean build-markdown
