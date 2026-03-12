// ── API paths (proxied via Vite in dev, Vercel rewrites in production) ─────────
// Requests go to the same origin → no CORS preflight issues
const PROD_BASE     = '/api/prod';   // modules GET/POST
const DEV_BASE      = '/api/dev';    // modules PUT/DELETE
const BRAND_BASE    = '/api/brand';  // brands GET/POST/PUT/DELETE
const BRANDMOD_BASE = '/api/brandmod'; // brands-by-module GET

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

// Helper to unwrap the API's double-encoded body
async function parseResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    const msg = json?.message || json?.body || `HTTP ${res.status}`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  // The API wraps data in { statusCode, body: "<json string>" }
  if (typeof json?.body === 'string') {
    const inner = JSON.parse(json.body);
    return (inner?.data ?? inner) as T;
  }
  return (json?.data ?? json) as T;
}

// ── MODULE APIs ────────────────────────────────────────────────────────────────

export async function getModules(): Promise<ApiModule[]> {
  const res = await fetch(`${PROD_BASE}/modules`);
  return parseResponse<ApiModule[]>(res);
}

export async function createModuleApi(name: string): Promise<ApiModule> {
  const res = await fetch(`${PROD_BASE}/modules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return parseResponse<ApiModule>(res);
}

export async function updateModuleApi(id: string, name: string): Promise<ApiModule> {
  const res = await fetch(`${DEV_BASE}/module/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return parseResponse<ApiModule>(res);
}

export async function deleteModuleApi(id: string): Promise<void> {
  const res = await fetch(`${DEV_BASE}/module/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message || `HTTP ${res.status}`);
  }
}

// ── BRAND APIs ─────────────────────────────────────────────────────────────────

export async function getBrands(): Promise<ApiBrand[]> {
  const res = await fetch(`${BRAND_BASE}/brandname`);
  return parseResponse<ApiBrand[]>(res);
}

export async function getBrandsByModule(moduleId: string): Promise<ApiBrand[]> {
  const res = await fetch(`${BRANDMOD_BASE}/brands-by-module/${moduleId}`);
  return parseResponse<ApiBrand[]>(res);
}

export async function createBrandApi(name: string, moduleId: string): Promise<ApiBrand> {
  const res = await fetch(`${BRAND_BASE}/brandname`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, moduleId }),
  });
  return parseResponse<ApiBrand>(res);
}

export async function updateBrandApi(id: string, name: string): Promise<ApiBrand> {
  const res = await fetch(`${BRAND_BASE}/brandname/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return parseResponse<ApiBrand>(res);
}

export async function deleteBrandApi(id: string): Promise<void> {
  const res = await fetch(`${BRAND_BASE}/brandname/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message || `HTTP ${res.status}`);
  }
}
