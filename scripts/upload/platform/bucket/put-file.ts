import { RemoteOptions } from "./remote-options";
import * as S3 from "@aws-sdk/client-s3";
import { contentType } from "mime-types";
import * as path from "node:path";
import * as fs from "node:fs";
import * as paths from "../paths";

export type PutFileOptions = {
  filepath: string;
  keypath: string;
  cacheControl?: string;
};

export async function putFile(
  { Client, Bucket, Dry }: RemoteOptions,
  {
    filepath,
    keypath,
    cacheControl = "no-cache, no-store, must-revalidate",
  }: PutFileOptions
): Promise<void> {
  const input: S3.PutObjectCommandInput = {
    Body: fs.createReadStream(filepath),
    Bucket: Bucket,
    Key: paths.makeRelative(keypath),
    CacheControl: cacheControl,
  };

  const ct = contentType(path.basename(keypath));
  if (ct) {
    input.ContentType = ct;
  }
  const command = new S3.PutObjectCommand(input);
  if (Dry) {
    return;
  }
  await Client.send(command);
}
