clean:
	rm -rf dist

build-ejs:
	cd .github/scripts && test -d node_modules || pnpm install
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
		--watch .github/scripts/src \
		--ext .* \
		--delay .5 \
		--exec 'clear && make build && echo'

