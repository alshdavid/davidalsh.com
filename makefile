default: build

clean:
	rm -rf dist

build:
	@cd test -d node_modules || pnpm install
	@make clean -s
	@cd .github/scripts && pnpm run start

watch:
	pnpm install
	cd .github/scripts && \
	nodemon \
		--signal SIGTERM \
		--watch '../../web/**/*' \
		--watch '../../posts/**/*' \
		--watch './src/**/*' \
		--signal SIGTERM --ext '*' \
		--exec 'rm -rf ../../dist && npx ts-node ./src/cmd/main.ts --no-cache || exit 1'

serve:
	http-server -c=-1 ./dist
