#!/bin/env ts-node

import * as path from 'node:path'

const scriptPath = path.join(__dirname, '..', '..', 'scripts', process.argv[2], 'index.ts')
process.argv[1] = scriptPath
process.argv.splice(2, 1)

import(scriptPath)
