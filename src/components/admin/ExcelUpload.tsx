import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useAdmin, AdminProduct } from '@/context/AdminContext';
import { useToast } from '@/components/ui/use-toast';

interface ExcelUploadProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  brandId?: string;
  moduleId?: string;
}

export const ExcelUpload = ({ onSuccess, onCancel, brandId, moduleId }: ExcelUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, productsBusy } = useAdmin();
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

      if (jsonData.length === 0) {
        throw new Error('The uploaded Excel file is empty.');
      }

      // Transform raw Excel rows into product objects
      const products: Omit<AdminProduct, 'id' | 'createdAt'>[] = jsonData.map((row, index) => {
        // Normalize keys
        const normalizedRow: any = {};
        Object.keys(row).forEach(key => {
          normalizedRow[key.toLowerCase().trim()] = row[key];
        });

        const getVal = (keys: string[]) => {
          for (const k of keys) {
            const normalizedKey = k.toLowerCase().trim();
            if (normalizedRow[normalizedKey] !== undefined && normalizedRow[normalizedKey] !== null && String(normalizedRow[normalizedKey]).trim() !== '') {
              return normalizedRow[normalizedKey];
            }
          }
          return undefined;
        };

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
          'image', 'images', 'img', 'subbrandid', 'subbrand', 'sub-brand',
          'benefits', 'benefit', 'applications', 'application', 'specifications', 'specs'
        ];

        const title = String(getVal(['model name', 'title', 'name', 'model', 'product name']) || `Imported Product ${index + 1}`).trim();
        const moduleIdVal = String(getVal(['product name', 'moduleId', 'category', 'module']) || moduleId || '');
        const brandIdVal = String(getVal(['brandId', 'brand']) || brandId || '');

        const specs: { key: string; value: string }[] = [];
        Object.keys(row).forEach(originalKey => {
          const k = originalKey.toLowerCase().trim();
          if (!usedKeys.includes(k) && row[originalKey] !== undefined && row[originalKey] !== null && String(row[originalKey]).trim() !== '') {
            specs.push({ key: originalKey, value: String(row[originalKey]).trim() });
          }
        });

        return {
          title,
          description: String(getVal(['description', 'about', 'info']) || ''),
          images: [],
          moduleId: moduleIdVal,
          brandId: brandIdVal,
          subBrandId: normalizedRow.subbrandid ? String(normalizedRow.subbrandid) : undefined,
          price: parseFloat(getVal(['total price', 'price', 'mrp', 'cost']) || '0') || 0,
          capacity: String(getVal(['capacity', 'capacity (kwh/ah)']) || ''),
          warranty: String(getVal(['warranty', 'guarantee']) || ''),
          datasheet: String(getVal(['datasheet', 'manual', 'pdf']) || ''),
          benefits: String(getVal(['benefits', 'benefit', 'features']) || '').split(',').map(s => s.trim()).filter(Boolean),
          applications: String(getVal(['applications', 'application', 'compatible inverters']) || '').split(',').map(s => s.trim()).filter(Boolean),
          specifications: specs,
        };
      });

      // Now pass this array to your API for bulk insertion.
      // E.g., bulkCreateProductsApi(products)
      // Or simply iterate:
      
      // For demonstration if bulk API is not in context:
      // await bulkCreateProductsApi(products);
      
      // Since we don't have the bulk action exported from useAdmin, we simulate or you need to add it.
      // If we iterate (slow for many products):
      /*
      for (const product of products) {
         await addProduct(product); // Assuming addProduct is from useAdmin()
      }
      */
      
      toast({
        title: "Success",
        description: `Successfully parsed ${products.length} products. You need to link your bulk upload API here.`,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Excel Parsing error:', err);
      setError(err.message || 'Failed to process Excel file. Please check the format.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50">
      <div className="mb-4 bg-emerald-100 p-3 rounded-full text-emerald-600">
        <FileSpreadsheet className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload Product Data via Excel</h3>
      <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
        Upload an .xlsx file containing columns like: title, description, moduleId, brandId, price, system size, warranty, benefits, applications, specifications.
      </p>

      {error && (
        <div className="mb-4 w-full p-3 bg-red-50 text-red-600 text-sm flex items-start gap-2 rounded-md">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isUploading || productsBusy}>
            Cancel
          </Button>
        )}
        <Button 
          onClick={() => fileInputRef.current?.click()} 
          disabled={isUploading || productsBusy}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
        >
          {isUploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
          ) : (
            <><Upload className="w-4 h-4" /> Select Excel File</>
          )}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default ExcelUpload;
