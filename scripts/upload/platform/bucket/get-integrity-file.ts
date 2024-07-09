import * as S3 from '@aws-sdk/client-s3'
import { RemoteOptions } from "./remote-options"

export async function getIntegrityFile({ Bucket, Client }: RemoteOptions): Promise<Record<string, string>> {
  try {
    const response = await Client.send(new S3.GetObjectCommand({
      Bucket,
      Key: 'integrity.json',
    }))
  
    const resultsString = (await response.Body?.transformToString()!) || '{}'
    const json = JSON.parse(resultsString)
    return json
  } catch (error) {
    return {}
  }
}
