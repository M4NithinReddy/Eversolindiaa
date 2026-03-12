import { useState } from 'react';
import { useAdmin, AdminModule, AdminBrand, AdminSubBrand, AdminProduct } from '@/context/AdminContext';
import ModuleManager from '@/components/admin/ModuleManager';
import BrandManager from '@/components/admin/BrandManager';
import ProductForm from '@/components/admin/ProductForm';
import ProductList from '@/components/admin/ProductList';
import CatalogView from '@/components/admin/CatalogView';
import ExcelUploader from '@/components/admin/ExcelUploader';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, LayoutDashboard, Package, Tags, ShoppingBag, ChevronRight, Boxes, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

type View = 'dashboard' | 'productForm';
type Tab  = 'dashboard' | 'catalog' | 'excel';

const TAB_CONFIG: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard',    icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'catalog',   label: 'Catalog View', icon: <Boxes className="w-4 h-4" /> },
  { id: 'excel',     label: 'Excel Import', icon: <FileSpreadsheet className="w-4 h-4" /> },
];

const AdminDashboard = () => {
  const { data } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
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

  const handleSelectSubBrand = (subBrand: AdminSubBrand | null) => setSelectedSubBrand(subBrand);

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

        {/* Tab Bar */}
        <div className="flex border-t border-gray-100 px-6">
          {TAB_CONFIG.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── DASHBOARD TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <div className="flex h-[calc(100vh-108px)]">
          {/* Sidebar */}
          <aside className="w-80 shrink-0 border-r border-gray-200 bg-white">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                <ModuleManager
                  onSelectModule={handleSelectModule}
                  selectedModuleId={selectedModule?.id}
                />
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

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedBrand
                          ? `${selectedBrand.name} Products`
                          : selectedModule
                          ? selectedModule.name
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
                      <p className="text-gray-500">Choose a brand from the sidebar or create a new one.</p>
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
      )}

      {/* ── CATALOG VIEW TAB ─────────────────────────────────────────────────── */}
      {activeTab === 'catalog' && (
        <div className="p-6 max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Catalog View</h2>
            <p className="text-sm text-gray-500 mt-1">
              Browse your full catalog structured as <strong>Brand → Module → Products</strong>
            </p>
          </div>
          <CatalogView />
        </div>
      )}

      {/* ── EXCEL IMPORT TAB ──────────────────────────────────────────────────── */}
      {activeTab === 'excel' && (
        <div className="p-6 max-w-4xl mx-auto">
          <ExcelUploader />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
