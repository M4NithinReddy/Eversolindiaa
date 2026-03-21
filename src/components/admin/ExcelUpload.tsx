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
        if (!row.title) {
          throw new Error(`Row ${index + 2}: Title is required.`);
        }

        // Parse fields. If benefits/applications/specs are comma-separated strings, we split them.
        const parseStringArray = (val: string | undefined) => 
          val ? String(val).split(',').map(s => s.trim()).filter(Boolean) : [];

        // Simple specification parsing "key:value, key2:value2"
        const parseSpecifications = (val: string | undefined) => {
          if (!val) return [];
          return String(val).split(',').map(s => {
            const [key, ...rest] = s.split(':');
            return { key: key?.trim() || '', value: rest.join(':')?.trim() || '' };
          }).filter(s => s.key && s.value);
        };

        return {
          title: String(row.title || ''),
          description: String(row.description || ''),
          images: [], // Images usually cannot be uploaded via generic Excel, or URLs can be provided
          moduleId: String(row.moduleId || moduleId || ''),
          brandId: String(row.brandId || brandId || ''),
          subBrandId: row.subBrandId ? String(row.subBrandId) : undefined,
          price: parseFloat(row.price) || 0,
          capacity: String(row.capacity || ''),
          warranty: String(row.warranty || ''),
          datasheet: String(row.datasheet || ''),
          benefits: parseStringArray(row.benefits),
          applications: parseStringArray(row.applications),
          specifications: parseSpecifications(row.specifications),
        };
      });

      // Now pass this array to your API for bulk insertion.
      // E.g., bulkCreateProductsApi(products)
      // Since it's not directly in AdminContext yet, you might need to add bulkAddProducts to context
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
        Upload an .xlsx file containing columns like: title, description, moduleId, brandId, price, capacity, warranty, benefits, applications, specifications.
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
