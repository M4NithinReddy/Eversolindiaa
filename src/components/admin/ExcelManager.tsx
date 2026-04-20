import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useAdmin, AdminProduct, ProductSpecification } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Save, FileSpreadsheet, Pencil, Eye, ImageIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductForm from './ProductForm';
import DraftProductDetail from './DraftProductDetail';

interface ExcelManagerProps {
  onCancel: () => void;
}

const ExcelManager = ({ onCancel }: ExcelManagerProps) => {
  const { data, addProduct, addModule, addBrand } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draftProducts, setDraftProducts] = useState<AdminProduct[]>([]);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [viewingDraftId, setViewingDraftId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [saveProgress, setSaveProgress] = useState<{ done: number; total: number } | null>(null);

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
          const normalizedRow: any = {};
          Object.keys(row).forEach(key => {
            normalizedRow[key.toLowerCase().trim()] = row[key];
          });

          const getVal = (variants: string[]) => {
            for (const v of variants) {
              const normalizedV = v.toLowerCase().trim();
              if (normalizedRow[normalizedV] !== undefined && normalizedRow[normalizedV] !== null && String(normalizedRow[normalizedV]).trim() !== '') {
                return normalizedRow[normalizedV];
              }
            }
            return undefined;
          };

          const title = String(getVal(['product name', 'title', 'name', 'model', 'model name']) || `Imported Product ${index + 1}`).trim();
          const description = String(getVal(['description', 'features', 'about', 'info']) || '').trim();
          const price = parseFloat(String(getVal(['price', 'total price', 'mrp', 'cost']) || '0').replace(/[^0-9.]/g, '')) || 0;
          const capacity = String(getVal(['capacity', 'wattage (w)', 'capacity (kwh/ah)', 'size', 'power', 'system size (kw)']) || '').trim();
          const warranty = String(getVal(['warranty', 'guarantee', 'warranty (product)', 'installation warranty']) || '').trim();
          const productType = String(getVal(['type', 'product type', 'inverter type', 'battery type']) || '').trim();
          const phase = String(getVal(['phase', 'phase (single/three phase)']) || '').trim();
          const datasheet = String(getVal(['datasheet', 'manual', 'pdf', 'data sheet']) || '').trim();
          const isOutOfStock = String(getVal(['available stock', 'stock']) || '').toLowerCase() === 'no';

          let rawModuleName = String(getVal(['category', 'module', 'module name', 'product']) || '').trim();
          if (!rawModuleName || rawModuleName.toLowerCase() === 'solar modules') {
            rawModuleName = 'Eversol Roof Top Kit';
          }
          const rawBrandName = String(getVal(['brand name', 'brand']) || '').trim();

          let moduleId = '';
          let brandId = '';

          // Match existing module
          if (rawModuleName) {
            const mod = data.modules.find(m => m.name.toLowerCase() === rawModuleName.toLowerCase());
            if (mod) moduleId = mod.id;
          }

          // Match existing brand ONLY within the same module
          if (rawBrandName && moduleId) {
            const brand = data.brands.find(b =>
              b.name.toLowerCase() === rawBrandName.toLowerCase() &&
              b.moduleId === moduleId
            );
            if (brand) brandId = brand.id;
          }

          // We always want to pass the raw names if present, 
          // handleSaveAll will use them to ensure everything is created/matched correctly.
          const isModuleNew = rawModuleName && !moduleId;
          const isBrandNew = rawBrandName && !brandId;

          const usedKeys = [
            'model name', 'product name', 'title', 'name', 'model',
            'description', 'features', 'about', 'info',
            'price', 'mrp', 'cost', 'total price',
            'capacity', 'capacity (kwh/ah)', 'size', 'power', 'wattage (w)', 'system size (kw)',
            'warranty', 'guarantee', 'warranty (product)', 'installation warranty',
            'type', 'product type', 'inverter type', 'battery type',
            'phase', 'phase (single/three phase)',
            'datasheet', 'manual', 'pdf', 'data sheet',
            'category', 'module', 'module name', 'product',
            'brand', 'brand name', 'available stock', 'stock',
            'image', 'images', 'img',
            'benefits', 'key benefits', 'key benifits', 'applications', 'application'
          ];

          const specs: ProductSpecification[] = [];

          // Map standard specifications from spec mappings
          const specMappings = [
            { key: 'MONO/BIFECIAL', variants: ['mono/bifecial', 'mono bifecial'] },
            { key: 'Model Number', variants: ['model number', 'model nr'] },
            { key: 'No. of Cells', variants: ['no. of cells', 'no. of cel', 'cells'] },
            { key: 'Module Efficiency (%)', variants: ['module efficiency (%)', 'module efficiency', 'efficiency'] },
            { key: 'Available Stock', variants: ['available stock', 'stock'] },
            { key: 'Included Module Brand', variants: ['included module brand'] },
            { key: 'Included Inverter Brand', variants: ['included inverter brand'] },
            { key: 'Structure Type', variants: ['structure type'] },
            { key: 'Area Required', variants: ['area required (sq.ft)', 'area required'] },
            { key: 'Subsidy Eligible', variants: ['subsidy eligible (yes/no)', 'subsidy eligible'] },
            { key: 'Installation Included', variants: ['installation included (yes/no)', 'installation included'] },
            { key: 'Meters', variants: ['meters'] }
          ];

          specMappings.forEach(mapping => {
            const val = getVal(mapping.variants);
            if (val !== undefined) {
              specs.push({ key: mapping.key, value: String(val) });
            }
          });

          // Add any other non-standard columns as specs
          Object.keys(row).forEach(originalKey => {
            const k = originalKey.toLowerCase().trim();
            if (!usedKeys.includes(k) && !specMappings.some(m => m.variants.includes(k)) && row[originalKey] !== undefined && row[originalKey] !== null && String(row[originalKey]).trim() !== '') {
              if (!specs.find(s => s.key === originalKey)) {
                specs.push({ key: originalKey, value: String(row[originalKey]).trim() });
              }
            }
          });

          // Handle special case for Solar Modules
          const isSolarModule = rawModuleName.toLowerCase().includes('module') || rawModuleName.toLowerCase().includes('panel');
          if (isSolarModule && !specs.find(s => s.key === 'Available Stock')) {
            specs.push({ key: 'Available Stock', value: 'YES' });
          }

          let benefits: string[] = [];
          const excelBenefits = getVal(['benefits', 'benefit', 'features', 'key benefits', 'key benifits']);
          if (excelBenefits) {
            benefits = String(excelBenefits).split(/[,\*]/).map(s => s.trim()).filter(Boolean);
          }

          let applications: string[] = [];
          const excelApps = getVal(['applications', 'application', 'compatible inverters']);
          if (excelApps) {
            applications = String(excelApps).split(/[,\*]/).map(s => s.trim()).filter(Boolean);
          }

          return {
            id: `draft-${Date.now()}-${index}`,
            title,
            description,
            images: normalizedRow.image ? [normalizedRow.image] : (normalizedRow.images ? String(normalizedRow.images).split(',') : []),
            moduleId: moduleId || defaultModuleId,
            brandId: brandId || defaultBrandId,
            rawModuleName: rawModuleName || undefined,
            rawBrandName: rawBrandName || undefined,
            specifications: specs,
            benefits,
            applications,
            price,
            capacity,
            phase,
            warranty,
            productType,
            datasheet,
            isOutOfStock,
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
    const total = draftProducts.length;
    setSaveProgress({ done: 0, total });
    let successCount = 0;
    const errors: string[] = [];

    // Cache newly created module/brand IDs within this import session
    // so we don't create duplicates for multiple products from the same sheet
    const moduleIdCache: Record<string, string> = {}; // rawName.lower -> id
    const brandIdCache: Record<string, string> = {};  // rawName.lower|moduleId -> id

    for (let i = 0; i < draftProducts.length; i++) {
      const draft = draftProducts[i] as any;
      try {
        let resolvedModuleId: string = draft.moduleId || '';
        let resolvedBrandId: string = draft.brandId || '';

        // ── Auto-create Module if it's new ──────────────────────────────────
        if (draft.rawModuleName) {
          const key = draft.rawModuleName.toLowerCase();
          if (moduleIdCache[key]) {
            resolvedModuleId = moduleIdCache[key];
          } else {
            // Double-check in live data (might have been added earlier)
            const existing = data.modules.find(
              m => m.name.toLowerCase() === key
            );
            if (existing) {
              resolvedModuleId = existing.id;
            } else {
              const created = await addModule(draft.rawModuleName);
              resolvedModuleId = created.id;
            }
            moduleIdCache[key] = resolvedModuleId;
          }
        }

        // ── Auto-create Brand if it's new ────────────────────────────────────
        if (draft.rawBrandName) {
          const key = `${draft.rawBrandName.toLowerCase()}|${resolvedModuleId}`;
          if (brandIdCache[key]) {
            resolvedBrandId = brandIdCache[key];
          } else {
            const existing = data.brands.find(
              b =>
                b.name.toLowerCase() === draft.rawBrandName.toLowerCase() &&
                b.moduleId === resolvedModuleId
            );
            if (existing) {
              resolvedBrandId = existing.id;
            } else {
              const created = await addBrand(draft.rawBrandName, resolvedModuleId);
              resolvedBrandId = created.id;
            }
            brandIdCache[key] = resolvedBrandId;
          }
        }

        // ── Save the product with resolved IDs ───────────────────────────────
        await addProduct({
          title: draft.title || 'Untitled',
          description: draft.description || '',
          images: draft.images || [],
          moduleId: resolvedModuleId,
          brandId: resolvedBrandId,
          subBrandId: draft.subBrandId,
          specifications: draft.specifications || [],
          benefits: draft.benefits || [],
          applications: draft.applications || [],
          price: draft.price || 0,
          capacity: draft.capacity || '',
          phase: draft.phase,
          warranty: draft.warranty || '',
          datasheet: draft.datasheet || '',
          productType: draft.productType,
          isOutOfStock: draft.isOutOfStock || false,
        });
        successCount++;
      } catch (err: any) {
        console.error(`Failed to save product "${draft.title}":`, err);
        errors.push(draft.title);
      }
      setSaveProgress({ done: i + 1, total });
    }

    setIsUploading(false);
    setSaveProgress(null);

    if (errors.length === 0) {
      alert(`✅ Successfully imported all ${successCount} products!`);
      onCancel();
    } else {
      alert(`⚠️ Imported ${successCount} of ${total} products.\nFailed: ${errors.join(', ')}`);
      if (successCount > 0) onCancel();
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
          <Button variant="outline" onClick={() => {
            const sampleData: any[] = [
              { title: "Solar on grid System", brand: "EVERSOL DCR 3kW 545X6", systemSize: "3", phase: "1Phase", price: 132000, warranty: "30Years Module, 10years In...", module: "Eversol Roof Top Kit", specs: [["Included Module Brand", "SOLEX/WAAREE/PANASON"], ["Included Inverter Brand", "INVOLTICS / SOLPLANET/GOOD"], ["Structure Type", "GI / Aluminam"], ["Area Required", "200"], ["Subsidy Eligible (Yes/No)", "YES"], ["Installation Included (Yes/No)", "At Actual"], ["Meters", "At Actual"]] },
              { title: "Solar on grid System", brand: "EVERSOL DCR 3.5kW 590X6", systemSize: "3.5", phase: "1Phase", price: 159000, warranty: "30Years Module, 10years In...", module: "Eversol Roof Top Kit", specs: [["Included Module Brand", "SOLEX/WAAREE/PANASON"], ["Included Inverter Brand", "INVOLTICS / SOLPLANET/GOOD"], ["Structure Type", "GI / Aluminam"], ["Area Required", "200"], ["Subsidy Eligible (Yes/No)", "YES"], ["Installation Included (Yes/No)", "At Actual"], ["Meters", "At Actual"]] },
              { title: "Solar on grid System", brand: "EVERSOL DCR 5kW 545X9", systemSize: "5", phase: "1Phase", price: 199000, warranty: "30Years Module, 10years In...", module: "Eversol Roof Top Kit", specs: [["Included Module Brand", "SOLEX/WAAREE/PANASON"], ["Included Inverter Brand", "INVOLTICS / SOLPLANET/GOOD"], ["Structure Type", "GI / Aluminam"], ["Area Required", "400"], ["Subsidy Eligible (Yes/No)", "YES"], ["Installation Included (Yes/No)", "At Actual"], ["Meters", "At Actual"]] },
              { title: "Solar on grid System", brand: "EVERSOL DCR 5kW 390X9", systemSize: "5", phase: "3Phase", price: 225000, warranty: "30Years Module, 10years In...", module: "Eversol Roof Top Kit", specs: [["Included Module Brand", "SOLEX/WAAREE/PANASON"], ["Included Inverter Brand", "INVOLTICS / SOLPLANET/GOOD"], ["Structure Type", "GI / Aluminam"], ["Area Required", "400"], ["Subsidy Eligible (Yes/No)", "YES"], ["Installation Included (Yes/No)", "At Actual"], ["Meters", "At Actual"]] },
              { title: "Solar on grid System", brand: "EVERSOL NON DCR 3kW 615X", systemSize: "3", phase: "1Phase", price: 102000, warranty: "30Years Module, 10years In...", module: "Eversol Roof Top Kit", specs: [["Included Module Brand", "SOLEX/WAAREE/PANASON"], ["Included Inverter Brand", "INVOLTICS / SOLPLANET/GOOD"], ["Structure Type", "GI / Aluminam"], ["Area Required", "200"], ["Subsidy Eligible (Yes/No)", "NO"], ["Installation Included (Yes/No)", "At Actual"], ["Meters", "At Actual"]] },
              { title: "Solar on grid System", brand: "EVERSOL NON DCR 4kW 615X", systemSize: "4", phase: "1Phase", price: 140000, warranty: "30Years Module, 10years In...", module: "Eversol Roof Top Kit", specs: [["Included Module Brand", "SOLEX/WAAREE/PANASON"], ["Included Inverter Brand", "INVOLTICS / SOLPLANET/GOOD"], ["Structure Type", "GI / Aluminam"], ["Area Required", "400"], ["Subsidy Eligible (Yes/No)", "NO"], ["Installation Included (Yes/No)", "At Actual"], ["Meters", "At Actual"]] },
              { title: "Solar on grid System", brand: "EVERSOL NON DCR 5kW 615x", systemSize: "5", phase: "1Phase", price: 159000, warranty: "30Years Module, 10years In...", module: "Eversol Roof Top Kit", specs: [["Included Module Brand", "SOLEX/WAAREE/PANASON"], ["Included Inverter Brand", "INVOLTICS / SOLPLANET/GOOD"], ["Structure Type", "GI / Aluminam"], ["Area Required", "400"], ["Subsidy Eligible (Yes/No)", "NO"], ["Installation Included (Yes/No)", "At Actual"], ["Meters", "At Actual"]] },
              { title: "Solar on grid System", brand: "EVERSOL NON DCR 5kW 615x", systemSize: "5", phase: "3Phase", price: 180000, warranty: "30Years Module, 10years In...", module: "Eversol Roof Top Kit", specs: [["Included Module Brand", "SOLEX/WAAREE/PANASON"], ["Included Inverter Brand", "INVOLTICS / SOLPLANET/GOOD"], ["Structure Type", "GI / Aluminam"], ["Area Required", "400"], ["Subsidy Eligible (Yes/No)", "NO"], ["Installation Included (Yes/No)", "At Actual"], ["Meters", "At Actual"]] },
              { title: "Solar on grid System", brand: "EVERSOL NON DCR 6kW 615X", systemSize: "6", phase: "3Phase", price: 205000, warranty: "30Years Module, 10years In...", module: "Eversol Roof Top Kit", specs: [["Included Module Brand", "SOLEX/WAAREE/PANASON"], ["Included Inverter Brand", "INVOLTICS / SOLPLANET/GOOD"], ["Structure Type", "GI / Aluminam"], ["Area Required", "400"], ["Subsidy Eligible (Yes/No)", "NO"], ["Installation Included (Yes/No)", "At Actual"], ["Meters", "At Actual"]] },
              { title: "Solar on grid System", brand: "EVERSOL NON DCR 8kW 615X", systemSize: "8", phase: "3Phase", price: 252000, warranty: "30Years Module, 10years In...", module: "Eversol Roof Top Kit", specs: [["Included Module Brand", "SOLEX/WAAREE/PANASON"], ["Included Inverter Brand", "INVOLTICS / SOLPLANET/GOOD"], ["Structure Type", "GI / Aluminam"], ["Area Required", "600"], ["Subsidy Eligible (Yes/No)", "NO"], ["Installation Included (Yes/No)", "At Actual"], ["Meters", "At Actual"]] },
              { title: "Solar on grid System", brand: "EVERSOL NON DCR 10kW 615", systemSize: "10", phase: "3Phase", price: 285000, warranty: "30Years Module, 10years In...", module: "Eversol Roof Top Kit", specs: [["Included Module Brand", "SOLEX/WAAREE/PANASON"], ["Included Inverter Brand", "INVOLTICS / SOLPLANET/GOOD"], ["Structure Type", "GI / Aluminam"], ["Area Required", "800"], ["Subsidy Eligible (Yes/No)", "NO"], ["Installation Included (Yes/No)", "At Actual"], ["Meters", "At Actual"]] },
            ];

            const drafts: AdminProduct[] = sampleData.map((d, index) => {
              let moduleId = '';
              let brandId = '';
              if (d.module) {
                const mod = data.modules.find(m => m.name.toLowerCase() === d.module.toLowerCase());
                if (mod) moduleId = mod.id;
              }
              if (d.brand && moduleId) {
                const brand = data.brands.find(b => b.name.toLowerCase() === d.brand.toLowerCase() && b.moduleId === moduleId);
                if (brand) brandId = brand.id;
              }

              return {
                id: `sample-${index}`,
                title: d.title,
                description: "High-quality Solar On-Grid System with premium components including Module, Inverter, DCDB, ACDB, Earthing Kit, and GI Structure.",
                images: [],
                moduleId: moduleId || defaultModuleId,
                brandId: brandId || defaultBrandId,
                rawModuleName: d.module,
                rawBrandName: d.brand,
                specifications: d.specs.map(([k, v]: any) => ({ key: k, value: v })),
                benefits: ["Eco-friendly energy", "Reduce electricity bills", "Low maintenance"],
                applications: ["Residential", "Commercial", "Industrial"],
                price: d.price,
                capacity: d.systemSize,
                phase: d.phase,
                warranty: d.warranty,
                createdAt: new Date().toISOString(),
              } as any;
            });
            setDraftProducts(drafts);
          }} className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 gap-2">
            <Plus className="w-4 h-4" /> Load Screenshot Data
          </Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          {draftProducts.length > 0 && (
            <Button onClick={handleSaveAll} disabled={isUploading} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Save className="w-4 h-4" />
              {saveProgress
                ? `Saving ${saveProgress.done} / ${saveProgress.total}…`
                : `Import ${draftProducts.length} Products`
              }
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

                  let moduleId = '';
                  let brandId = '';
                  if (rawModuleName) {
                    const mod = data.modules.find(m => m.name.toLowerCase() === rawModuleName.toLowerCase());
                    if (mod) moduleId = mod.id;
                  }
                  if (rawBrandName && moduleId) {
                    const brand = data.brands.find(b => b.name.toLowerCase() === rawBrandName.toLowerCase() && b.moduleId === moduleId);
                    if (brand) brandId = brand.id;
                  }

                  return {
                    id: `draft-sample-${index}`,
                    title,
                    description: `${title} by ${rawBrandName}. High-efficiency ${normalizedRow['cell type']} module.`,
                    images: [],
                    moduleId: moduleId || defaultModuleId,
                    brandId: brandId || defaultBrandId,
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
                          {draft.phase && (
                            <div>
                              <span className="text-gray-500 block">Phase</span>
                              <span className="font-medium text-gray-900 line-clamp-1">{draft.phase}</span>
                            </div>
                          )}
                          {draft.warranty && (
                            <div>
                              <span className="text-gray-500 block">Warranty</span>
                              <span className="font-medium text-gray-900 line-clamp-1 truncate" title={draft.warranty}>{draft.warranty}</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 text-gray-600 border-gray-200 hover:bg-gray-50"
                            onClick={() => setViewingDraftId(draft.id)}
                          >
                            <Eye className="w-4 h-4" /> View
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
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
