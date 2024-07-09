import * as CF from "@aws-sdk/client-cloudfront";

export type InvalidateOptions = {
  patterns: string[]
}

export type PutFunctionOptions = {
  functionName: string
  code: string
}

export type GetFunctionOptions = {
  functionName: string
}

type CloudfrontOptions = {
  Client: CF.CloudFrontClient
  Distribution: string
  Dry?: boolean
}

export class Cloudfront {
  readonly #options: CloudfrontOptions

  constructor(options: CloudfrontOptions) {
    this.#options = options
  }

  async invalidate({ patterns }: InvalidateOptions): Promise<void> {
    if (this.#options.Dry) return

    const options: CF.CreateInvalidationCommandInput = {
      DistributionId: this.#options.Distribution,
      InvalidationBatch: {
        CallerReference: new Date().getTime().toString(),
        Paths: {
          Quantity: patterns.length,
          Items: patterns
        }
      }
    }

    const command = new CF.CreateInvalidationCommand(options);
    await this.#options.Client.send(command);
  }

  async getFunction({ functionName }: GetFunctionOptions): Promise<CF.DescribeFunctionCommandOutput> {
    const input: CF.DescribeFunctionCommandInput = { // DescribeFunctionRequest
      Name: functionName,
    };
    const command = new CF.DescribeFunctionCommand(input);
    return await this.#options.Client.send(command);
  }

  async putFunction({ functionName, code }: PutFunctionOptions): Promise<void> {
    const current = await this.getFunction({ functionName })

    const input: CF.UpdateFunctionCommandInput = {
      Name: functionName,
      IfMatch: current.ETag,
      FunctionConfig: { 
        Comment: functionName, 
        Runtime: "cloudfront-js-1.0",
      },
      FunctionCode: new TextEncoder().encode(code),
    }

    const command = new CF.UpdateFunctionCommand(input);
    const result = await this.#options.Client.send(command);

    const publishInput: CF.PublishFunctionCommandInput = {
      Name: functionName,
      IfMatch: result.ETag,
    }

    const publishCommand = new CF.PublishFunctionCommand(publishInput);
    await this.#options.Client.send(publishCommand);
  }
}