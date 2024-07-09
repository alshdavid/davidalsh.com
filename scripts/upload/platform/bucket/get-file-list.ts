import * as S3 from '@aws-sdk/client-s3'
import { RemoteOptions } from "./remote-options.js"

export type MD5Hash = string

export async function getFileList({ 
  Bucket, Client 
}: RemoteOptions): Promise<Record<string, MD5Hash>> {
  const items: Record<string, string> = {}

  const config: S3.ListObjectsV2CommandInput = {
    Bucket,
    MaxKeys: Number(1000),
  }

  for await (const data of S3.paginateListObjectsV2({ client: Client }, config)) {
    for (const item of data.Contents || []) {
      if (item.Key) {
        const key = item.Key
        if (item.ETag) {
          items[key] = item.ETag.substring(1, item.ETag.length-1)
        } else {
          items[key] = ''
        }
      }
    }
  }

  return items
}
