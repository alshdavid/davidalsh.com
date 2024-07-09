import { RemoteOptions } from "./remote-options";
import * as mime from "mime-types";
import * as S3 from "@aws-sdk/client-s3";
import * as paths from "../paths";
import * as path from "node:path";

export type PutTextOptions = {
  text: string;
  keypath: string;
  contentType?: string;
  cacheControl?: string;
};

export async function putText(
  { Client, Bucket, Dry }: RemoteOptions,
  {
    text,
    keypath,
    contentType,
    cacheControl = "no-cache, no-store, must-revalidate",
  }: PutTextOptions
): Promise<void> {
  const input: S3.PutObjectCommandInput = {
    Body: text,
    Bucket: Bucket,
    Key: paths.makeRelative(keypath),
    CacheControl: cacheControl,
    ContentType: contentType,
  };
  const ct = mime.contentType(path.basename(keypath));
  if (ct) {
    input.ContentType = ct;
  }
  const command = new S3.PutObjectCommand(input);
  if (Dry) {
    return;
  }
  await Client.send(command);
}
