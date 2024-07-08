import { createHash } from 'node:crypto'
import * as fs from 'node:fs'

export function sha1(content: any, truncate?: number): string {
  if (typeof content === 'object') {
    content = JSON.stringify(content, null, 2)
  }
  const result = createHash('sha1').update(content).digest('hex')
  if (truncate !== undefined) {
    return result.substring(0, truncate)
  }
  return result
}

export function sha1File(filepath: string, truncate?: number): string {
  const fileBuffer = fs.readFileSync(filepath);
  const result = createHash('sha1').update(fileBuffer).digest('hex')
  if (truncate !== undefined) {
    return result.substring(0, truncate)
  }
  return result
}

export function md5(content: any) {  
  return createHash('md5').update(content).digest('hex')
}

export function md5File(filepath: string): string {
  const fileBuffer = fs.readFileSync(filepath);
  const result = createHash('md5').update(fileBuffer).digest('hex')
  return result
}

export function S3Etag(
  filePath: string,
  partSizeInBytes = (8 * 1024 * 1024), // 8MB
): string {
  const { size: fileSizeInBytes } = fs.statSync(filePath);
  let parts = Math.floor(fileSizeInBytes / partSizeInBytes);
  if (fileSizeInBytes % partSizeInBytes > 0) {
    parts += 1;
  }
  const fileDescriptor = fs.openSync(filePath, 'r');
  let totalMd5 = '';

  for (let part = 0; part < parts; part++) {
    const skipBytes = partSizeInBytes * part;
    const totalBytesLeft = fileSizeInBytes - skipBytes;
    const bytesToRead = Math.min(totalBytesLeft, partSizeInBytes);
    const buffer = Buffer.alloc(bytesToRead);
    fs.readSync(fileDescriptor, buffer, 0, bytesToRead, skipBytes);
    totalMd5 += md5(buffer);
  }

  const combinedHash = md5(Buffer.from(totalMd5, 'hex'));
  const etag = `${combinedHash}-${parts}`;
  return etag;
}