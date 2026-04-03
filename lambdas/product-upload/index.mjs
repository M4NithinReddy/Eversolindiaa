import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, BatchWriteCommand, ScanCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

// Initialize DynamoDB Client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || "ProductsTable";

// CORS Headers
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE",
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
    const pathId = event.pathParameters?.id || event.path?.split("/").pop(); // Works for /prod/products/{id} or /products/{id}
    const isRoot = !pathId || pathId === "products" || pathId === "getall";

    // ── GET PRODUCTS (ALL or SINGLE) ──────────────────────────────────────────
    if (event.httpMethod === "GET") {
       if (isRoot) {
         const allItems = [];
         let lastKey = null;
         do {
           const scanParams = { TableName: TABLE_NAME };
           if (lastKey) scanParams.ExclusiveStartKey = lastKey;
           const scanRes = await docClient.send(new ScanCommand(scanParams));
           if (scanRes.Items) allItems.push(...scanRes.Items);
           lastKey = scanRes.LastEvaluatedKey;
         } while (lastKey);
         return { statusCode: 200, headers, body: JSON.stringify({ data: allItems }) };
       } else {
         const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: pathId } }));
         if (!res.Item) return { statusCode: 404, headers, body: JSON.stringify({ message: "Product not found" }) };
         return { statusCode: 200, headers, body: JSON.stringify({ data: res.Item }) };
       }
    }

    // ── DELETE PRODUCTS (ALL or SINGLE) ───────────────────────────────────────
     if (event.httpMethod === "DELETE") {
        if (isRoot) {
          let deleteCount = 0;
          let lastKey = null;
          do {
            const scanParams = { TableName: TABLE_NAME, ProjectionExpression: "id" };
            if (lastKey) scanParams.ExclusiveStartKey = lastKey;
            const scanRes = await docClient.send(new ScanCommand(scanParams));
            
            if (scanRes.Items && scanRes.Items.length > 0) {
              const MAX_BATCH = 25;
              for (let i = 0; i < scanRes.Items.length; i += MAX_BATCH) {
                const chunk = scanRes.Items.slice(i, i + MAX_BATCH);
                const deleteRequests = chunk.map(item => ({ DeleteRequest: { Key: { id: item.id } } }));
                await docClient.send(new BatchWriteCommand({ RequestItems: { [TABLE_NAME]: deleteRequests } }));
                deleteCount += chunk.length;
              }
            }
            lastKey = scanRes.LastEvaluatedKey;
          } while (lastKey);
          
          return { statusCode: 200, headers, body: JSON.stringify({ message: `Successfully deleted ${deleteCount} products` }) };
        } else {
         await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id: pathId } }));
         return { statusCode: 200, headers, body: JSON.stringify({ message: "Product deleted" }) };
       }
    }

    // ── UPDATE PRODUCT (PUT) ──────────────────────────────────────────────────
    if (event.httpMethod === "PUT" && pathId) {
       const item = { ...body, id: pathId, updatedAt: new Date().toISOString() };
       await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
       return { statusCode: 200, headers, body: JSON.stringify({ data: item }) };
    }

    // ── POST PRODUCTS (SINGLE or BULK) ────────────────────────────────────────
    if (event.httpMethod === "POST") {
      // BULK UPLOAD PATH
      if (body.products && Array.isArray(body.products)) {
        if (body.products.length === 0) return { statusCode: 400, headers, body: JSON.stringify({ message: "Empty product array" }) };

        const createdItems = [];
        const MAX_BATCH_SIZE = 25;
        
        for (let i = 0; i < body.products.length; i += MAX_BATCH_SIZE) {
          const chunk = body.products.slice(i, i + MAX_BATCH_SIZE);
          const putRequests = chunk.map(p => {
             const item = {
                id: randomUUID(),
                title: p.title || "Untitled",
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
                phase: p.phase || null,
                warranty: p.warranty || "",
                productType: p.productType || null,
                datasheet: p.datasheet || "",
                createdAt: new Date().toISOString(),
             };
             createdItems.push(item);
             return { PutRequest: { Item: item } };
          });
          
          await docClient.send(new BatchWriteCommand({ RequestItems: { [TABLE_NAME]: putRequests } }));
        }

        return { statusCode: 201, headers, body: JSON.stringify({ message: "Products created successfully", created: createdItems.length, data: createdItems }) };
      }

      // SINGLE UPLOAD PATH
      if (!body.title || !body.moduleId || !body.brandId) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: "Missing required product fields: title, moduleId, brandId" }) };
      }

      const productItem = {
        id: randomUUID(),
        title: body.title,
        description: body.description || "",
        images: body.images || [],
        moduleId: body.moduleId,
        brandId: body.brandId,
        subBrandId: body.subBrandId || null,
        specifications: body.specifications || [],
        benefits: body.benefits || [],
        applications: body.applications || [],
        price: body.price || 0,
        capacity: body.capacity || "",
        phase: body.phase || null,
        warranty: body.warranty || "",
        productType: body.productType || null,
        datasheet: body.datasheet || "",
        createdAt: new Date().toISOString(),
      };

      await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: productItem }));

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: "Product created successfully", data: productItem }),
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ message: `Method ${event.httpMethod} not allowed` }) };
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal server error", error: error.message }),
    };
  }
};
