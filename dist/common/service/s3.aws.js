"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
class S3Service {
    client;
    bucketName;
    constructor() {
        this.client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        this.bucketName = process.env.AWS_BUCKET_NAME;
    }
    async uploadFile({ file, fileName, mimeType, bucketName = this.bucketName, }) {
        const key = `uploads/${(0, uuid_1.v4)()}-${fileName}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: file,
            ContentType: mimeType,
        });
        await this.client.send(command);
        return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }
    async deleteFile(fileUrl, bucketName = this.bucketName) {
        const key = fileUrl.split(".amazonaws.com/")[1];
        if (!key) {
            throw new Error("Invalid file URL, could not extract key");
        }
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });
        await this.client.send(command);
    }
}
exports.S3Service = S3Service;
