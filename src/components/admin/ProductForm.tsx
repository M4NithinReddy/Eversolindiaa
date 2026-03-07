import { useState, useRef } from 'react';
import { useAdmin, AdminProduct, ProductSpecification } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Upload, X, Image as ImageIcon, Save, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductFormProps {
  moduleId: string;
  brandId: string;
  subBrandId?: string;
  editProduct?: AdminProduct;
  onCancel: () => void;
  onSaved: () => void;
}

const ProductForm = ({ moduleId, brandId, subBrandId, editProduct, onCancel, onSaved }: ProductFormProps) => {
  const { data, addProduct, updateProduct } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(editProduct?.title || '');
  const [description, setDescription] = useState(editProduct?.description || '');
  const [images, setImages] = useState<string[]>(editProduct?.images || []);
  const [specifications, setSpecifications] = useState<ProductSpecification[]>(
    editProduct?.specifications || [{ key: '', value: '' }]
  );
  const [benefits, setBenefits] = useState<string[]>(editProduct?.benefits || ['']);
  const [applications, setApplications] = useState<string[]>(editProduct?.applications || ['']);
  const [price, setPrice] = useState(editProduct?.price?.toString() || '0');
  const [capacity, setCapacity] = useState(editProduct?.capacity || '');
  const [warranty, setWarranty] = useState(editProduct?.warranty || '');
  const [datasheet, setDatasheet] = useState(editProduct?.datasheet || '');
  const [selectedModuleId, setSelectedModuleId] = useState(editProduct?.moduleId || moduleId);
  const [selectedBrandId, setSelectedBrandId] = useState(editProduct?.brandId || brandId);
  const [selectedSubBrandId, setSelectedSubBrandId] = useState(editProduct?.subBrandId || subBrandId || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Specifications
  const addSpec = () => setSpecifications(prev => [...prev, { key: '', value: '' }]);
  const removeSpec = (index: number) => setSpecifications(prev => prev.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    setSpecifications(prev => prev.map((s, i) => (i === index ? { ...s, [field]: val } : s)));
  };

  // Benefits
  const addBenefit = () => setBenefits(prev => [...prev, '']);
  const removeBenefit = (index: number) => setBenefits(prev => prev.filter((_, i) => i !== index));
  const updateBenefit = (index: number, val: string) => {
    setBenefits(prev => prev.map((b, i) => (i === index ? val : b)));
  };

  // Applications
  const addApplication = () => setApplications(prev => [...prev, '']);
  const removeApplication = (index: number) => setApplications(prev => prev.filter((_, i) => i !== index));
  const updateApplication = (index: number, val: string) => {
    setApplications(prev => prev.map((a, i) => (i === index ? val : a)));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const productData = {
      title: title.trim(),
      description: description.trim(),
      images,
      moduleId: selectedModuleId,
      brandId: selectedBrandId,
      subBrandId: selectedSubBrandId || undefined,
      specifications: specifications.filter(s => s.key.trim() && s.value.trim()),
      benefits: benefits.filter(b => b.trim()),
      applications: applications.filter(a => a.trim()),
      price: parseFloat(price) || 0,
      capacity: capacity.trim(),
      warranty: warranty.trim(),
      datasheet: datasheet.trim(),
    };

    if (editProduct) {
      updateProduct(editProduct.id, productData);
    } else {
      addProduct(productData);
    }
    onSaved();
  };

  const filteredBrands = data.brands.filter(b => b.moduleId === selectedModuleId);
  const filteredSubBrands = data.subBrands.filter(sb => sb.brandId === selectedBrandId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h2 className="text-xl font-bold text-gray-900">
          {editProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>

      {/* Image Upload */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-900 text-sm flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-500" />
            Product Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-400 flex flex-col items-center justify-center text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <Upload className="w-6 h-6 mb-1" />
              <span className="text-xs">Upload</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-900 text-sm">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-600 text-xs mb-1.5 block">Module</Label>
              <Select value={selectedModuleId} onValueChange={v => { setSelectedModuleId(v); setSelectedBrandId(''); setSelectedSubBrandId(''); }}>
                <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {data.modules.map(m => (
                    <SelectItem key={m.id} value={m.id} className="text-gray-900 hover:bg-gray-50">{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-600 text-xs mb-1.5 block">Brand</Label>
              <Select value={selectedBrandId} onValueChange={v => { setSelectedBrandId(v); setSelectedSubBrandId(''); }}>
                <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {filteredBrands.map(b => (
                    <SelectItem key={b.id} value={b.id} className="text-gray-900 hover:bg-gray-50">{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredSubBrands.length > 0 && (
            <div>
              <Label className="text-gray-600 text-xs mb-1.5 block">Sub-brand (optional)</Label>
              <Select value={selectedSubBrandId} onValueChange={setSelectedSubBrandId}>
                <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select sub-brand (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="none" className="text-gray-400 hover:bg-gray-50">None</SelectItem>
                  {filteredSubBrands.map(sb => (
                    <SelectItem key={sb.id} value={sb.id} className="text-gray-900 hover:bg-gray-50">{sb.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-gray-600 text-xs mb-1.5 block">Product Title *</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter product title"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div>
            <Label className="text-gray-600 text-xs mb-1.5 block">Description</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={4}
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-600 text-xs mb-1.5 block">Price (₹)</Label>
              <Input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0"
                className="bg-gray-50 border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-600 text-xs mb-1.5 block">Capacity</Label>
              <Input
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
                placeholder="e.g., 550W"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label className="text-gray-600 text-xs mb-1.5 block">Warranty</Label>
              <Input
                value={warranty}
                onChange={e => setWarranty(e.target.value)}
                placeholder="e.g., 12 Years"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-600 text-xs mb-1.5 block">Datasheet URL</Label>
            <Input
              value={datasheet}
              onChange={e => setDatasheet(e.target.value)}
              placeholder="https://..."
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Key Specifications */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900 text-sm">Key Specifications</CardTitle>
          <Button size="sm" variant="ghost" onClick={addSpec} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1 h-7">
            <Plus className="w-3 h-3" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {specifications.map((spec, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <Input
                value={spec.key}
                onChange={e => updateSpec(idx, 'key', e.target.value)}
                placeholder="Specification name"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 flex-1"
              />
              <Input
                value={spec.value}
                onChange={e => updateSpec(idx, 'value', e.target.value)}
                placeholder="Value"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 flex-1"
              />
              {specifications.length > 1 && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeSpec(idx)}
                  className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900 text-sm">Benefits</CardTitle>
          <Button size="sm" variant="ghost" onClick={addBenefit} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1 h-7">
            <Plus className="w-3 h-3" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <Input
                value={benefit}
                onChange={e => updateBenefit(idx, e.target.value)}
                placeholder="Enter a benefit"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 flex-1"
              />
              {benefits.length > 1 && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeBenefit(idx)}
                  className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Applications */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900 text-sm">Applications</CardTitle>
          <Button size="sm" variant="ghost" onClick={addApplication} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1 h-7">
            <Plus className="w-3 h-3" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {applications.map((app, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <Input
                value={app}
                onChange={e => updateApplication(idx, e.target.value)}
                placeholder="Enter an application"
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 flex-1"
              />
              {applications.length > 1 && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeApplication(idx)}
                  className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          disabled={!title.trim() || !selectedBrandId}
        >
          <Save className="w-4 h-4" />
          {editProduct ? 'Update Product' : 'Save Product'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductForm;
