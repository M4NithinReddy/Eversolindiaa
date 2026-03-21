import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

// Initialize DynamoDB Client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || "ProductsTable";

// CORS Headers
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler = async (event) => {
  console.log("Event:", JSON.stringify(event));

  // Handle CORS Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    // BULK UPLOAD PATH
    if (body.products && Array.isArray(body.products)) {
      if (body.products.length === 0) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: "Empty product array" }) };
      }

      const createdItems = [];
      const MAX_BATCH_SIZE = 25; // DynamoDB batch limit
      const chunks = [];
      for (let i = 0; i < body.products.length; i += MAX_BATCH_SIZE) {
        chunks.push(body.products.slice(i, i + MAX_BATCH_SIZE));
      }

      for (const chunk of chunks) {
        const putRequests = [];
        for (const p of chunk) {
          if (!p.title || !p.moduleId || !p.brandId) continue;

          const item = {
            id: randomUUID(),
            title: p.title,
            description: p.description || "",
            images: p.images || [],
            moduleId: p.moduleId,
            brandId: p.brandId,
            subBrandId: p.subBrandId || null,
            specifications: p.specifications || [],
            benefits: p.benefits || [],
            applications: p.applications || [],
            price: p.price || 0,
            capacity: p.capacity || "",
            warranty: p.warranty || "",
            datasheet: p.datasheet || "",
            createdAt: new Date().toISOString(),
          };
          createdItems.push(item);
          putRequests.push({ PutRequest: { Item: item } });
        }

        if (putRequests.length > 0) {
          const command = new BatchWriteCommand({
            RequestItems: {
              [TABLE_NAME]: putRequests,
            },
          });
          await docClient.send(command);
        }
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: `Products created successfully`,
          created: createdItems.length,
          data: createdItems,
        }),
      };
    }

    // SINGLE UPLOAD PATH
    const {
      title,
      description,
      images,
      moduleId,
      brandId,
      subBrandId,
      specifications,
      benefits,
      applications,
      price,
      capacity,
      warranty,
      datasheet,
    } = body;

    // Validate essential info
    if (!title || !moduleId || !brandId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Missing required product fields: title, moduleId, brandId" }),
      };
    }

    const productId = randomUUID();
    const createdAt = new Date().toISOString();

    const productItem = {
      id: productId,
      title,
      description: description || "",
      images: images || [],
      moduleId,
      brandId,
      subBrandId: subBrandId || null,
      specifications: specifications || [],
      benefits: benefits || [],
      applications: applications || [],
      price: price || 0,
      capacity: capacity || "",
      warranty: warranty || "",
      datasheet: datasheet || "",
      createdAt,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: productItem,
    });

    await docClient.send(command);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: "Product created successfully",
        data: productItem,
      }),
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal server error", error: error.message }),
    };
  }
};
