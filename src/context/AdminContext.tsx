import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  getModules,
  createModuleApi,
  updateModuleApi,
  deleteModuleApi,
  getBrands,
  createBrandApi,
  updateBrandApi,
  deleteBrandApi,
} from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface AdminModule {
  id: string;
  name: string;
  createdAt: string;
}

export interface AdminBrand {
  id: string;
  name: string;
  moduleId: string;
  createdAt: string;
}

export interface AdminSubBrand {
  id: string;
  name: string;
  brandId: string;
  createdAt: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface AdminProduct {
  id: string;
  title: string;
  description: string;
  images: string[]; // base64 data URLs
  moduleId: string;
  brandId: string;
  subBrandId?: string;
  specifications: ProductSpecification[];
  benefits: string[];
  applications: string[];
  price: number;
  capacity: string;
  warranty: string;
  datasheet: string;
  createdAt: string;
}

export interface AdminData {
  modules: AdminModule[];
  brands: AdminBrand[];
  subBrands: AdminSubBrand[];
  products: AdminProduct[];
}

interface AdminContextType {
  data: AdminData;
  modulesLoading: boolean;
  modulesError: string | null;
  modulesBusy: boolean;
  brandsLoading: boolean;
  brandsError: string | null;
  brandsBusy: boolean;
  // Module CRUD
  addModule: (name: string) => Promise<void>;
  updateModule: (id: string, name: string) => Promise<void>;
  deleteModule: (id: string) => Promise<void>;
  // Brand CRUD
  addBrand: (name: string, moduleId: string) => Promise<void>;
  updateBrand: (id: string, name: string) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  // Sub-brand CRUD
  addSubBrand: (name: string, brandId: string) => void;
  updateSubBrand: (id: string, name: string) => void;
  deleteSubBrand: (id: string) => void;
  // Product CRUD
  addProduct: (product: Omit<AdminProduct, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Omit<AdminProduct, 'id' | 'createdAt'>) => void;
  deleteProduct: (id: string) => void;
}

const LOCAL_KEY = 'eversol_admin_data_v2';

function loadLocalData(): Pick<AdminData, 'subBrands' | 'products'> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        subBrands: parsed.subBrands ?? [],
        products:  parsed.products  ?? [],
      };
    }
  } catch { /* ignore */ }
  return { subBrands: [], products: [] };
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const local = loadLocalData();

  const [modules,        setModules]        = useState<AdminModule[]>([]);
  const [brands,         setBrands]         = useState<AdminBrand[]>([]);
  const [subBrands,      setSubBrands]      = useState<AdminSubBrand[]>(local.subBrands);
  const [products,       setProducts]       = useState<AdminProduct[]>(local.products);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [modulesError,   setModulesError]   = useState<string | null>(null);
  const [modulesBusy,    setModulesBusy]    = useState(false);
  const [brandsLoading,  setBrandsLoading]  = useState(true);
  const [brandsError,    setBrandsError]    = useState<string | null>(null);
  const [brandsBusy,     setBrandsBusy]     = useState(false);

  // Persist subBrands / products to localStorage (brands now in API)
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ subBrands, products }));
  }, [subBrands, products]);

  // ── Helper: re-fetch modules from GET (used after CORS-blocked mutations) ───
  const refreshModules = useCallback(async () => {
    try {
      const apiModules = await getModules();
      setModules(apiModules);
    } catch { /* silently ignore */ }
  }, []);

  // ── Helper: re-fetch brands from GET ──────────────────────────────────────
  const refreshBrands = useCallback(async () => {
    try {
      const apiBrands = await getBrands();
      setBrands(apiBrands);
    } catch { /* silently ignore */ }
  }, []);

  // ── Helper: detect CORS / network failure (server succeeded but browser blocked)
  function isCorsOrNetworkError(err: unknown): boolean {
    return err instanceof TypeError;
  }

  // ── Fetch modules from API on mount ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setModulesLoading(true);
    setModulesError(null);
    getModules()
      .then(apiModules => {
        if (!cancelled) setModules(apiModules);
      })
      .catch(err => {
        if (!cancelled) setModulesError(err.message ?? 'Failed to load modules');
      })
      .finally(() => {
        if (!cancelled) setModulesLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // ── Fetch brands from API on mount ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setBrandsLoading(true);
    setBrandsError(null);
    getBrands()
      .then(apiBrands => {
        if (!cancelled) setBrands(apiBrands);
      })
      .catch(err => {
        if (!cancelled) setBrandsError(err.message ?? 'Failed to load brands');
      })
      .finally(() => {
        if (!cancelled) setBrandsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // ── Module CRUD (API-backed) ────────────────────────────────────────────────
  const addModule = useCallback(async (name: string) => {
    setModulesBusy(true);
    try {
      const created = await createModuleApi(name);
      setModules(prev => [...prev, created]);
    } finally {
      setModulesBusy(false);
    }
  }, []);

  const updateModule = useCallback(async (id: string, name: string) => {
    setModulesBusy(true);
    // Optimistically update UI immediately so it feels instant
    setModules(prev => prev.map(m => (m.id === id ? { ...m, name } : m)));
    try {
      const updated = await updateModuleApi(id, name);
      // Server returned clean CORS response — apply authoritative data
      setModules(prev => prev.map(m => (m.id === id ? updated : m)));
    } catch (err) {
      if (isCorsOrNetworkError(err)) {
        // Browser blocked the response due to missing CORS headers on the dev API,
        // but the server DID succeed (200). Re-fetch from GET to sync state.
        await refreshModules();
      } else {
        // Real error — roll back optimistic update
        await refreshModules();
        throw err;
      }
    } finally {
      setModulesBusy(false);
    }
  }, [refreshModules]);

  const deleteModule = useCallback(async (id: string) => {
    setModulesBusy(true);
    // Optimistically remove from UI immediately
    const brandIds = brands.filter(b => b.moduleId === id).map(b => b.id);
    setModules(prev   => prev.filter(m => m.id !== id));
    setBrands(prev    => prev.filter(b => b.moduleId !== id));
    setSubBrands(prev => prev.filter(sb => !brandIds.includes(sb.brandId)));
    setProducts(prev  => prev.filter(p => p.moduleId !== id));
    try {
      await deleteModuleApi(id);
      // Success — nothing more to do, UI already updated
    } catch (err) {
      if (isCorsOrNetworkError(err)) {
        // Browser blocked response but server succeeded — re-fetch to confirm
        await refreshModules();
      } else {
        // Real error — restore by re-fetching
        await refreshModules();
        throw err;
      }
    } finally {
      setModulesBusy(false);
    }
  }, [brands, refreshModules]);

  // ── Brand CRUD (API-backed) ────────────────────────────────────────────────
  const addBrand = useCallback(async (name: string, moduleId: string) => {
    setBrandsBusy(true);
    try {
      const created = await createBrandApi(name, moduleId);
      setBrands(prev => [...prev, created]);
    } catch (err) {
      if (isCorsOrNetworkError(err)) {
        await refreshBrands();
      } else { throw err; }
    } finally {
      setBrandsBusy(false);
    }
  }, [refreshBrands]);

  const updateBrand = useCallback(async (id: string, name: string) => {
    setBrandsBusy(true);
    setBrands(prev => prev.map(b => (b.id === id ? { ...b, name } : b)));
    try {
      const updated = await updateBrandApi(id, name);
      setBrands(prev => prev.map(b => (b.id === id ? updated : b)));
    } catch (err) {
      if (isCorsOrNetworkError(err)) {
        await refreshBrands();
      } else {
        await refreshBrands();
        throw err;
      }
    } finally {
      setBrandsBusy(false);
    }
  }, [refreshBrands]);

  const deleteBrand = useCallback(async (id: string) => {
    setBrandsBusy(true);
    setBrands(prev    => prev.filter(b => b.id !== id));
    setSubBrands(prev => prev.filter(sb => sb.brandId !== id));
    setProducts(prev  => prev.filter(p => p.brandId !== id));
    try {
      await deleteBrandApi(id);
    } catch (err) {
      if (isCorsOrNetworkError(err)) {
        await refreshBrands();
      } else {
        await refreshBrands();
        throw err;
      }
    } finally {
      setBrandsBusy(false);
    }
  }, [refreshBrands]);

  // ── Sub-brand CRUD (localStorage) ─────────────────────────────────────────
  const addSubBrand = useCallback((name: string, brandId: string) => {
    setSubBrands(prev => [...prev, { id: generateId(), name, brandId, createdAt: new Date().toISOString() }]);
  }, []);

  const updateSubBrand = useCallback((id: string, name: string) => {
    setSubBrands(prev => prev.map(sb => (sb.id === id ? { ...sb, name } : sb)));
  }, []);

  const deleteSubBrand = useCallback((id: string) => {
    setSubBrands(prev => prev.filter(sb => sb.id !== id));
    setProducts(prev  => prev.map(p => (p.subBrandId === id ? { ...p, subBrandId: undefined } : p)));
  }, []);

  // ── Product CRUD (localStorage) ────────────────────────────────────────────
  const addProduct = useCallback((product: Omit<AdminProduct, 'id' | 'createdAt'>) => {
    setProducts(prev => [...prev, { ...product, id: generateId(), createdAt: new Date().toISOString() }]);
  }, []);

  const updateProduct = useCallback((id: string, product: Omit<AdminProduct, 'id' | 'createdAt'>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...product } : p)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const data: AdminData = { modules, brands, subBrands, products };

  return (
    <AdminContext.Provider
      value={{
        data,
        modulesLoading,
        modulesError,
        modulesBusy,
        brandsLoading,
        brandsError,
        brandsBusy,
        addModule, updateModule, deleteModule,
        addBrand, updateBrand, deleteBrand,
        addSubBrand, updateSubBrand, deleteSubBrand,
        addProduct, updateProduct, deleteProduct,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
