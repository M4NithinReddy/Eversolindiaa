const MOD_PROD_BASE   = 'https://401i8cjuoj.execute-api.ap-south-1.amazonaws.com/prod';
const MOD_DEV_BASE    = 'https://6rdwi5p3pd.execute-api.ap-south-1.amazonaws.com/dev';
const BRAND_BASE      = 'https://umehtqxexd.execute-api.ap-south-1.amazonaws.com/dev/brandname';
const BRANDMOD_BASE   = 'https://zkw7qsaxz3.execute-api.ap-south-1.amazonaws.com/dev/brands-by-module';
const IMG_BASE        = 'https://yf5ifvprf2.execute-api.ap-south-1.amazonaws.com/dev/upload-image';
const GET_PRODS_BASE  = 'https://jj43j7i7m6.execute-api.ap-south-1.amazonaws.com/prod/getall';
const POST_PRODS_BASE = 'https://llbjgne219.execute-api.ap-south-1.amazonaws.com/dev/products';
const EDIT_PRODS_BASE = 'https://b5flw79dm3.execute-api.ap-south-1.amazonaws.com/prod/products';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface ApiModule {
  id: string;
  name: string;
  createdAt: string;
}

export interface ApiBrand {
  id: string;
  name: string;
  moduleId: string;
  createdAt: string;
}

// Helper: unwrap AWS double-encoded body  { statusCode, body: "<json>" }
async function parseResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    const msg = json?.message || json?.body || `HTTP ${res.status}`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  if (typeof json?.body === 'string') {
    const inner = JSON.parse(json.body);
    return (inner?.data ?? inner) as T;
  }
  return (json?.data ?? json) as T;
}

// ── MODULE APIs ────────────────────────────────────────────────────────────────
export async function getModules(): Promise<ApiModule[]> {
  const res = await fetch(`${MOD_PROD_BASE}/modules`);
  return parseResponse<ApiModule[]>(res);
}

export async function createModuleApi(name: string): Promise<ApiModule> {
  const res = await fetch(`${MOD_PROD_BASE}/modules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return parseResponse<ApiModule>(res);
}

export async function updateModuleApi(id: string, name: string): Promise<ApiModule> {
  const res = await fetch(`${MOD_DEV_BASE}/module/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return parseResponse<ApiModule>(res);
}

export async function deleteModuleApi(id: string): Promise<void> {
  const res = await fetch(`${MOD_DEV_BASE}/module/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message || `HTTP ${res.status}`);
  }
}

// ── BRAND APIs ─────────────────────────────────────────────────────────────────
export async function getBrands(): Promise<ApiBrand[]> {
  const res = await fetch(`${BRAND_BASE}`);
  return parseResponse<ApiBrand[]>(res);
}

export async function getBrandsByModule(moduleId: string): Promise<ApiBrand[]> {
  const res = await fetch(`${BRANDMOD_BASE}/${moduleId}`);
  return parseResponse<ApiBrand[]>(res);
}

export async function createBrandApi(name: string, moduleId: string): Promise<ApiBrand> {
  const res = await fetch(`${BRAND_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, moduleId }),
  });
  return parseResponse<ApiBrand>(res);
}

export async function updateBrandApi(id: string, name: string): Promise<ApiBrand> {
  const res = await fetch(`${BRAND_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return parseResponse<ApiBrand>(res);
}

export async function deleteBrandApi(id: string): Promise<void> {
  const res = await fetch(`${BRAND_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message || `HTTP ${res.status}`);
  }
}

// ── IMAGE UPLOAD API ────────────────────────────────────────────────────────────
// Uploads a single image (File) and returns a public URL
export async function uploadImageApi(file: File): Promise<string> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const res = await fetch(`${IMG_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  // Unwrap: { statusCode, body: '{"url":"..."}' } or { url: "..." }
  if (typeof json?.body === 'string') {
    const inner = JSON.parse(json.body);
    return inner?.url ?? inner?.imageUrl ?? inner;
  }
  return json?.url ?? json?.imageUrl ?? json;
}

// ── PRODUCT APIs ────────────────────────────────────────────────────────────────
export interface ApiProduct {
  id: string; title: string; description: string; images: string[];
  moduleId: string; brandId: string; subBrandId?: string;
  productType?: string;
  specifications: { key: string; value: string }[];
  benefits: string[]; applications: string[];
  price: number; capacity: string; phase?: string; warranty: string; datasheet: string;
  createdAt: string;
}

export async function getProducts(): Promise<ApiProduct[]> {
  const url = `${GET_PRODS_BASE}?all=true`;
  console.log("Fetching:", url);
  const res = await fetch(url);
  return parseResponse<ApiProduct[]>(res);
}

export async function getProductById(id: string): Promise<ApiProduct> {
  const url = `${GET_PRODS_BASE}?all=true`;
  const res = await fetch(url);
  const products = await parseResponse<ApiProduct[]>(res);
  const product = products.find(p => String(p.id) === String(id));
  if (!product) throw new Error("Product not found");
  return product;
}

export async function createProductApi(product: Omit<ApiProduct, 'id' | 'createdAt'>): Promise<ApiProduct> {
  const res = await fetch(`${POST_PRODS_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return parseResponse<ApiProduct>(res);
}

export async function updateProductApi(id: string, product: Omit<ApiProduct, 'id' | 'createdAt'>): Promise<ApiProduct> {
  const res = await fetch(`${EDIT_PRODS_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return parseResponse<ApiProduct>(res);
}

export async function deleteProductApi(id: string): Promise<void> {
  const res = await fetch(`${EDIT_PRODS_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message || `HTTP ${res.status}`);
  }
}

export async function deleteAllProductsApi(): Promise<void> {
  // Use the bulk create endpoint but with DELETE? 
  // User didn't specify a DELETE ALL URL for the new endpoints.
  // I'll stick to the DELETE base but no ID.
  const res = await fetch(`${EDIT_PRODS_BASE}`, { method: 'DELETE' });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message || `HTTP ${res.status}`);
  }
}

export async function bulkCreateProductsApi(products: Omit<ApiProduct, 'id' | 'createdAt'>[]): Promise<{ created: number; data: ApiProduct[] }> {
  const res = await fetch(`${POST_PRODS_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ products }),
  });
  return parseResponse<{ created: number; data: ApiProduct[] }>(res);
}
