import { useState } from 'react';
import { useAdmin, AdminModule, AdminBrand, AdminSubBrand, AdminProduct } from '@/context/AdminContext';
import ModuleManager from '@/components/admin/ModuleManager';
import BrandManager from '@/components/admin/BrandManager';
import ProductForm from '@/components/admin/ProductForm';
import ProductList from '@/components/admin/ProductList';
import ExcelManager from '@/components/admin/ExcelManager';
import DraftProductDetail from '@/components/admin/DraftProductDetail';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, LayoutDashboard, Package, Tags, ShoppingBag, ChevronRight, Download, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

type View = 'dashboard' | 'productForm' | 'excelUpload' | 'productView';

const AdminDashboard = () => {
  const { data, deleteAllProducts } = useAdmin();
  const [selectedModule, setSelectedModule] = useState<AdminModule | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<AdminBrand | null>(null);
  const [selectedSubBrand, setSelectedSubBrand] = useState<AdminSubBrand | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
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

  const handleUploadExcel = () => {
    setView('excelUpload');
  };

  const handleViewProduct = (product: AdminProduct) => {
    setSelectedProduct(product);
    setView('productView');
  };

  const handleProductSaved = () => {
    setEditProduct(null);
    setSelectedProduct(null);
    setView('dashboard');
  };

  const handleProductCancel = () => {
    setEditProduct(null);
    setSelectedProduct(null);
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
            <div className="ml-4 border-l border-gray-200 pl-4 flex gap-2">
              <Button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete ALL products? This cannot be undone.')) {
                    deleteAllProducts();
                  }
                }}
                size="sm"
                variant="outline"
                className="text-red-700 bg-red-50 border-red-200 hover:bg-red-100 gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete All
              </Button>
              <Button
                onClick={() => setView('excelUpload')}
                size="sm"
                variant="outline"
                className="text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 gap-1.5"
              >
                <Download className="w-3.5 h-3.5 rotate-180" /> Bulk Import
              </Button>
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
            ) : view === 'excelUpload' ? (
              <ExcelManager onCancel={() => setView('dashboard')} />
            ) : view === 'productView' && selectedProduct ? (
              <DraftProductDetail 
                product={selectedProduct} 
                onBack={() => setView('dashboard')}
                moduleName={data.modules.find(m => m.id === selectedProduct.moduleId)?.name}
                brandName={data.brands.find(b => b.id === selectedProduct.brandId)?.name}
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
                  <Button
                    onClick={handleAddProduct}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </Button>
                </div>

                {/* Content */}
                <ProductList
                  moduleId={selectedModule?.id}
                  brandId={selectedBrand?.id}
                  subBrandId={selectedSubBrand?.id}
                  onEdit={handleEditProduct}
                  onView={handleViewProduct}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
