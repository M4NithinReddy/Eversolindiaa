// ── Admin API Service ───────────────────────────────────────────────────────
// Centralised API calls for Module and Brand CRUD operations.

const MODULE_BASE = 'https://401i8cjuoj.execute-api.ap-south-1.amazonaws.com/prod/modules';
const MODULE_SINGLE = 'https://6rdwi5p3pd.execute-api.ap-south-1.amazonaws.com/dev/module';
const BRAND_BASE = 'https://umehtqxexd.execute-api.ap-south-1.amazonaws.com/dev/brandname';
const BRAND_BY_MODULE = 'https://zkw7qsaxz3.execute-api.ap-south-1.amazonaws.com/dev/brands-by-module';

// ── Helpers ────────────────────────────────────────────────────────────────

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

// The Module GET endpoint wraps its payload in a stringified `body` field.
// e.g. { statusCode: 200, body: '{"message":"...","data":[...]}' }
function unwrapModuleResponse<T>(raw: { statusCode?: number; body?: string; message?: string; data?: T }): T {
  if (raw.body && typeof raw.body === 'string') {
    const parsed = JSON.parse(raw.body);
    return parsed.data as T;
  }
  if (raw.data !== undefined) return raw.data;
  throw new Error('Unexpected module response shape');
}

// ── Module API ─────────────────────────────────────────────────────────────

export interface ApiModule {
  id: string;
  name: string;
  createdAt: string;
}

export async function fetchModules(): Promise<ApiModule[]> {
  const raw = await request<any>(MODULE_BASE);
  return unwrapModuleResponse<ApiModule[]>(raw);
}

export async function createModule(name: string): Promise<ApiModule> {
  const raw = await request<any>(MODULE_BASE, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  // POST may return the created item directly or wrapped
  return unwrapModuleResponse<ApiModule>(raw);
}

export async function updateModule(id: string, name: string): Promise<ApiModule> {
  const raw = await request<any>(`${MODULE_SINGLE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  });
  return unwrapModuleResponse<ApiModule>(raw);
}

export async function deleteModuleApi(id: string): Promise<void> {
  await request<any>(`${MODULE_SINGLE}/${id}`, { method: 'DELETE' });
}

// ── Brand API ──────────────────────────────────────────────────────────────

export interface ApiBrand {
  id: string;
  name: string;
  moduleId: string;
  createdAt: string;
}

export async function fetchBrands(): Promise<ApiBrand[]> {
  const raw = await request<{ message: string; data: ApiBrand[] }>(BRAND_BASE);
  return raw.data;
}

export async function fetchBrandsByModule(moduleId: string): Promise<ApiBrand[]> {
  const raw = await request<{ message: string; data: ApiBrand[] }>(
    `${BRAND_BY_MODULE}/${moduleId}`,
  );
  return raw.data ?? [];
}

export async function createBrand(name: string, moduleId: string): Promise<ApiBrand> {
  const raw = await request<{ message: string; data: ApiBrand }>(BRAND_BASE, {
    method: 'POST',
    body: JSON.stringify({ name, moduleId }),
  });
  return raw.data;
}

export async function updateBrand(id: string, name: string): Promise<ApiBrand> {
  const raw = await request<{ message: string; data: ApiBrand }>(`${BRAND_BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  });
  return raw.data;
}

export async function deleteBrandApi(id: string): Promise<void> {
  await request<any>(`${BRAND_BASE}/${id}`, { method: 'DELETE' });
}
