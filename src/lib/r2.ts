import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

let client: S3Client | null = null;

function getBucketName(): string {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    throw new Error('R2_BUCKET_NAME is not configured.');
  }
  return bucket;
}

export function getR2PublicUrl(): string {
  const publicUrl =
    process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!publicUrl) {
    throw new Error('R2_PUBLIC_URL is not configured.');
  }
  return publicUrl.replace(/\/+$/, '');
}

function getClient(): S3Client {
  if (client) {
    return client;
  }

  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('Cloudflare R2 credentials are not configured.');
  }

  client = new S3Client({
    region: 'auto',
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });

  return client;
}

export function getObjectPublicUrl(key: string): string {
  return `${getR2PublicUrl()}/${key.replace(/^\/+/, '')}`;
}

export async function uploadObject(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return getObjectPublicUrl(key);
}

export async function deleteObjectByUrl(
  url: string | null | undefined
): Promise<void> {
  if (!url) {
    return;
  }

  const publicUrl = getR2PublicUrl();
  const path = url.split('?')[0];

  if (!path.startsWith(`${publicUrl}/`)) {
    return;
  }

  const key = path.slice(publicUrl.length + 1);
  if (!key) {
    return;
  }

  await getClient().send(
    new DeleteObjectCommand({
      Bucket: getBucketName(),
      Key: key,
    })
  );
}
