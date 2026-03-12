import { useState, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle, Table2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewRow {
  [key: string]: string | number;
}

const REQUIRED_COLUMNS = ['Brand', 'Module', 'Product', 'Price'];

const ExcelUploader = () => {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Only .xlsx or .xls files are accepted.');
      setFileName(null);
      setPreview([]);
      return;
    }
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: PreviewRow[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (rows.length === 0) {
          setError('The file appears to be empty.');
          return;
        }

        const cols = Object.keys(rows[0]);
        setHeaders(cols);
        setPreview(rows.slice(0, 20));
      } catch {
        setError('Failed to parse the file. Make sure it is a valid Excel file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const reset = () => {
    setFileName(null);
    setPreview([]);
    setHeaders([]);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      REQUIRED_COLUMNS,
      ['Solar Brand A', 'Solar Panels', 'Panel X 550W', 45000],
      ['Solar Brand B', 'Inverters', 'Inverter Y 5kW', 32000],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'catalog_template.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Excel Import</h2>
          <p className="text-sm text-gray-500 mt-0.5">Upload a spreadsheet to preview your product catalog</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadTemplate}
          className="gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        >
          <Download className="w-4 h-4" /> Download Template
        </Button>
      </div>

      {/* Drop Zone */}
      <motion.div
        animate={{ scale: dragging ? 1.01 : 1 }}
        transition={{ duration: 0.15 }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !fileName && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? 'border-emerald-400 bg-emerald-50'
            : fileName
            ? 'border-emerald-300 bg-emerald-50/50 cursor-default'
            : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={onFileChange}
        />

        {fileName ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
              <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{fileName}</p>
              <p className="text-xs text-gray-500 mt-0.5">{preview.length} rows loaded (showing first 20)</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={e => { e.stopPropagation(); reset(); }}
              className="text-gray-400 hover:text-red-500 gap-1"
            >
              <X className="w-4 h-4" /> Remove
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
              <Upload className="w-7 h-7 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Drag & drop your Excel file here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse — .xlsx / .xls only</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Table */}
      <AnimatePresence>
        {preview.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Table2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-semibold text-gray-700">Preview (first {preview.length} rows)</h3>
            </div>

            <div className="rounded-xl border border-gray-200 overflow-auto max-h-80 shadow-sm">
              <table className="w-full text-xs min-w-max">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2 text-left text-gray-400 font-medium w-10">#</th>
                    {headers.map(h => (
                      <th key={h} className={`px-3 py-2 text-left font-semibold ${
                        REQUIRED_COLUMNS.includes(h) ? 'text-emerald-700' : 'text-gray-600'
                      }`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-1.5 text-gray-400">{i + 1}</td>
                      {headers.map(h => (
                        <td key={h} className="px-3 py-1.5 text-gray-700 max-w-[200px] truncate">
                          {String(row[h] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Import Button (disabled — backend not ready) */}
            <div className="flex items-center gap-3 pt-1">
              <Button
                disabled
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 opacity-50 cursor-not-allowed"
              >
                {importing
                  ? <><span className="animate-spin">⏳</span> Importing…</>
                  : <><CheckCircle2 className="w-4 h-4" /> Import to Database</>
                }
              </Button>
              <p className="text-xs text-gray-400">Import will be enabled once the Products API is ready.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExcelUploader;
