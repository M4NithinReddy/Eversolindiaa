import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import {
  getModules, createModuleApi, updateModuleApi, deleteModuleApi,
  getBrands, createBrandApi, updateBrandApi, deleteBrandApi,
  getProducts, createProductApi, updateProductApi, deleteProductApi, bulkCreateProductsApi, deleteAllProductsApi,
  unifiedExcelPostApi
} from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface AdminModule { id: string; name: string; createdAt: string; }
export interface AdminBrand { id: string; name: string; moduleId: string; createdAt: string; }
export interface AdminSubBrand { id: string; name: string; brandId: string; createdAt: string; }
export interface ProductSpecification { key: string; value: string; }
export interface AdminProduct {
  id: string; title: string; description: string; images: string[];
  moduleId: string; brandId: string; subBrandId?: string;
  productType?: string;
  specifications: ProductSpecification[]; benefits: string[];
  applications: string[]; price: number; capacity: string; phase?: string;
  warranty: string; datasheet: string; isOutOfStock?: boolean; gstPercent?: number; createdAt: string;
  // New flat schema fields (from updated DynamoDB table)
  brandName?: string;
  category?: string;
  battery_type?: string; capacity_kwh_ah?: string; battery_nominal_voltage_v?: string;
  operating_voltage?: string; cycle_life?: string; cooling?: string; compatible_inverters?: string;
  model?: string;
  model_number?: string; wattage_w?: string; cell_type?: string; module_efficiency?: string;
  no_of_cells?: string; available_stock?: string; mono_bifacial?: string;
  system_size_kw?: string; included_module_brand?: string; included_inverter_brand?: string;
  structure_type?: string; area_required_sqft?: string; subsidy_eligible?: string;
  installation_included?: string; meters?: string; total_price?: string;
  model_name?: string; product_type?: string; features?: string[];
  extraFields?: Record<string, string>;
}
export interface AdminData {
  modules: AdminModule[]; brands: AdminBrand[];
  subBrands: AdminSubBrand[]; products: AdminProduct[];
  catalogStats: {
    modules: number;
    brands: number;
    products: number;
  };
}

interface AdminContextType {
  data: AdminData;
  modulesLoading: boolean; modulesError: string | null; modulesBusy: boolean;
  brandsLoading: boolean; brandsError: string | null; brandsBusy: boolean;
  productsLoading: boolean; productsError: string | null; productsBusy: boolean;
  addModule: (name: string) => Promise<AdminModule>;
  updateModule: (id: string, name: string) => Promise<void>;
  deleteModule: (id: string) => Promise<void>;
  addBrand: (name: string, moduleId: string) => Promise<AdminBrand>;
  updateBrand: (id: string, name: string) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  addSubBrand: (name: string, brandId: string) => void;
  updateSubBrand: (id: string, name: string) => void;
  deleteSubBrand: (id: string) => void;
  addProduct: (product: Omit<AdminProduct, 'id' | 'createdAt'>) => Promise<void>;
  bulkAddProducts: (products: Omit<AdminProduct, 'id' | 'createdAt'>[]) => Promise<void>;
  unifiedBulkAddProducts: (products: any[]) => Promise<void>;
  updateProduct: (id: string, product: Omit<AdminProduct, 'id' | 'createdAt'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteAllProducts: () => Promise<void>;
}

const LOCAL_KEY = 'eversol_local_v4'; // subbrand only now
function loadLocal(): { subBrands: AdminSubBrand[] } {
  try { const r = localStorage.getItem(LOCAL_KEY); if (r) return JSON.parse(r); } catch { /* */ }
  return { subBrands: [] };
}
function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 9); }
function isCorsOrNetwork(e: unknown) { return e instanceof TypeError; }

/**
 * Normalize a raw API product to always have safe array defaults.
 * Bridges old schema (images[], specifications[]) and new flat schema.
 * IMPORTANT: moduleId/brandId/isOutOfStock may be stored inside extraFields.
 */
