import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useAdmin, AdminProduct, ProductSpecification } from '@/context/AdminContext';
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
  const { data, bulkAddProducts, addModule, addBrand } = useAdmin();
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
          // Normalize keys (lowercase and trim) for easier mapping
          const normalizedRow: any = {};
          Object.keys(row).forEach(key => {
            normalizedRow[key.toLowerCase().trim()] = row[key];
          });

          // Helper to find value by partial key match or multiple variants
          const getVal = (variants: string[]) => {
            for (const v of variants) {
              const normalizedV = v.toLowerCase().trim();
              if (normalizedRow[normalizedV] !== undefined && normalizedRow[normalizedV] !== null && normalizedRow[normalizedV] !== '') {
                return normalizedRow[normalizedV];
          // Helper to get value from possible keys
          const getVal = (keys: string[]) => {
            for (const k of keys) {
              const normalizedKey = k.toLowerCase().trim();
              if (normalizedRow[normalizedKey] !== undefined && normalizedRow[normalizedKey] !== null && String(normalizedRow[normalizedKey]).trim() !== '') {
                return normalizedRow[normalizedKey];
              }
            }
            return undefined;
          };

          // Extract specific fields based on user screenshot headers
          const rawModuleName = String(getVal(['product', 'category', 'module']) || '').trim();
          const rawBrandName = String(getVal(['brand name', 'brand']) || '').trim();
          const title = String(getVal(['product name', 'title', 'name']) || `Imported Product ${index + 1}`).trim();

          // Specifications mapping
          const specs: ProductSpecification[] = [];

          const specMappings = [
            { key: 'MONO/BIFECIAL', variants: ['mono/bifecial', 'mono bifecial'] },
            { key: 'Model Number', variants: ['model number', 'model nr'] },
            { key: 'Wattage (W)', variants: ['wattage (w)', 'wattage', 'capacity'] },
            { key: 'Cell Type (Mono/Poly/Topcon/Bifacial)', variants: ['cell type (mono/poly/topcon/bifacial)', 'cell type', 'cell'] },
            { key: 'Module Efficiency (%)', variants: ['module efficiency (%)', 'module efficiency', 'efficiency', 'eff'] },
            { key: 'No. of Cells', variants: ['no. of cells', 'no. of cel', 'cells'] },
            { key: 'Warranty (Performance)', variants: ['warranty (performance)', 'warranty (performanc)', 'performance warranty'] },
            { key: 'Available Stock', variants: ['available stock', 'stock'] },
          ];

          specMappings.forEach(mapping => {
            const val = getVal(mapping.variants);
            if (val !== undefined) {
              specs.push({ key: mapping.key, value: String(val) });
            }
          });

          // Force "Available Stock: YES" for Solar PV Modules if it's not provided
          const isSolarModule = rawModuleName.toLowerCase().includes('module') || rawModuleName.toLowerCase().includes('panel');
          const hasStock = specs.find(s => s.key === 'Available Stock');
          if (isSolarModule && !hasStock) {
            specs.push({ key: 'Available Stock', value: 'YES' });
          }

          // Handle generic specs if present as JSON
          const excelSpecs = normalizedRow.specifications || normalizedRow.specs;
          if (excelSpecs) {
            try {
              const parsed = JSON.parse(excelSpecs);
              if (Array.isArray(parsed)) specs.push(...parsed);
            } catch {
              specs.push({ key: 'Additional Info', value: String(excelSpecs) });
          // 1. Identify standard fields
          const title = String(getVal(['model name', 'title', 'name', 'model', 'product name']) || `Imported Product ${index + 1}`).trim();
          const description = String(getVal(['description', 'features', 'about', 'info']) || '').trim();
          const price = parseFloat(getVal(['total price', 'price', 'mrp', 'cost']) || '0') || 0;
          const capacity = String(getVal(['capacity', 'capacity (kwh/ah)', 'size', 'power']) || '').trim();
          const warranty = String(getVal(['warranty', 'guarantee']) || '').trim();
          const productType = String(getVal(['type', 'product type', 'inverter type', 'battery type', 'battery type (lithium/l']) || '').trim();
          const phase = String(getVal(['phase', 'phase (single/three phase)']) || '').trim();
          const datasheet = String(getVal(['datasheet', 'manual', 'pdf']) || '').trim();
          
          // 2. Map Brands & Modules
          let moduleId = '';
          let brandId = '';
          const rawModuleName = String(getVal(['product name', 'category', 'module', 'module name']) || '').trim();
          const rawBrandName = String(getVal(['brand', 'brand name']) || '').trim();

          if (rawModuleName) {
            const mod = data.modules.find(m => m.name.toLowerCase() === rawModuleName.toLowerCase());
            if (mod) moduleId = mod.id;
          }
          if (rawBrandName) {
            const brand = data.brands.find(b => b.name.toLowerCase() === rawBrandName.toLowerCase());
            if (brand) brandId = brand.id;
          }

          const isModuleNew = rawModuleName && !moduleId;
          const isBrandNew = rawBrandName && !brandId;

          // 3. Collect ALL other columns into specifications
          const usedKeys = [
            'model name', 'product name', 'title', 'name', 'model',
            'description', 'features', 'about', 'info',
            'price', 'mrp', 'cost', 'total price',
            'capacity', 'capacity (kwh/ah)', 'size', 'power',
            'warranty', 'guarantee',
            'type', 'product type', 'inverter type', 'battery type', 'battery type (lithium/l',
            'phase', 'phase (single/three phase)',
            'datasheet', 'manual', 'pdf',
            'category', 'module', 'module name',
            'brand', 'brand name',
            'image', 'images', 'img', 'subbrandid', 'subbrand', 'sub-brand'
          ];

          const specs: { key: string; value: string }[] = [];
          
          // Add extra fields as specs
          Object.keys(row).forEach(originalKey => {
            const k = originalKey.toLowerCase().trim();
            if (!usedKeys.includes(k) && row[originalKey] !== undefined && row[originalKey] !== null && String(row[originalKey]).trim() !== '') {
              specs.push({ key: originalKey, value: String(row[originalKey]).trim() });
            }
          });

          // Also check for 'specifications' or 'specs' JSON column
          const excelSpecs = normalizedRow.specifications || normalizedRow.specs;
          if (excelSpecs) {
            try {
              const parsedSpecs = JSON.parse(excelSpecs);
              if (Array.isArray(parsedSpecs)) {
                specs.push(...parsedSpecs);
              }
            } catch {
              if (typeof excelSpecs === 'string' && excelSpecs.includes(':')) {
                 excelSpecs.split(',').forEach(s => {
                    const [k, v] = s.split(':');
                    if (k && v) specs.push({ key: k.trim(), value: v.trim() });
                 });
              }
            }
          }

          // 4. Benefits & Applications
          let benefits = [];
          const excelBenefits = normalizedRow.benefits || normalizedRow.benefit || normalizedRow.features;
          if (excelBenefits) {
            benefits = String(excelBenefits).split(',').map((s: string) => s.trim());
          }

          let applications = [];
          const excelApps = normalizedRow.applications || normalizedRow.application || normalizedRow['compatible inverters'];
          if (excelApps) {
            applications = String(excelApps).split(',').map((s: string) => s.trim());
          }

          let moduleId = '';
          let brandId = '';

          if (rawModuleName) {
            const mod = data.modules.find(m => m.name.toLowerCase() === rawModuleName.toLowerCase());
            if (mod) moduleId = mod.id;
          }
          if (rawBrandName) {
            const brand = data.brands.find(b => b.name.toLowerCase() === rawBrandName.toLowerCase());
            if (brand) brandId = brand.id;
          }

          const isModuleNew = rawModuleName && !moduleId;
          const isBrandNew = rawBrandName && !brandId;

          const price = parseFloat(getVal(['price']) || '0') || 0;
          const capacity = String(getVal(['wattage (w)', 'capacity']) || '').trim();
          const warranty = String(getVal(['warranty (product)', 'warranty (produc)', 'warranty']) || '').trim();
          const isOutOfStock = String(getVal(['available stock']) || '').toLowerCase() === 'no';

          return {
            id: `draft-${Date.now()}-${index}`,
            title: String(normalizedRow.title || normalizedRow.name || `VOLT RAKSHA`).trim(),
            title,
            description: String(normalizedRow.description || '').trim(),
          return {
            id: `draft-${Date.now()}-${index}`,
            title,
            description,
            images: normalizedRow.image ? [normalizedRow.image] : [],
            moduleId: moduleId || defaultModuleId,
            brandId: brandId || defaultBrandId,
            rawModuleName: isModuleNew ? rawModuleName : undefined,
            rawBrandName: isBrandNew ? rawBrandName : undefined,
            subBrandId: undefined,
            specifications: specs,
            benefits: benefits,
            applications: applications,
            price,
            capacity,
            phase: String(normalizedRow.phase || normalizedRow["phase (single/three phase)"] || '').trim(),
            warranty,
            productType: String(normalizedRow.type || normalizedRow["product type"] || '').trim(),
            datasheet: String(normalizedRow.datasheet || normalizedRow['data sheet'] || '').trim(),
            isOutOfStock,
            price: price,
            capacity: capacity,
            phase: phase,
            warranty: warranty,
            productType: productType,
            datasheet: datasheet,
            createdAt: new Date().toISOString(),
          } as any;
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

  const handleSaveAll = async () => {
    if (draftProducts.length === 0) return;

    setIsUploading(true);
    try {
      // Step A: Gather unique modules to create
      const uniqueNewModules = new Set<string>();
      draftProducts.forEach((d: any) => { if (d.rawModuleName) uniqueNewModules.add(d.rawModuleName); });

      const createdModulesMap: Record<string, string> = {};
      for (const modName of uniqueNewModules) {
        const newMod = await addModule(modName);
        createdModulesMap[modName.toLowerCase()] = newMod.id;
      }

      // Step B: Gather unique brands to create based on their Module IDs
      const uniqueNewBrands = new Map<string, { name: string, moduleId: string }>();
      draftProducts.forEach((d: any) => {
        if (d.rawBrandName) {
          const finalModId = d.rawModuleName ? createdModulesMap[d.rawModuleName.toLowerCase()] : d.moduleId;
          const key = `${d.rawBrandName.toLowerCase()}-${finalModId}`;
          uniqueNewBrands.set(key, { name: d.rawBrandName, moduleId: finalModId });
        }
      });

      const createdBrandsMap: Record<string, string> = {};
      for (const [key, brandInfo] of uniqueNewBrands) {
        const newBrand = await addBrand(brandInfo.name, brandInfo.moduleId);
        createdBrandsMap[key] = newBrand.id;
      }

      // Step C: Prepare final products payload with the new IDs
      const productsToCreate = draftProducts.map((draft: any) => {
        const { id, createdAt, rawModuleName, rawBrandName, ...productData } = draft;

        if (rawModuleName) {
          productData.moduleId = createdModulesMap[rawModuleName.toLowerCase()];
        }
        if (rawBrandName) {
          const key = `${rawBrandName.toLowerCase()}-${productData.moduleId}`;
          productData.brandId = createdBrandsMap[key];
        }

        return productData;
      });

      await bulkAddProducts(productsToCreate);
      alert(`Successfully imported ${draftProducts.length} products!`);
      onCancel();
    } catch (error) {
      console.error("Bulk import failed:", error);
      alert("Failed to import products. Please check the console for details.");
    } finally {
      setIsUploading(false);
    }
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
  const getModuleName = (draft: any) => draft.rawModuleName ? `${draft.rawModuleName} (New)` : (data.modules.find(m => m.id === draft.moduleId)?.name || 'Unknown Module');
  const getBrandName = (draft: any) => draft.rawBrandName ? `${draft.rawBrandName} (New)` : (data.brands.find(b => b.id === draft.brandId)?.name || 'Unknown Brand');

  // Render detail view
  if (viewingDraftId) {
    const draft = draftProducts.find(p => p.id === viewingDraftId);
    if (draft) {
      return (
        <div className="space-y-6">
          <DraftProductDetail
            product={draft}
            onBack={() => setViewingDraftId(null)}
            moduleName={getModuleName(draft)}
            brandName={getBrandName(draft)}
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
          {draftProducts.length === 0 && (
            <Button
              variant="outline"
              onClick={() => {
                const sampleData = [
                  {
                    "Product": "Solar PV Module",
                    "Brand Name": "SOLEX",
                    "Product Name": "TAPI TOPCON",
                    "MONO/BIFECIAL": "BIFECIAL",
                    "Model Number": "NONDCR",
                    "Wattage (W)": "615-625",
                    "Cell Type (Mono/Poly/Topcon/Bifacial)": "NTYPE TOPCON",
                    "Module Efficiency (%)": "23.14",
                    "No. of Cells": "132",
                    "Warranty (Product)": "12",
                    "Warranty (Performance)": "30",
                    "Price": "11070",
                    "Available Stock": "YES",
                    "Data sheet": "Attached"
                  },
                  {
                    "Product": "Solar PV Module",
                    "Brand Name": "SOLEX",
                    "Product Name": "TAPI MONO",
                    "MONO/BIFECIAL": "BIFECIAL",
                    "Model Number": "DCR",
                    "Wattage (W)": "545",
                    "Cell Type (Mono/Poly/Topcon/Bifacial)": "MONOperk BIFECIAL",
                    "Module Efficiency (%)": "21.1",
                    "No. of Cells": "144",
                    "Warranty (Product)": "12",
                    "Warranty (Performance)": "30",
                    "Price": "16500",
                    "Available Stock": "YES",
                    "Data sheet": "Attached"
                  },
                  {
                    "Product": "Solar PV Module",
                    "Brand Name": "WAAREE",
                    "Product Name": "ELITE SERIES",
                    "MONO/BIFECIAL": "BIFECIAL",
                    "Model Number": "NONDCR",
                    "Wattage (W)": "680-715",
                    "Cell Type (Mono/Poly/Topcon/Bifacial)": "NTYPE TOPCON",
                    "Module Efficiency (%)": "23.02",
                    "No. of Cells": "132",
                    "Warranty (Product)": "12",
                    "Warranty (Performance)": "30",
                    "Price": "13100",
                    "Available Stock": "YES",
                    "Data sheet": "Attached"
                  },
                  {
                    "Product": "Solar PV Module",
                    "Brand Name": "WAAREE",
                    "Product Name": "ELITE SERIES",
                    "MONO/BIFECIAL": "BIFECIAL",
                    "Model Number": "DCR",
                    "Wattage (W)": "560-590",
                    "Cell Type (Mono/Poly/Topcon/Bifacial)": "NTYPE TOPCON",
                    "Module Efficiency (%)": "22.84",
                    "No. of Cells": "144",
                    "Warranty (Product)": "12",
                    "Warranty (Performance)": "30",
                    "Price": "18000",
                    "Available Stock": "YES",
                    "Data sheet": "Attached"
                  },
                  {
                    "Product": "Solar PV Module",
                    "Brand Name": "PANASONIC",
                    "Product Name": "MONO",
                    "MONO/BIFECIAL": "BIFECIAL",
                    "Model Number": "DCR",
                    "Wattage (W)": "535-545",
                    "Cell Type (Mono/Poly/Topcon/Bifacial)": "MONOPERL BIFECIAL",
                    "Module Efficiency (%)": "21.13",
                    "No. of Cells": "144",
                    "Warranty (Product)": "12",
                    "Warranty (Performance)": "30",
                    "Price": "12100",
                    "Available Stock": "YES",
                    "Data sheet": "Attached"
                  },
                  {
                    "Product": "Solar PV Module",
                    "Brand Name": "PANASONIC",
                    "Product Name": "TOPCON",
                    "MONO/BIFECIAL": "BIFECIAL",
                    "Model Number": "NONDCR",
                    "Wattage (W)": "570-585",
                    "Cell Type (Mono/Poly/Topcon/Bifacial)": "NTYPE TOPCON",
                    "Module Efficiency (%)": "22.6",
                    "No. of Cells": "144",
                    "Warranty (Product)": "12",
                    "Warranty (Performance)": "30",
                    "Price": "10600",
                    "Available Stock": "YES",
                    "Data sheet": "Attached"
                  },
                  {
                    "Product": "Solar Module",
                    "Brand Name": "AXITEC",
                    "Product Name": "TOPCON",
                    "MONO/BIFECIAL": "BIFECIAL",
                    "Model Number": "NONDCR",
                    "Wattage (W)": "600",
                    "Cell Type (Mono/Poly/Topcon/Bifacial)": "NTYPE TOPCON",
                    "Module Efficiency (%)": "23.23",
                    "No. of Cells": "144",
                    "Warranty (Product)": "30",
                    "Warranty (Performance)": "30",
                    "Price": "11000",
                    "Available Stock": "YES",
                    "Data sheet": "Attached"
                  }
                ];

                // Programmatically trigger the same mapping logic
                const drafts = sampleData.map((row, index) => {
                  const normalizedRow: any = {};
                  Object.keys(row).forEach(key => {
                    normalizedRow[key.toLowerCase().trim()] = (row as any)[key];
                  });

                  const getVal = (variants: string[]) => {
                    for (const v of variants) {
                      const normalizedV = v.toLowerCase().trim();
                      if (normalizedRow[normalizedV] !== undefined && normalizedRow[normalizedV] !== null && normalizedRow[normalizedV] !== '') {
                        return normalizedRow[normalizedV];
                      }
                    }
                    return undefined;
                  };

                  const rawModuleName = String(getVal(['product']) || '').trim();
                  const rawBrandName = String(getVal(['brand name']) || '').trim();
                  const title = String(getVal(['product name']) || '').trim();

                  const specs: ProductSpecification[] = [];
                  const specMappings = [
                    { key: 'MONO/BIFECIAL', variants: ['mono/bifecial'] },
                    { key: 'Model Number', variants: ['model number'] },
                    { key: 'Wattage (W)', variants: ['wattage (w)'] },
                    { key: 'Cell Type (Mono/Poly/Topcon/Bifacial)', variants: ['cell type (mono/poly/topcon/bifacial)'] },
                    { key: 'Module Efficiency (%)', variants: ['module efficiency (%)'] },
                    { key: 'No. of Cells', variants: ['no. of cells'] },
                    { key: 'Warranty (Performance)', variants: ['warranty (performance)'] },
                    { key: 'Available Stock', variants: ['available stock'] },
                  ];

                  specMappings.forEach(mapping => {
                    const val = getVal(mapping.variants);
                    if (val !== undefined) {
                      specs.push({ key: mapping.key, value: String(val) });
                    }
                  });

                  // Force "Available Stock: YES" for Solar PV Modules in sample data
                  const isSolarModule = rawModuleName.toLowerCase().includes('solar pv module') || rawModuleName.toLowerCase().includes('solar module') || rawModuleName.toLowerCase().includes('panel');
                  if (isSolarModule && !specs.find(s => s.key === 'Available Stock')) {
                    specs.push({ key: 'Available Stock', value: 'YES' });
                  }

                  const price = parseFloat(normalizedRow.price || '0') || 0;
                  const capacity = String(normalizedRow['wattage (w)'] || '').trim();
                  const warranty = String(normalizedRow['warranty (product)'] || '').trim();

                  return {
                    id: `draft-sample-${index}`,
                    title,
                    description: `${title} by ${rawBrandName}. High-efficiency ${normalizedRow['cell type']} module.`,
                    images: [],
                    moduleId: defaultModuleId,
                    brandId: defaultBrandId,
                    rawModuleName,
                    rawBrandName,
                    specifications: specs,
                    benefits: ["High Efficiency", "Long Warranty", "Proven Reliability"],
                    applications: ["Residential Rooftop", "Commercial Projects", "Industrial"],
                    price,
                    capacity,
                    warranty,
                    datasheet: '',
                    isOutOfStock: false,
                    createdAt: new Date().toISOString(),
                  } as any;
                });

                setDraftProducts(drafts);
              }}
              className="text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100 gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" /> Load Screenshot Data
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
                            {getBrandName(draft)}
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
                        
                        <div className="flex items-center justify-center gap-2 py-2 mb-4">
                           <span className="text-gray-500 font-medium">Price:</span>
                           <span className="text-2xl font-bold text-emerald-600">
                             {draft.price > 0 ? `₹${draft.price.toLocaleString()}` : 'On Request'}
                           </span>
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
