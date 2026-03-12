import { useState } from 'react';
import { useAdmin, AdminModule, AdminBrand, AdminSubBrand, AdminProduct } from '@/context/AdminContext';
import ModuleManager from '@/components/admin/ModuleManager';
import BrandManager from '@/components/admin/BrandManager';
import ProductForm from '@/components/admin/ProductForm';
import ProductList from '@/components/admin/ProductList';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, LayoutDashboard, Package, Tags, ShoppingBag, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type View = 'dashboard' | 'productForm';

const AdminDashboard = () => {
  const { data, loading, error } = useAdmin();
  const [selectedModule, setSelectedModule] = useState<AdminModule | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<AdminBrand | null>(null);
  const [selectedSubBrand, setSelectedSubBrand] = useState<AdminSubBrand | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);

  const handleSelectModule = (mod: AdminModule) => {
    setSelectedModule(mod);
    setSelectedBrand(null);
    setSelectedSubBrand(null);
  };

  const handleSelectBrand = (brand: AdminBrand) => {
    setSelectedBrand(brand);
    setSelectedSubBrand(null);
  };

  const handleSelectSubBrand = (subBrand: AdminSubBrand | null) => {
    setSelectedSubBrand(subBrand);
  };

  const handleEditProduct = (product: AdminProduct) => {
    setEditProduct(product);
    setView('productForm');
  };

  const handleAddProduct = () => {
    setEditProduct(null);
    setView('productForm');
  };

  const handleProductSaved = () => {
    setEditProduct(null);
    setView('dashboard');
  };

  const handleProductCancel = () => {
    setEditProduct(null);
    setView('dashboard');
  };

  if (loading && data.modules.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  if (error && data.modules.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load dashboard</h2>
        <p className="text-gray-500 max-w-md">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6 bg-emerald-600 hover:bg-emerald-700">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Manage your products & catalog</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <Package className="w-3.5 h-3.5 text-emerald-600" />
              <span>{data.modules.length} Modules</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200">
              <Tags className="w-3.5 h-3.5 text-blue-600" />
              <span>{data.brands.length} Brands</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
              <span>{data.products.length} Products</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Sidebar */}
        <aside className="w-80 shrink-0 border-r border-gray-200 bg-white">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* Modules */}
              <ModuleManager
                onSelectModule={handleSelectModule}
                selectedModuleId={selectedModule?.id}
              />

              {/* Brands — shown when a module is selected */}
              {selectedModule && (
                <>
                  <Separator className="bg-gray-200" />
                  <BrandManager
                    moduleId={selectedModule.id}
                    moduleName={selectedModule.name}
                    onSelectBrand={handleSelectBrand}
                    selectedBrandId={selectedBrand?.id}
                    onSelectSubBrand={handleSelectSubBrand}
                    selectedSubBrandId={selectedSubBrand?.id}
                  />
                </>
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 max-w-5xl mx-auto">
            {view === 'productForm' ? (
              <ProductForm
                moduleId={selectedModule?.id || ''}
                brandId={selectedBrand?.id || ''}
                subBrandId={selectedSubBrand?.id}
                editProduct={editProduct || undefined}
                onCancel={handleProductCancel}
                onSaved={handleProductSaved}
              />
            ) : (
              <>
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                  <span className="text-gray-500">Dashboard</span>
                  {selectedModule && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5" />
                      <span className="text-emerald-600 font-medium">{selectedModule.name}</span>
                    </>
                  )}
                  {selectedBrand && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5" />
                      <span className="text-blue-600 font-medium">{selectedBrand.name}</span>
                    </>
                  )}
                  {selectedSubBrand && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5" />
                      <span className="text-violet-600 font-medium">{selectedSubBrand.name}</span>
                    </>
                  )}
                </div>

                {/* Header + Add button */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedBrand
                        ? `${selectedBrand.name} Products`
                        : selectedModule
                        ? `${selectedModule.name}`
                        : 'All Products'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedBrand
                        ? `Manage products under ${selectedBrand.name}`
                        : selectedModule
                        ? 'Select a brand to view its products'
                        : 'Select a module from the sidebar to begin'}
                    </p>
                  </div>
                  {selectedBrand && (
                    <Button
                      onClick={handleAddProduct}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Product
                    </Button>
                  )}
                </div>

                {/* Content */}
                {!selectedModule ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200 flex items-center justify-center">
                      <LayoutDashboard className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Admin Dashboard</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Start by selecting a <strong className="text-emerald-600">Module</strong> from the sidebar, then pick a{' '}
                      <strong className="text-blue-600">Brand</strong> to manage its{' '}
                      <strong className="text-amber-600">Products</strong>.
                    </p>
                  </motion.div>
                ) : !selectedBrand ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <Tags className="w-16 h-16 mx-auto mb-4 text-blue-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Brand</h3>
                    <p className="text-gray-500">
                      Choose a brand from the sidebar or create a new one to manage products.
                    </p>
                  </motion.div>
                ) : (
                  <ProductList
                    moduleId={selectedModule.id}
                    brandId={selectedBrand.id}
                    subBrandId={selectedSubBrand?.id}
                    onEdit={handleEditProduct}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
