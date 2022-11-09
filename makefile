clean:
	rm -rf dist

build-ejs:
	test -d .github/scripts/node_modules || cd .github/scripts && pnpm install
	cd .github/scripts && \
	pnpm script crawl \
		--cwd ../../src \
		--target .*\.ejs$$ \
		--ignore partials \
		--run-script compile-ejs

build: clean build-ejs

watch:
	nodemon \
		--signal SIGTERM \
		--watch src \
		--ext .* \
		--delay .5 \
		--exec 'clear && make build && echo'

