import { S3Client } from '@aws-sdk/client-s3'
import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import * as Remote from './platform/bucket/index.js'
import * as CloudFront from './platform/cloudfront/index.js'
import * as Local from './platform/local/index.js'
import { CacheControl } from './platform/cache-control/index.js';
import * as paths from '../../../scripts/paths.js'

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename); 

function readFile(filepath: string): string {
  return fs.readFileSync(filepath, { encoding: 'utf-8' })
}

function readJson<T = any>(filepath: string): T {
  return JSON.parse(readFile(filepath))
}

const BUCKET = process.env.AWS_S3_BUCKET || 'alshdavid-web-com-davidalsh-www'
const DISTRIBUTION = process.env.AWS_CLOUDFRONT_DISTRIBUTION || 'E1RN9EP7R6042I'
const DRY = process.env.DRY ? process.env.DRY === 'true' : false

const S3 = new S3Client({ region: 'ap-southeast-2' });
const CF = new CloudFrontClient({ region: 'ap-southeast-2' })

void async function main() {  
  const cloudfront = new CloudFront.Cloudfront({
    Client: CF,
    Distribution: DISTRIBUTION,
    Dry: DRY,
  })

  const bucket = new Remote.BucketService({
    Client: S3,
    Bucket: BUCKET,
    Dry: DRY,
  })

  const cacheControl = new CacheControl([__dirname, 'cache-control.yml'])

  const localFileList = {
    ...Local.getFileList({ filepath: paths.__dist }),
  }

  const bucketFileList = await bucket.getFileList()

  const toPut: Record<string, boolean> = {}
  const toUpdate: Record<string, boolean> = {}
  const toDelete: Record<string, boolean> = {}

  for (const [file, { hash }] of Object.entries(localFileList)) {
    if (file === 'etag.json') continue
    if (!(file in bucketFileList)) {
      toPut[file] = true
      continue
    }
    if (bucketFileList[file] !== hash) {
      toUpdate[file] = true
      continue
    }
  }

  for (const [file] of Object.entries(bucketFileList)) {
    if (file === 'etag.json') continue
    if (!(file in localFileList)) {
      toDelete[file] = true
    }
  }

  const toPutList = Object.keys(toPut)
  const toUpdateList = Object.keys(toUpdate)
  const toDeleteList = Object.keys(toDelete)

  const toPutAmount = toPutList.length
  const toUpdateAmount = toUpdateList.length
  const toDeleteAmount = toDeleteList.length

  const hasToPut = toPutAmount !== 0
  const hasToUpdate = toUpdateAmount !== 0
  const hasToDelete = toDeleteAmount !== 0

  if (hasToPut || hasToUpdate || hasToDelete) {
    console.log(`To Put:     ${toPutAmount}`)
    console.log(`To Update:  ${toUpdateAmount + 1}`)
    console.log(`To Delete:  ${toDeleteAmount}`)
    console.log('')
  }

  for (const keyPath of toPutList) {
    console.log(chalk.green(`NEW: ${keyPath}`))
  }
  for (const keyPath of toUpdateList) {
    console.log(chalk.yellow(`UPD: ${keyPath}`))
  }
  for (const keyPath of toDeleteList) {
    console.log(chalk.red(`DEL: ${keyPath}`))
  }

  for (const keyPath of toPutList) {
    const file = localFileList[keyPath]
    if (!file) {
      throw new Error('Cannot file ' + keyPath)
    }
    const cc = await cacheControl.getCacheControl('/' + keyPath)
    console.log(chalk.green(`NEW: ${keyPath}`))
    await bucket.putFile({
      filepath: file.fullPath,
      keypath: file.keyPath,
      cacheControl: cc,
    })
  }

  for (const keyPath of toUpdateList) {
    const file = localFileList[keyPath]
    if (!file) {
      throw new Error('Cannot file ' + keyPath)
    }
    const cc = await cacheControl.getCacheControl('/' + keyPath)
    console.log(chalk.yellow(`UPD: ${keyPath}`))
    await bucket.putFile({
      filepath: file.fullPath,
      keypath: file.keyPath,
      cacheControl: cc,
    })
  }

  if (hasToPut || hasToUpdate || hasToDelete) {
    const etagFile = await bucket.getFileList()
    console.log(chalk.yellow(`UPD: etag.json`))
    await bucket.putText({
      text: JSON.stringify(etagFile),
      keypath: 'etag.json',
      cacheControl: await cacheControl.getCacheControl('/etag.json')
    })
  }

  for (const keyPath of toDeleteList) {
    console.log(chalk.red(`DEL: ${keyPath}`))
  }

  await bucket.deleteItems({
    fileList: toDeleteList,
  })

  console.log(`Uploaded:  ${toPutAmount}`)
  if (hasToPut || hasToUpdate || hasToDelete) {
    console.log(`Updated:   ${toUpdateAmount + 1}`)
  } else {
    console.log(`Updated:   ${toUpdateAmount}`)
  }
  console.log(`Deleted:   ${toDeleteAmount}`)

  if (hasToPut || hasToUpdate || hasToDelete) {
    console.log(chalk.blueBright(`Invalidating: ${toPutAmount + toUpdateAmount + toDeleteAmount + 1}`))
    await cloudfront.invalidate({
      patterns: [
        ...toPutList.map(p => `/${p}`),
        ...toUpdateList.map(p => `/${p}`),
        ...toDeleteList.map(p => `/${p}`),
        '/etag.json',
      ]
    })
    console.log('')
  }
}()
