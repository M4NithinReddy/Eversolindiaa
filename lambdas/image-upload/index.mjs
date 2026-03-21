import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

// Initialize S3 Client
const s3Client = new S3Client({});

const BUCKET_NAME = "product-images-eversol";

// CORS Headers
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler = async (event) => {
  // Handle CORS Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    // The image will likely come in as base64 in the body, or multi-part form.
    // For API Gateway, the most common setup is body returning a base64 string.
    let base64ImageString = "";
    let contentType = "image/jpeg";
    
    // Check if event.isBase64Encoded is true or if body needs parsing
    if (event.isBase64Encoded) {
       base64ImageString = event.body;
       // Attempt to get content type from headers
       contentType = event.headers["Content-Type"] || event.headers["content-type"] || "image/jpeg";
    } else {
       // If JSON is sent with a 'file' or 'image' property
       const body = JSON.parse(event.body || "{}");
       if (body.image) {
         // Data URI format: data:image/jpeg;base64,...
         const match = body.image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
         if (match) {
           contentType = match[1];
           base64ImageString = match[2];
         } else {
           base64ImageString = body.image;
         }
       }
    }

    if (!base64ImageString) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "No image found in request." }),
      };
    }

    // Convert base64 string to buffer
    const buffer = Buffer.from(base64ImageString, "base64");
    
    // Create a unique file name
    const extension = contentType.split("/")[1] || "jpeg";
    const fileName = `products/${randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // Construct the public URL for the uploaded image.
    // Ensure the bucket is public or reachable.
    const region = process.env.AWS_REGION || "ap-south-1";
    const imageUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Image uploaded successfully",
        url: imageUrl,
      }),
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal server error", error: error.message }),
    };
  }
};
