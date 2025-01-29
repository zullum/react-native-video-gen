import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import getBlob from 'react-native-blob-util';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

type FileType = 'image' | 'audio' | 'srt';

export const uploadToS3 = async (fileUri: string, fileType: FileType) => {
  try {
    const file = await getBlob.fs.readFile(fileUri, 'base64');
    const extension = fileType === 'image' ? 'jpg' : fileType === 'audio' ? 'mp3' : 'srt';
    const key = `${Date.now()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: 'YOUR_S3_BUCKET_NAME',
      Key: key,
      Body: file,
      ContentType: getMimeType(fileType)
    });

    await s3Client.send(command);
    return `https://${process.env.AWS_BUCKET_URL}/${key}`;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};

function getMimeType(fileType: FileType): string {
  return {
    image: 'image/jpeg',
    audio: 'audio/mpeg',
    srt: 'text/plain'
  }[fileType];
}
