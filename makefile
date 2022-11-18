default: build

clean:
	rm -rf dist

build:
	@cd test -d node_modules || pnpm install
	@make clean -s
	@cd .github/scripts && pnpm run start

watch:
	nodemon \
		--signal SIGTERM \
		--watch web \
		--watch posts \
		--watch .github/scripts/src \
		--ext .* \
		--delay .5 \
		--exec 'clear && make build && echo'

serve:
	http-server -c=-1 ./dist
