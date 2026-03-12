import { useState } from 'react';
import { useAdmin, AdminBrand, AdminSubBrand } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Tags, ChevronDown, ChevronRight, Layers, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrandManagerProps {
  moduleId: string;
  moduleName: string;
  onSelectBrand: (brand: AdminBrand) => void;
  selectedBrandId?: string;
  onSelectSubBrand?: (subBrand: AdminSubBrand | null) => void;
  selectedSubBrandId?: string;
}

const BrandManager = ({
  moduleId,
  moduleName,
  onSelectBrand,
  selectedBrandId,
  onSelectSubBrand,
  selectedSubBrandId,
}: BrandManagerProps) => {
  const {
    data,
    addBrand, updateBrand, deleteBrand,
    addSubBrand, updateSubBrand, deleteSubBrand,
    brandsLoading, brandsError, brandsBusy,
  } = useAdmin();

  const [newBrandName, setNewBrandName] = useState('');
  const [createBrandOpen, setCreateBrandOpen] = useState(false);
  const [editBrandId, setEditBrandId] = useState<string | null>(null);
  const [editBrandName, setEditBrandName] = useState('');
  const [editBrandOpen, setEditBrandOpen] = useState(false);
  const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null);

  const [newSubBrandName, setNewSubBrandName] = useState('');
  const [subBrandParent, setSubBrandParent] = useState<string | null>(null);
  const [createSubOpen, setCreateSubOpen] = useState(false);
  const [editSubId, setEditSubId] = useState<string | null>(null);
  const [editSubName, setEditSubName] = useState('');
  const [editSubOpen, setEditSubOpen] = useState(false);
  const [expandedBrandId, setExpandedBrandId] = useState<string | null>(null);

  const brands = data.brands.filter(b => b.moduleId === moduleId);

  const handleCreateBrand = async () => {
    if (newBrandName.trim()) {
      await addBrand(newBrandName.trim(), moduleId);
      setNewBrandName('');
      setCreateBrandOpen(false);
    }
  };

  const handleUpdateBrand = async () => {
    if (editBrandId && editBrandName.trim()) {
      await updateBrand(editBrandId, editBrandName.trim());
      setEditBrandId(null);
      setEditBrandName('');
      setEditBrandOpen(false);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    setDeletingBrandId(id);
    await deleteBrand(id);
    setDeletingBrandId(null);
  };

  const handleCreateSubBrand = () => {
    if (newSubBrandName.trim() && subBrandParent) {
      addSubBrand(newSubBrandName.trim(), subBrandParent);
      setNewSubBrandName('');
      setCreateSubOpen(false);
      setSubBrandParent(null);
    }
  };

  const handleUpdateSubBrand = () => {
    if (editSubId && editSubName.trim()) {
      updateSubBrand(editSubId, editSubName.trim());
      setEditSubId(null);
      setEditSubName('');
      setEditSubOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Tags className="w-5 h-5 text-blue-600" />
          Brands
          <span className="text-xs font-normal text-gray-400">in {moduleName}</span>
          {brandsLoading && <Loader2 className="w-4 h-4 text-blue-400 animate-spin ml-1" />}
        </h2>
        <Dialog open={createBrandOpen} onOpenChange={setCreateBrandOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1"
              disabled={brandsLoading || brandsBusy}
            >
              <Plus className="w-4 h-4" /> New Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Create Brand in {moduleName}</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Brand name (e.g., Waaree)"
              value={newBrandName}
              onChange={e => setNewBrandName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !brandsBusy && handleCreateBrand()}
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
              disabled={brandsBusy}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="border-gray-300 text-gray-600" disabled={brandsBusy}>Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleCreateBrand}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
                disabled={brandsBusy || !newBrandName.trim()}
              >
                {brandsBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Brand Dialog */}
      <Dialog open={editBrandOpen} onOpenChange={setEditBrandOpen}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Edit Brand</DialogTitle>
          </DialogHeader>
          <Input
            value={editBrandName}
            onChange={e => setEditBrandName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !brandsBusy && handleUpdateBrand()}
            className="bg-gray-50 border-gray-300 text-gray-900"
            disabled={brandsBusy}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-300 text-gray-600" disabled={brandsBusy}>Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleUpdateBrand}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
              disabled={brandsBusy || !editBrandName.trim()}
            >
              {brandsBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Sub-brand Dialog */}
      <Dialog open={createSubOpen} onOpenChange={setCreateSubOpen}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Create Sub-brand</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Sub-brand name"
            value={newSubBrandName}
            onChange={e => setNewSubBrandName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateSubBrand()}
            className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-300 text-gray-600">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateSubBrand} className="bg-violet-600 hover:bg-violet-700">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Sub-brand Dialog */}
      <Dialog open={editSubOpen} onOpenChange={setEditSubOpen}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Edit Sub-brand</DialogTitle>
          </DialogHeader>
          <Input
            value={editSubName}
            onChange={e => setEditSubName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUpdateSubBrand()}
            className="bg-gray-50 border-gray-300 text-gray-900"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-300 text-gray-600">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateSubBrand} className="bg-violet-600 hover:bg-violet-700">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Banner */}
      {brandsError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Failed to load brands</p>
            <p className="text-xs text-red-500 mt-0.5">{brandsError}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs shrink-0"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </motion.div>
      )}

      {/* Loading skeleton */}
      {brandsLoading && brands.length === 0 && (
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      <AnimatePresence>
        {!brandsLoading && brands.length === 0 && !brandsError ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6 text-gray-400">
            <Tags className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No brands in this module yet.</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {brands.map(brand => {
              const subBrands = data.subBrands.filter(sb => sb.brandId === brand.id);
              const isExpanded = expandedBrandId === brand.id;
              const productCount = data.products.filter(p => p.brandId === brand.id).length;

              return (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card
                    className={`transition-all duration-200 border ${
                      selectedBrandId === brand.id
                        ? 'bg-blue-50 border-blue-300 shadow-md shadow-blue-100'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <CardContent className="p-0">
                      <div
                        className="p-3 flex items-center justify-between cursor-pointer"
                        onClick={() => onSelectBrand(brand)}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            className="text-gray-400 hover:text-gray-700"
                            onClick={e => {
                              e.stopPropagation();
                              setExpandedBrandId(isExpanded ? null : brand.id);
                            }}
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                          <div className={`w-2 h-2 rounded-full ${selectedBrandId === brand.id ? 'bg-blue-500' : 'bg-gray-300'}`} />
                          <span className="text-gray-900 font-medium text-sm">{brand.name}</span>
                          <span className="text-xs text-gray-400">
                            ({productCount} products{subBrands.length > 0 ? `, ${subBrands.length} sub-brands` : ''})
                          </span>
                        </div>
                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                            disabled={brandsBusy}
                            onClick={() => {
                              setEditBrandId(brand.id);
                              setEditBrandName(brand.name);
                              setEditBrandOpen(true);
                            }}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50"
                            disabled={brandsBusy}
                            onClick={() => handleDeleteBrand(brand.id)}
                          >
                            {deletingBrandId === brand.id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Trash2 className="w-3.5 h-3.5" />
                            }
                          </Button>
                        </div>
                      </div>

                      {/* Sub-brands collapsible */}
                      {isExpanded && (
                        <div className="px-3 pb-3 border-t border-gray-100">
                          <div className="mt-2 flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5" /> Sub-brands (optional)
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-50 gap-1"
                              onClick={e => {
                                e.stopPropagation();
                                setSubBrandParent(brand.id);
                                setCreateSubOpen(true);
                              }}
                            >
                              <Plus className="w-3 h-3" /> Add
                            </Button>
                          </div>
                          {subBrands.length === 0 ? (
                            <p className="text-xs text-gray-400 italic pl-4">No sub-brands</p>
                          ) : (
                            <div className="space-y-1 pl-4">
                              {subBrands.map(sb => (
                                <div
                                  key={sb.id}
                                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                                    selectedSubBrandId === sb.id
                                      ? 'bg-violet-50 border border-violet-200'
                                      : 'hover:bg-gray-50'
                                  }`}
                                  onClick={e => {
                                    e.stopPropagation();
                                    onSelectSubBrand?.(selectedSubBrandId === sb.id ? null : sb);
                                  }}
                                >
                                  <span className="text-sm text-gray-700">{sb.name}</span>
                                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                                      onClick={() => {
                                        setEditSubId(sb.id);
                                        setEditSubName(sb.name);
                                        setEditSubOpen(true);
                                      }}
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                      onClick={() => deleteSubBrand(sb.id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandManager;
