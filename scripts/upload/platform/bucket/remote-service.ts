import { DeleteItemsOptions, deleteItems } from "./delete-items.js";
import { MD5Hash, getFileList } from "./get-file-list.js";
import { PutFileOptions, putFile } from "./put-file.js";
import { PutTextOptions, putText } from "./put-text.js";
import { RemoteOptions } from "./remote-options.js";

export class BucketService {
  readonly #remoteOptions: RemoteOptions

  constructor({
    Client,
    Bucket,
    Dry,
  }: RemoteOptions) {
    this.#remoteOptions = Object.freeze({ Client, Bucket, Dry })
  }

  deleteItems(options: DeleteItemsOptions): Promise<void> {
    return deleteItems(this.#remoteOptions, options)
  }

  putFile(options: PutFileOptions): Promise<void> {
    return putFile(this.#remoteOptions, options)
  }

  putText(options: PutTextOptions): Promise<void> {
    return putText(this.#remoteOptions, options)
  }

  getFileList(): Promise<Record<string, MD5Hash>> {
    return getFileList(this.#remoteOptions)
  }
}