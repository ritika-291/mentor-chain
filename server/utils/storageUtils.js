import fs from 'fs';
import path from 'path';

export async function uploadFile({ localPath, filename }) {
    // If S3 env is configured, attempt to upload; otherwise return local URL
    if (process.env.S3_BUCKET && process.env.AWS_REGION) {
        try {
            const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
            const s3 = new S3Client({ region: process.env.AWS_REGION });
            const fileStream = fs.createReadStream(localPath);
            const key = `session_notes/${filename}`;
            await s3.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, Body: fileStream }));
            // Construct public url (assuming bucket is public or CloudFront is used)
            const url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            return { url, provider: 's3' };
        } catch (err) {
            console.warn('S3 upload failed, falling back to local path:', err.message);
        }
    }

    // Local URL
    const publicUrl = `/uploads/session_notes/${filename}`;
    return { url: publicUrl, provider: 'local' };
}
