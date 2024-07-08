import * as S3 from '@aws-sdk/client-s3'

export type RemoteOptions = {
  Client: S3.S3Client
  Bucket: string
  Dry?: boolean
}
