default: build

clean:
	rm -rf dist

build: clean
	cd .github/scripts && test -d node_modules || pnpm install
	cd .github/scripts && pnpm run start

watch:
	nodemon \
		--signal SIGTERM \
		--watch src \
		--watch .github/scripts/src \
		--ext .* \
		--delay .5 \
		--exec 'clear && make build && echo'

serve:
	http-server -c=-1 ./dist
