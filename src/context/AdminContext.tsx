import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import * as api from '@/services/adminApi';

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
  loading: boolean;
  error: string | null;
  // Module CRUD
  refreshModules: () => Promise<void>;
  addModule: (name: string) => Promise<void>;
  updateModule: (id: string, name: string) => Promise<void>;
  deleteModule: (id: string) => Promise<void>;
  // Brand CRUD
  refreshBrands: () => Promise<void>;
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

const STORAGE_KEY = 'eversol_admin_data';

// ── Pre-populated modules & brands matching existing Shop data ─────────────
const SEED_MODULES = [
  { id: 'mod-solar-modules', name: 'Solar Modules' },
  { id: 'mod-solar-inverters', name: 'Solar Inverters' },
  { id: 'mod-solar-storage', name: 'Solar Storage' },
  { id: 'mod-rooftop-kits', name: 'Rooftop Kits' },
];

const SEED_BRANDS = [
  // Solar Modules brands
  { id: 'brand-solex', name: 'Solex', moduleId: 'mod-solar-modules' },
  { id: 'brand-pahal', name: 'Pahal', moduleId: 'mod-solar-modules' },
  { id: 'brand-waaree', name: 'Waaree', moduleId: 'mod-solar-modules' },
  { id: 'brand-panasonic', name: 'Panasonic', moduleId: 'mod-solar-modules' },
  // Solar Inverters brands
  { id: 'brand-solplanet-inv', name: 'Solplanet', moduleId: 'mod-solar-inverters' },
  { id: 'brand-involtics', name: 'Involtics', moduleId: 'mod-solar-inverters' },
  { id: 'brand-goodwe', name: 'GoodWe', moduleId: 'mod-solar-inverters' },
  { id: 'brand-sunways', name: 'Sunways', moduleId: 'mod-solar-inverters' },
  // Solar Storage brands
  { id: 'brand-solaryaan', name: 'Solaryaan', moduleId: 'mod-solar-storage' },
  { id: 'brand-solplanet-stor', name: 'Solplanet', moduleId: 'mod-solar-storage' },
];

const ts = '2026-01-01T00:00:00.000Z';

const defaultData: AdminData = {
  modules: [],
  brands: [],
  subBrands: [],
  products: [],
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function loadLocalData(): AdminData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminData;
      // We no longer fallback to seed data. Modules/Brands come from API.
      // Sub-brands/Products read from local storage.
      return {
        ...defaultData,
        ...parsed,
        modules: [], // Clear modules to force API fetch
        brands: [],   // Clear brands to force API fetch
      };
    }
    return defaultData;
  } catch {
    return defaultData;
  }
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AdminData>(loadLocalData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync ONLY subBrands and products to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      modules: [], // do not persist modules
      brands: [],  // do not persist brands
    }));
  }, [data.subBrands, data.products]);

  // Initial load
  useEffect(() => {
    let mounted = true;
    
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const [apiModules, apiBrands] = await Promise.all([
          api.fetchModules(),
          api.fetchBrands(),
        ]);
        if (mounted) {
          setData(prev => ({ ...prev, modules: apiModules, brands: apiBrands }));
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load initial data');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    
    return () => { mounted = false; };
  }, []);

  // ── Module ─────────────────────────────────────────────────────────────────
  
  const refreshModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const modules = await api.fetchModules();
      setData(prev => ({ ...prev, modules }));
    } catch (err: any) {
      setError(err.message || 'Failed to refresh modules');
    } finally {
      setLoading(false);
    }
  }, []);

  const addModule = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const newModule = await api.createModule(name);
      setData(prev => ({
        ...prev,
        modules: [...prev.modules, newModule],
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to create module');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateModule = useCallback(async (id: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await api.updateModule(id, name);
      // Backend returns the updated module, but let's refresh to be safe or update inline
      setData(prev => ({
        ...prev,
        modules: prev.modules.map(m => (m.id === id ? { ...updated } : m)),
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to update module');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteModule = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteModuleApi(id);
      setData(prev => {
        const brandIds = prev.brands.filter(b => b.moduleId === id).map(b => b.id);
        const subBrandIds = prev.subBrands.filter(sb => brandIds.includes(sb.brandId)).map(sb => sb.id);
        return {
          modules: prev.modules.filter(m => m.id !== id),
          brands: prev.brands.filter(b => b.moduleId !== id),
          subBrands: prev.subBrands.filter(sb => !brandIds.includes(sb.brandId)),
          products: prev.products.filter(p => p.moduleId !== id),
        };
      });
    } catch (err: any) {
      setError(err.message || 'Failed to delete module');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Brand ──────────────────────────────────────────────────────────────────
  
  const refreshBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const brands = await api.fetchBrands();
      setData(prev => ({ ...prev, brands }));
    } catch (err: any) {
      setError(err.message || 'Failed to refresh brands');
    } finally {
      setLoading(false);
    }
  }, []);

  const addBrand = useCallback(async (name: string, moduleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const newBrand = await api.createBrand(name, moduleId);
      setData(prev => ({
        ...prev,
        brands: [...prev.brands, newBrand],
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to create brand');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBrand = useCallback(async (id: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await api.updateBrand(id, name);
      setData(prev => ({
        ...prev,
        brands: prev.brands.map(b => (b.id === id ? { ...updated } : b)),
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to update brand');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBrand = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteBrandApi(id);
      setData(prev => ({
        ...prev,
        brands: prev.brands.filter(b => b.id !== id),
        subBrands: prev.subBrands.filter(sb => sb.brandId !== id),
        products: prev.products.filter(p => p.brandId !== id),
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to delete brand');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Sub-brand ──────────────────────────────────────────────────────────────
  const addSubBrand = useCallback((name: string, brandId: string) => {
    setData(prev => ({
      ...prev,
      subBrands: [...prev.subBrands, { id: generateId(), name, brandId, createdAt: new Date().toISOString() }],
    }));
  }, []);

  const updateSubBrand = useCallback((id: string, name: string) => {
    setData(prev => ({
      ...prev,
      subBrands: prev.subBrands.map(sb => (sb.id === id ? { ...sb, name } : sb)),
    }));
  }, []);

  const deleteSubBrand = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      subBrands: prev.subBrands.filter(sb => sb.id !== id),
      products: prev.products.map(p => (p.subBrandId === id ? { ...p, subBrandId: undefined } : p)),
    }));
  }, []);

  // ── Product ────────────────────────────────────────────────────────────────
  const addProduct = useCallback((product: Omit<AdminProduct, 'id' | 'createdAt'>) => {
    setData(prev => ({
      ...prev,
      products: [...prev.products, { ...product, id: generateId(), createdAt: new Date().toISOString() }],
    }));
  }, []);

  const updateProduct = useCallback((id: string, product: Omit<AdminProduct, 'id' | 'createdAt'>) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => (p.id === id ? { ...p, ...product } : p)),
    }));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id),
    }));
  }, []);

  return (
    <AdminContext.Provider
      value={{
        data,
        loading,
        error,
        refreshModules, addModule, updateModule, deleteModule,
        refreshBrands, addBrand, updateBrand, deleteBrand,
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
