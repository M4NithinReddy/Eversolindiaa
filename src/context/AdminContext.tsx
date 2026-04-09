import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  getModules, createModuleApi, updateModuleApi, deleteModuleApi,
  getBrands,  createBrandApi,  updateBrandApi,  deleteBrandApi,
  getProducts, createProductApi, updateProductApi, deleteProductApi, bulkCreateProductsApi, deleteAllProductsApi
} from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface AdminModule  { id: string; name: string; createdAt: string; }
export interface AdminBrand   { id: string; name: string; moduleId: string; createdAt: string; }
export interface AdminSubBrand { id: string; name: string; brandId: string; createdAt: string; }
export interface ProductSpecification { key: string; value: string; }
export interface AdminProduct {
  id: string; title: string; description: string; images: string[];
  moduleId: string; brandId: string; subBrandId?: string;
  productType?: string;
  specifications: ProductSpecification[]; benefits: string[];
  applications: string[]; price: number; capacity: string; phase?: string;
  warranty: string; datasheet: string; isOutOfStock?: boolean; createdAt: string;
}
export interface AdminData {
  modules: AdminModule[]; brands: AdminBrand[];
  subBrands: AdminSubBrand[]; products: AdminProduct[];
}

interface AdminContextType {
  data: AdminData;
  modulesLoading: boolean; modulesError: string | null; modulesBusy: boolean;
  brandsLoading:  boolean; brandsError:  string | null; brandsBusy:  boolean;
  productsLoading: boolean; productsError: string | null; productsBusy: boolean;
  addModule:    (name: string) => Promise<AdminModule>;
  updateModule: (id: string, name: string) => Promise<void>;
  deleteModule: (id: string) => Promise<void>;
  addBrand:    (name: string, moduleId: string) => Promise<AdminBrand>;
  updateBrand: (id: string, name: string) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  addSubBrand:    (name: string, brandId: string) => void;
  updateSubBrand: (id: string, name: string) => void;
  deleteSubBrand: (id: string) => void;
  addProduct:    (product: Omit<AdminProduct, 'id' | 'createdAt'>) => Promise<void>;
  bulkAddProducts: (products: Omit<AdminProduct, 'id' | 'createdAt'>[]) => Promise<void>;
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

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const local = loadLocal();
  const [modules,  setModules]  = useState<AdminModule[]>([]);
  const [brands,   setBrands]   = useState<AdminBrand[]>([]);
  const [subBrands,setSubBrands]= useState<AdminSubBrand[]>(local.subBrands);
  const [products, setProducts] = useState<AdminProduct[]>([]);

  const [modulesLoading,  setModulesLoading]  = useState(true);
  const [modulesError,    setModulesError]    = useState<string | null>(null);
  const [modulesBusy,     setModulesBusy]     = useState(false);
  const [brandsLoading,   setBrandsLoading]   = useState(true);
  const [brandsError,     setBrandsError]     = useState<string | null>(null);
  const [brandsBusy,      setBrandsBusy]      = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError,   setProductsError]   = useState<string | null>(null);
  const [productsBusy,    setProductsBusy]    = useState(false);

  useEffect(() => { localStorage.setItem(LOCAL_KEY, JSON.stringify({ subBrands })); }, [subBrands]);

  const refreshModules  = useCallback(async () => { 
    try { 
      const rawModules = await getModules();
      setModules(rawModules.map(m => m.name.toLowerCase() === 'solar modules' ? { ...m, name: 'Eversol Roof Top Kit' } : m)); 
    } catch { /* */ } 
  }, []);
  const refreshBrands   = useCallback(async () => { try { setBrands(await getBrands()); }     catch { /* */ } }, []);
  const refreshProducts = useCallback(async () => { try { setProducts(await getProducts()); } catch { /* */ } }, []);

  // Fetch on mount
  useEffect(() => {
    setModulesLoading(true);
    getModules().then(raw => {
      setModules(raw.map(m => m.name.toLowerCase() === 'solar modules' ? { ...m, name: 'Eversol Roof Top Kit' } : m));
    }).catch(e => setModulesError(e.message)).finally(() => setModulesLoading(false));
  }, []);
  useEffect(() => {
    setBrandsLoading(true);
    getBrands().then(setBrands).catch(e => setBrandsError(e.message)).finally(() => setBrandsLoading(false));
  }, []);
  useEffect(() => {
    setProductsLoading(true);
    getProducts().then(setProducts).catch(e => setProductsError(e.message)).finally(() => setProductsLoading(false));
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
  const addSubBrand    = useCallback((name: string, brandId: string) => {
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
      setProducts(p => [...p, created]);
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
          allCreated.push(...response.data);
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

  const data: AdminData = { modules, brands, subBrands, products };

  return (
    <AdminContext.Provider value={{
      data,
      modulesLoading, modulesError, modulesBusy,
      brandsLoading,  brandsError,  brandsBusy,
      productsLoading, productsError, productsBusy,
      addModule, updateModule, deleteModule,
      addBrand,  updateBrand,  deleteBrand,
      addSubBrand, updateSubBrand, deleteSubBrand,
      addProduct,  updateProduct,  deleteProduct, bulkAddProducts, deleteAllProducts
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
