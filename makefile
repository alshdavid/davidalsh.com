default: build

clean:
	rm -rf dist

build:
	pnpm install
	rm -rf dist
	cd .github/scripts && pnpm run start

watch:
	pnpm install
	cd .github/scripts && \
	node node_modules/nodemon/bin/nodemon.js \
		--signal SIGTERM \
		--watch '../../web/**/*' \
		--watch '../../posts/**/*' \
		--watch './src/**/*' \
		--signal SIGTERM --ext '*' \
		--exec 'rm -rf ../../dist && npx ts-node ./src/cmd/main.ts --no-cache || exit 1'

serve:
	http-server -c=-1 ./dist
