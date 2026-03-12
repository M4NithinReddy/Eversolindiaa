import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useAdmin, AdminProduct } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Save, FileSpreadsheet, Pencil, Eye, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductForm from './ProductForm';
import DraftProductDetail from './DraftProductDetail';

interface ExcelManagerProps {
  onCancel: () => void;
}

const ExcelManager = ({ onCancel }: ExcelManagerProps) => {
  const { data, addProduct } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draftProducts, setDraftProducts] = useState<AdminProduct[]>([]);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [viewingDraftId, setViewingDraftId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fallbacks if data doesn't have modules/brands
  const defaultModuleId = data.modules.length > 0 ? data.modules[0].id : '';
  const defaultBrandId = data.brands.length > 0 ? data.brands[0].id : '';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const json = XLSX.utils.sheet_to_json<any>(ws);

        const drafts: AdminProduct[] = json.map((row, index) => {
          // Parse complex fields if they are comma separated or JSON strings
          let specs: any[] = [];
          if (row.Specifications) {
            try {
              specs = JSON.parse(row.Specifications);
            } catch {
              specs = [{ key: 'Info', value: row.Specifications }];
            }
          }

          let benefits = [];
          if (row.Benefits) {
            benefits = row.Benefits.split(',').map((s: string) => s.trim());
          }

          let applications = [];
          if (row.Applications) {
            applications = row.Applications.split(',').map((s: string) => s.trim());
          }

          // Try to match Module and Brand names to IDs if provided
          let moduleId = defaultModuleId;
          let brandId = defaultBrandId;

          if (row.Module) {
            const mod = data.modules.find(m => m.name.toLowerCase() === String(row.Module).toLowerCase());
            if (mod) moduleId = mod.id;
          }
          if (row.Brand) {
            const brand = data.brands.find(b => b.name.toLowerCase() === String(row.Brand).toLowerCase());
            if (brand) brandId = brand.id;
          }

          return {
            id: `draft-${Date.now()}-${index}`,
            title: row.Title || row.title || row.Name || row.name || `Imported Product ${index + 1}`,
            description: row.Description || row.description || '',
            images: row.Image ? [row.Image] : [],
            moduleId,
            brandId,
            subBrandId: undefined, // Add logic if needed
            specifications: specs,
            benefits: benefits,
            applications: applications,
            price: parseFloat(row.Price || row.price || '0') || 0,
            capacity: row.Capacity || row.capacity || '',
            warranty: row.Warranty || row.warranty || '',
            datasheet: row.Datasheet || row.datasheet || '',
            createdAt: new Date().toISOString(),
          };
        });

        setDraftProducts(drafts);
      } catch (error) {
        console.error("Error parsing Excel file", error);
        alert("Failed to parse Excel file. Please ensure it's a valid .xlsx file.");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveAll = () => {
    if (draftProducts.length === 0) return;
    
    draftProducts.forEach(draft => {
      const { id, createdAt, ...productData } = draft;
      addProduct({ ...productData });
    });
    
    alert(`Successfully imported ${draftProducts.length} products!`);
    onCancel();
  };

  const handleRemoveDraft = (id: string) => {
    setDraftProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveDraftOverride = (updatedData: Omit<AdminProduct, 'id' | 'createdAt'>) => {
    if (editingDraftId) {
      setDraftProducts(prev => prev.map(p => 
        p.id === editingDraftId 
          ? { ...p, ...updatedData } 
          : p
      ));
      setEditingDraftId(null);
    }
  };

  // Helper functions to get names
  const getModuleName = (id: string) => data.modules.find(m => m.id === id)?.name || 'Unknown Module';
  const getBrandName = (id: string) => data.brands.find(b => b.id === id)?.name || 'Unknown Brand';

  // Render detail view
  if (viewingDraftId) {
    const draft = draftProducts.find(p => p.id === viewingDraftId);
    if (draft) {
      return (
        <div className="space-y-6">
          <DraftProductDetail 
            product={draft} 
            onBack={() => setViewingDraftId(null)} 
            moduleName={getModuleName(draft.moduleId)}
            brandName={getBrandName(draft.brandId)}
          />
        </div>
      );
    }
  }

  // Render edit form
  if (editingDraftId) {
    const draftToEdit = draftProducts.find(p => p.id === editingDraftId);
    if (draftToEdit) {
      return (
        <ProductForm 
          moduleId={draftToEdit.moduleId}
          brandId={draftToEdit.brandId}
          subBrandId={draftToEdit.subBrandId}
          editProduct={draftToEdit}
          onCancel={() => setEditingDraftId(null)}
          onSaved={() => setEditingDraftId(null)}
          onSaveOverride={handleSaveDraftOverride}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Excel Import</h2>
          <p className="text-sm text-gray-500">Upload bulk products from an Excel spreadsheet.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          {draftProducts.length > 0 && (
            <Button onClick={handleSaveAll} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Save className="w-4 h-4" /> Import {draftProducts.length} Products
            </Button>
          )}
        </div>
      </div>

      {draftProducts.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-emerald-500 hover:bg-emerald-50/50 cursor-pointer transition-colors"
        >
          <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Upload Excel File</h3>
          <p className="text-sm text-gray-500 mb-4">Click to browse or drag and drop your .xlsx file here</p>
          <Button variant="outline" className="pointer-events-none">
            {isUploading ? 'Uploading...' : 'Select File'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
            <Save className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Previewing Drafts</p>
              <p className="text-sm">These products have not been saved to your catalog yet. Review, edit, or remove items before importing them.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {draftProducts.map(draft => (
                <motion.div
                  key={draft.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="h-full flex flex-col hover:border-emerald-300 transition-colors bg-white group shadow-sm border-gray-200">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                        {draft.images && draft.images.length > 0 ? (
                          <img 
                            src={draft.images[0]} 
                            alt={draft.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <ImageIcon className="w-10 h-10 text-gray-300" />
                        )}
                        <div className="absolute top-2 right-2 flex gap-2">
                           <Button 
                            size="icon" 
                            variant="destructive" 
                            onClick={(e) => { e.stopPropagation(); handleRemoveDraft(draft.id); }}
                            className="h-8 w-8 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {getBrandName(draft.brandId)}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{draft.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                          {draft.description || 'No description'}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs border-y border-gray-100 py-3 mb-4">
                           <div>
                            <span className="text-gray-500 block">Capacity</span>
                            <span className="font-medium text-gray-900 line-clamp-1">{draft.capacity || '-'}</span>
                           </div>
                           <div>
                            <span className="text-gray-500 block">Price</span>
                            <span className="font-medium text-emerald-600">
                              {draft.price > 0 ? `₹${draft.price.toLocaleString()}` : 'On Request'}
                            </span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-auto">
                          <Button 
                            variant="outline" 
                            className="w-full gap-2 text-gray-600"
                            onClick={() => setViewingDraftId(draft.id)}
                          >
                            <Eye className="w-4 h-4" /> View
                          </Button>
                          <Button 
                            variant="default" 
                            className="w-full gap-2 bg-gray-900 hover:bg-gray-800"
                            onClick={() => setEditingDraftId(draft.id)}
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default ExcelManager;
