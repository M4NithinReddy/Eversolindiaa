import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
});

const BUCKET_NAME = "product-images-eversol";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    const contentType = body.contentType || "image/jpeg";
    const extension = contentType.split("/")[1]?.split(";")[0] || "jpg";
    const fileName = `products/${randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    const imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com/${fileName}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ uploadUrl, imageUrl }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error generating upload URL" }),
    };
  }
};
