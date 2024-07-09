import * as S3 from "@aws-sdk/client-s3";
import { RemoteOptions } from "./remote-options.js";
import * as paths from "../paths.js";

export type DeleteItemsOptions = {
  fileList: string[];
  each?: (filename: string) => void;
};

export async function deleteItems(
  { Bucket, Client, Dry }: RemoteOptions,
  { fileList, each }: DeleteItemsOptions
): Promise<void> {
  if (fileList.length === 0) return;

  const command: S3.DeleteObjectsCommandInput = {
    Bucket,
    Delete: {
      Objects: [],
      Quiet: false,
    },
  };

  for (const item of fileList) {
    if (each) each(item);
    let Key = paths.makeRelative(item);
    command.Delete?.Objects?.push({ Key });
  }

  if (Dry) {
    return;
  }

  await Client.send(new S3.DeleteObjectsCommand(command));
}

export type DeleteItemsAsyncOptions = {
  fileList: string[];
};

export async function* deleteItemsAsync(
  { Bucket, Client, Dry }: RemoteOptions,
  { fileList }: DeleteItemsAsyncOptions,
): AsyncIterator<string> {
  if (fileList.length === 0) return;

  const command: S3.DeleteObjectsCommandInput = {
    Bucket,
    Delete: {
      Objects: [],
      Quiet: false,
    },
  };

  for (const item of fileList) {
    yield item;
    let Key = paths.makeRelative(item);
    command.Delete?.Objects?.push({ Key });
  }

  if (Dry) {
    return;
  }

  await Client.send(new S3.DeleteObjectsCommand(command));
}
