import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

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
  // Module CRUD
  addModule: (name: string) => void;
  updateModule: (id: string, name: string) => void;
  deleteModule: (id: string) => void;
  // Brand CRUD
  addBrand: (name: string, moduleId: string) => void;
  updateBrand: (id: string, name: string) => void;
  deleteBrand: (id: string) => void;
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
  modules: SEED_MODULES.map(m => ({ ...m, createdAt: ts })),
  brands: SEED_BRANDS.map(b => ({ ...b, createdAt: ts })),
  subBrands: [],
  products: [],
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function loadData(): AdminData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminData;
      // If stored data has no modules, seed it with defaults
      if (!parsed.modules || parsed.modules.length === 0) {
        return defaultData;
      }
      return parsed;
    }
    return defaultData;
  } catch {
    return defaultData;
  }
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AdminData>(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // ── Module ─────────────────────────────────────────────────────────────────
  const addModule = useCallback((name: string) => {
    setData(prev => ({
      ...prev,
      modules: [...prev.modules, { id: generateId(), name, createdAt: new Date().toISOString() }],
    }));
  }, []);

  const updateModule = useCallback((id: string, name: string) => {
    setData(prev => ({
      ...prev,
      modules: prev.modules.map(m => (m.id === id ? { ...m, name } : m)),
    }));
  }, []);

  const deleteModule = useCallback((id: string) => {
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
  }, []);

  // ── Brand ──────────────────────────────────────────────────────────────────
  const addBrand = useCallback((name: string, moduleId: string) => {
    setData(prev => ({
      ...prev,
      brands: [...prev.brands, { id: generateId(), name, moduleId, createdAt: new Date().toISOString() }],
    }));
  }, []);

  const updateBrand = useCallback((id: string, name: string) => {
    setData(prev => ({
      ...prev,
      brands: prev.brands.map(b => (b.id === id ? { ...b, name } : b)),
    }));
  }, []);

  const deleteBrand = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      brands: prev.brands.filter(b => b.id !== id),
      subBrands: prev.subBrands.filter(sb => sb.brandId !== id),
      products: prev.products.filter(p => p.brandId !== id),
    }));
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
