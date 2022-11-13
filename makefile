default: build

clean:
	rm -rf dist

build:
	@cd .github/scripts && test -d node_modules || pnpm install
ifeq (${COMPILE_SCRIPTS}, true)
	@cd .github/scripts && pnpm run build
else
	@cd .github/scripts && test -d dist || pnpm run build
endif
	@make clean -s
	@cd .github/scripts && pnpm run start

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