function normalizeProduct(raw: any): AdminProduct {
  // Pull moduleId/brandId/isOutOfStock from extraFields if not at top level
  const moduleId = raw.moduleId || raw.extraFields?.moduleId || '';
  const brandId = raw.brandId || raw.extraFields?.brandId || '';
  const isOutOfStock = raw.isOutOfStock !== undefined
    ? Boolean(raw.isOutOfStock)
    : (raw.extraFields?.isOutOfStock === 'true' || raw.extraFields?.isOutOfStock === true);

  return {
    ...raw,
    id: raw.id ?? '',
    title: raw.title ?? 'Untitled',
    description: raw.description ?? '',
    images: Array.isArray(raw.images) ? raw.images : [],
    moduleId,
    brandId,
    specifications: Array.isArray(raw.specifications) ? raw.specifications : [],
    benefits: Array.isArray(raw.benefits) ? raw.benefits :
      (typeof raw.benefits === 'string' && raw.benefits.trim() ? [raw.benefits] : []),
    applications: Array.isArray(raw.applications) ? raw.applications : [],
    price: typeof raw.price === 'number' ? raw.price : (parseFloat(String(raw.price ?? '0')) || 0),
    capacity: (raw.capacity ?? '').replace(/\s*KW$/i, '').trim(),
    warranty: raw.warranty ?? '',
    datasheet: raw.datasheet ?? '',
    isOutOfStock,
    gstPercent: typeof raw.gstPercent === 'number' ? raw.gstPercent : (parseFloat(String(raw.gstPercent ?? '')) || 0),
    createdAt: raw.createdAt ?? new Date().toISOString(),
  } as AdminProduct;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const local = loadLocal();
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [subBrands, setSubBrands] = useState<AdminSubBrand[]>(local.subBrands);
  const [products, setProducts] = useState<AdminProduct[]>([]);

  const [modulesLoading, setModulesLoading] = useState(true);
  const [modulesError, setModulesError] = useState<string | null>(null);
  const [modulesBusy, setModulesBusy] = useState(false);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState<string | null>(null);
  const [brandsBusy, setBrandsBusy] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [productsBusy, setProductsBusy] = useState(false);

  useEffect(() => { localStorage.setItem(LOCAL_KEY, JSON.stringify({ subBrands })); }, [subBrands]);

  const refreshModules = useCallback(async () => {
    try {
      const rawModules = await getModules();
      setModules(rawModules.map(m => {
        const name = m.name.toLowerCase();
        if (name === 'solar modules') return { ...m, name: 'Solar Modules ( Panels )' };
        if (name === 'solar on grid') return { ...m, name: 'Solar On Grid Inverter' };
        if (name === 'solar hybrid') return { ...m, name: 'Solar Hybrid Inverter' };
        if (name === 'solar roof top on grid kit' || name === 'solar rooftop on grid kit') return { ...m, name: 'Solar Roof Top On Grid Kit' };
        if (name === 'solar roof top hybrid kit' || name === 'solar rooftop hybrid kit') return { ...m, name: 'Solar Roof Top Hybrid Kit' };
        if (name.includes('battery energy storage system') || name === 'bess') return { ...m, name: 'Battery Energy Storage System ( BESS )' };
        return m;
      }));
    } catch { /* */ }
  }, []);
  const refreshBrands = useCallback(async () => { try { setBrands(await getBrands()); } catch { /* */ } }, []);
  const refreshProducts = useCallback(async () => { try { setProducts((await getProducts()).map(normalizeProduct)); } catch { /* */ } }, []);

  // Fetch on mount
  useEffect(() => {
    setModulesLoading(true);
    getModules().then(raw => {
      setModules(raw.map(m => {
        const name = m.name.toLowerCase();
        if (name === 'solar modules') return { ...m, name: 'Solar Modules ( Panels )' };
        if (name === 'solar on grid') return { ...m, name: 'Solar On Grid Inverter' };
        if (name === 'solar hybrid') return { ...m, name: 'Solar Hybrid Inverter' };
        if (name === 'solar roof top on grid kit' || name === 'solar rooftop on grid kit') return { ...m, name: 'Solar Roof Top On Grid Kit' };
        if (name === 'solar roof top hybrid kit' || name === 'solar rooftop hybrid kit') return { ...m, name: 'Solar Roof Top Hybrid Kit' };
        if (name.includes('battery energy storage system') || name === 'bess') return { ...m, name: 'Battery Energy Storage System ( BESS )' };
        return m;
      }));
    }).catch(e => setModulesError(e.message)).finally(() => setModulesLoading(false));
  }, []);
  useEffect(() => {
    setBrandsLoading(true);
    getBrands().then(setBrands).catch(e => setBrandsError(e.message)).finally(() => setBrandsLoading(false));
  }, []);
  useEffect(() => {
    setProductsLoading(true);
    getProducts().then(ps => setProducts(ps.map(normalizeProduct))).catch(e => setProductsError(e.message)).finally(() => setProductsLoading(false));
  }, []);

  // ── Module CRUD ────────────────────────────────────────────────────────────
  const addModule = useCallback(async (name: string) => {
    setModulesBusy(true);
    try {
      const created = await createModuleApi(name);
      setModules(p => [...p, created]);
      return created;
    } catch (e) {
      if (isCorsOrNetwork(e)) { await refreshModules(); throw e; } else throw e;
    } finally {
      setModulesBusy(false);
    }
  }, [refreshModules]);

  const updateModule = useCallback(async (id: string, name: string) => {
    setModulesBusy(true);
    setModules(p => p.map(m => m.id === id ? { ...m, name } : m));
    try { const u = await updateModuleApi(id, name); setModules(p => p.map(m => m.id === id ? u : m)); }
    catch (e) { await refreshModules(); if (!isCorsOrNetwork(e)) throw e; }
    finally { setModulesBusy(false); }
  }, [refreshModules]);

  const deleteModule = useCallback(async (id: string) => {
    setModulesBusy(true);
    const bIds = brands.filter(b => b.moduleId === id).map(b => b.id);
    setModules(p => p.filter(m => m.id !== id));
    setBrands(p => p.filter(b => b.moduleId !== id));
    setSubBrands(p => p.filter(sb => !bIds.includes(sb.brandId)));
    setProducts(p => p.filter(pr => pr.moduleId !== id));
    try { await deleteModuleApi(id); }
    catch (e) { await refreshModules(); if (!isCorsOrNetwork(e)) throw e; }
    finally { setModulesBusy(false); }
  }, [brands, refreshModules]);

  // ── Brand CRUD ─────────────────────────────────────────────────────────────
  const addBrand = useCallback(async (name: string, moduleId: string) => {
    setBrandsBusy(true);
    try {
      const created = await createBrandApi(name, moduleId);
      setBrands(p => [...p, created]);
      return created;
    } catch (e) {
      if (isCorsOrNetwork(e)) { await refreshBrands(); throw e; } else throw e;
    } finally {
      setBrandsBusy(false);
    }
  }, [refreshBrands]);

  const updateBrand = useCallback(async (id: string, name: string) => {
    setBrandsBusy(true);
    setBrands(p => p.map(b => b.id === id ? { ...b, name } : b));
    try { const u = await updateBrandApi(id, name); setBrands(p => p.map(b => b.id === id ? u : b)); }
    catch (e) { await refreshBrands(); if (!isCorsOrNetwork(e)) throw e; }
    finally { setBrandsBusy(false); }
  }, [refreshBrands]);

  const deleteBrand = useCallback(async (id: string) => {
    setBrandsBusy(true);
    setBrands(p => p.filter(b => b.id !== id));
    setSubBrands(p => p.filter(sb => sb.brandId !== id));
    setProducts(p => p.filter(pr => pr.brandId !== id));
    try { await deleteBrandApi(id); }
    catch (e) { await refreshBrands(); if (!isCorsOrNetwork(e)) throw e; }
    finally { setBrandsBusy(false); }
  }, [refreshBrands]);

  // ── Sub-brand CRUD (localStorage) ──────────────────────────────────────────
  const addSubBrand = useCallback((name: string, brandId: string) => {
    setSubBrands(p => [...p, { id: generateId(), name, brandId, createdAt: new Date().toISOString() }]);
  }, []);
  const updateSubBrand = useCallback((id: string, name: string) => {
    setSubBrands(p => p.map(sb => sb.id === id ? { ...sb, name } : sb));
  }, []);
  const deleteSubBrand = useCallback((id: string) => {
    setSubBrands(p => p.filter(sb => sb.id !== id));
  }, []);

  // ── Product CRUD (API) ─────────────────────────────────────────────────────
  const addProduct = useCallback(async (product: Omit<AdminProduct, 'id' | 'createdAt'>) => {
    setProductsBusy(true);
    try {
      const created = await createProductApi(product);
      setProducts(p => [...p, normalizeProduct(created)]);
    } catch (e) {
      if (isCorsOrNetwork(e)) await refreshProducts(); else throw e;
    } finally {
      setProductsBusy(false);
    }
  }, [refreshProducts]);

  const bulkAddProducts = useCallback(async (newProducts: Omit<AdminProduct, 'id' | 'createdAt'>[]) => {
    setProductsBusy(true);
    try {
      const BATCH_SIZE = 25;
      const allCreated: AdminProduct[] = [];

      for (let i = 0; i < newProducts.length; i += BATCH_SIZE) {
        const chunk = newProducts.slice(i, i + BATCH_SIZE);
        const response = await bulkCreateProductsApi(chunk);
        if (response && response.data) {
          allCreated.push(...response.data.map(normalizeProduct));
        }
      }

      if (allCreated.length > 0) {
        setProducts(p => [...p, ...allCreated]);
      } else {
        await refreshProducts();
      }
    } catch (e) {
      if (isCorsOrNetwork(e)) await refreshProducts(); else throw e;
    } finally {
      setProductsBusy(false);
    }
  }, [refreshProducts]);

  const unifiedBulkAddProducts = useCallback(async (newProducts: any[]) => {
    setProductsBusy(true);
    try {
      const response = await unifiedExcelPostApi(newProducts);
      if (response && response.data) {
        setProducts(p => [...p, ...response.data]);
        // Also refresh modules and brands since they might have been created
        await Promise.all([refreshModules(), refreshBrands()]);
      }
    } catch (e) {
      if (isCorsOrNetwork(e)) await refreshProducts(); else throw e;
    } finally {
      setProductsBusy(false);
    }
  }, [refreshModules, refreshBrands, refreshProducts]);

  const updateProduct = useCallback(async (id: string, product: Omit<AdminProduct, 'id' | 'createdAt'>) => {
    setProductsBusy(true);
    setProducts(p => p.map(pr => pr.id === id ? { ...pr, ...product } : pr));
    try { const u = await updateProductApi(id, product); setProducts(p => p.map(pr => pr.id === id ? u : pr)); }
    catch (e) { await refreshProducts(); if (!isCorsOrNetwork(e)) throw e; }
    finally { setProductsBusy(false); }
  }, [refreshProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    setProductsBusy(true);
    setProducts(p => p.filter(pr => pr.id !== id));
    try { await deleteProductApi(id); }
    catch (e) { await refreshProducts(); if (!isCorsOrNetwork(e)) throw e; }
    finally { setProductsBusy(false); }
  }, [refreshProducts]);

  const deleteAllProducts = useCallback(async () => {
    setProductsBusy(true);
    setProducts([]);
    try { await deleteAllProductsApi(); }
    catch (e) { await refreshProducts(); if (!isCorsOrNetwork(e)) throw e; }
    finally { setProductsBusy(false); }
  }, [refreshProducts]);

  // APAR, ORIENT, POLYCAB are virtual/frontend-only brands for the "Solar DC Cables"
  // category that don't exist in the database. We inject them into the brands list
  // so they appear in the Admin Dashboard and Brand Manager.
  const enrichedBrands = useMemo(() => {
    const dcCableModule = modules.find(m => m.name === 'Solar DC Cables');
    if (!dcCableModule) return brands;

    const virtualBrands: AdminBrand[] = [
      { id: 'mock-apar', name: 'APAR', moduleId: dcCableModule.id, createdAt: new Date().toISOString() },
      { id: 'mock-orient', name: 'ORIENT', moduleId: dcCableModule.id, createdAt: new Date().toISOString() },
      { id: 'mock-polycab', name: 'POLYCAB', moduleId: dcCableModule.id, createdAt: new Date().toISOString() },
    ];

    const existingNames = new Set(brands.filter(b => b.moduleId === dcCableModule.id).map(b => b.name.toUpperCase().trim()));
    const toAdd = virtualBrands.filter(vb => !existingNames.has(vb.name.toUpperCase()));

    return [...brands, ...toAdd];
  }, [modules, brands]);

  const filteredProducts = useMemo(() => {
    const validModIds = new Set(modules.map(m => m.id));
    const validBrandsMap = new Map(enrichedBrands.map(b => [b.id, b.moduleId]));

    return products.filter(p => {
      // 1. Must have a valid module ID
      if (!p.moduleId || !validModIds.has(p.moduleId)) return false;

      // 2. Must have a valid brand ID that belongs to that module
      const brandModuleId = validBrandsMap.get(p.brandId);
      if (!brandModuleId || brandModuleId !== p.moduleId) return false;

      return true;
    });
  }, [modules, enrichedBrands, products]);

  const catalogStats = useMemo(() => ({
    modules: modules.length,
    brands: enrichedBrands.filter(b => modules.some(m => m.id === b.moduleId)).length,
    products: filteredProducts.length,
  }), [modules, enrichedBrands, filteredProducts]);

  const data: AdminData = { modules, brands: enrichedBrands, subBrands, products: filteredProducts, catalogStats };

  return (
    <AdminContext.Provider value={{
      data,
      modulesLoading, modulesError, modulesBusy,
      brandsLoading, brandsError, brandsBusy,
      productsLoading, productsError, productsBusy,
      addModule, updateModule, deleteModule,
      addBrand, updateBrand, deleteBrand,
      addSubBrand, updateSubBrand, deleteSubBrand,
      addProduct, updateProduct, deleteProduct, bulkAddProducts, unifiedBulkAddProducts, deleteAllProducts
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
