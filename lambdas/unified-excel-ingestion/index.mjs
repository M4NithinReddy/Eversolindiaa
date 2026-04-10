import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Table Names (Configurable via Environment Variables)
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || "ProductsTable";
const MODULES_TABLE  = process.env.MODULES_TABLE  || "ModulesTable";
const BRANDS_TABLE   = process.env.BRANDS_TABLE   || "BrandsTable";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Internal cache for name-to-id lookups during a single execution
const moduleCache = new Map(); // name -> id
const brandCache  = new Map(); // moduleId:name -> id

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "OK" };

  try {
    const body = JSON.parse(event.body || "{}");
    const incomingProducts = Array.isArray(body.products) ? body.products : (body.title ? [body] : []);

    if (incomingProducts.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "No products provided" }) };
    }

    const processedProducts = [];
    
    for (const p of incomingProducts) {
      let moduleId = p.moduleId;
      let brandId = p.brandId;

      // 1. Resolve Module
      const rawModuleName = p.rawModuleName || p.moduleName || p.category;
      if (!moduleId && rawModuleName) {
        const normalizedModName = rawModuleName.trim();
        if (moduleCache.has(normalizedModName)) {
          moduleId = moduleCache.get(normalizedModName);
        } else {
          // Check DB
          const scan = await docClient.send(new ScanCommand({
            TableName: MODULES_TABLE,
            FilterExpression: "attribute_exists(#n) AND #n = :name",
            ExpressionAttributeNames: { "#n": "name" },
            ExpressionAttributeValues: { ":name": normalizedModName }
          }));
          
          if (scan.Items && scan.Items.length > 0) {
            moduleId = scan.Items[0].id;
          } else {
            // Create new
            moduleId = randomUUID();
            await docClient.send(new PutCommand({
              TableName: MODULES_TABLE,
              Item: { id: moduleId, name: normalizedModName, createdAt: new Date().toISOString() }
            }));
          }
          moduleCache.set(normalizedModName, moduleId);
        }
      }

      // 2. Resolve Brand
      const rawBrandName = p.rawBrandName || p.brandName || p.brand;
      if (!brandId && rawBrandName && moduleId) {
        const normalizedBrandName = rawBrandName.trim();
        const cacheKey = `${moduleId}:${normalizedBrandName}`;
        
        if (brandCache.has(cacheKey)) {
          brandId = brandCache.get(cacheKey);
        } else {
          // Check DB
          const scan = await docClient.send(new ScanCommand({
            TableName: BRANDS_TABLE,
            FilterExpression: "moduleId = :mid AND #n = :name",
            ExpressionAttributeNames: { "#n": "name" },
            ExpressionAttributeValues: { ":mid": moduleId, ":name": normalizedBrandName }
          }));
          
          if (scan.Items && scan.Items.length > 0) {
            brandId = scan.Items[0].id;
          } else {
            // Create new
            brandId = randomUUID();
            await docClient.send(new PutCommand({
              TableName: BRANDS_TABLE,
              Item: { id: brandId, name: normalizedBrandName, moduleId, createdAt: new Date().toISOString() }
            }));
          }
          brandCache.set(cacheKey, brandId);
        }
      }

      // 3. Map Product Item
      const item = {
        id: randomUUID(),
        title: p.title || "Untitled Product",
        description: p.description || "",
        images: p.images || [],
        moduleId: moduleId || "unknown",
        brandId: brandId || "unknown",
        subBrandId: p.subBrandId || null,
        specifications: p.specifications || [],
        benefits: p.benefits || [],
        applications: p.applications || [],
        price: parseFloat(p.price) || 0,
        capacity: p.capacity || p.systemSize || "",
        phase: p.phase || null,
        warranty: p.warranty || "",
        productType: p.productType || null,
        datasheet: p.datasheet || "",
        isOutOfStock: !!p.isOutOfStock,
        createdAt: new Date().toISOString(),
      };

      processedProducts.push(item);
    }

    // 4. Batch Write Products
    const MAX_BATCH = 25;
    for (let i = 0; i < processedProducts.length; i += MAX_BATCH) {
      const chunk = processedProducts.slice(i, i + MAX_BATCH);
      const putRequests = chunk.map(item => ({ PutRequest: { Item: item } }));
      await docClient.send(new BatchWriteCommand({
        RequestItems: { [PRODUCTS_TABLE]: putRequests }
      }));
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: "Ingestion successful",
        created: processedProducts.length,
        products: processedProducts
      })
    };

  } catch (error) {
    console.error("Ingestion Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal server error", error: error.message })
    };
  }
};
