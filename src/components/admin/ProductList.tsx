import { useState, useEffect } from 'react';
import { useAdmin, AdminProduct } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, ShoppingBag, Image as ImageIcon, Loader2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductListProps {
  moduleId?: string;
  brandId?: string;
  subBrandId?: string;
  onEdit: (product: AdminProduct) => void;
  onView?: (product: AdminProduct) => void;
  selectionMode?: boolean;
  onSelectionComplete?: () => void;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}

const ProductList = ({ moduleId, brandId, subBrandId, onEdit, onView, selectionMode, onSelectionComplete, selectedIds, onSelectionChange }: ProductListProps) => {
  const { data, deleteProduct, updateProduct, deleteSelectedProducts } = useAdmin();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  // Reset page and selection when filters change or mode changes
  useEffect(() => {
    setCurrentPage(1);
    onSelectionChange(new Set());
  }, [moduleId, brandId, subBrandId, selectionMode]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteProduct(id);
    setDeletingId(null);
  };

  let products = data.products;
  if (moduleId) products = products.filter(p => p.moduleId === moduleId);
  if (brandId) products = products.filter(p => p.brandId === brandId);
  if (subBrandId) products = products.filter(p => p.subBrandId === subBrandId);

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(products.map(p => p.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const getModuleName = (id: string) => data.modules.find(m => m.id === id)?.name || '—';
  const getBrandName = (id: string) => data.brands.find(b => b.id === id)?.name || '—';
  const getSubBrandName = (id?: string) => (id ? data.subBrands.find(sb => sb.id === id)?.name || '' : '');

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium text-gray-500 mb-1">No products yet</p>
        <p className="text-sm">Click "Add Product" to create your first product.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          {selectionMode && products.length > 0 && (
            <div className="flex items-center gap-2 px-1 animate-in fade-in slide-in-from-left-2 transition-all">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedIds.size === products.length && products.length > 0}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="select-all" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                Select All
              </label>
            </div>
          )}
          <p className="text-sm text-gray-500">
            Showing {Math.min(products.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} - {Math.min(products.length, currentPage * ITEMS_PER_PAGE)} of {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {products
          .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
          .map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0.5, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
              layout
            >
              {selectionMode && (
                <div className="flex items-center justify-center shrink-0 animate-in fade-in slide-in-from-left-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product.id)}
                    onChange={() => toggleSelectOne(product.id)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              )}
              <Card className={`flex-1 bg-white border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 ${selectedIds.has(product.id) ? 'border-emerald-200 bg-emerald-50/20' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                      {(product.images ?? []).length > 0 ? (
                        <img
                          src={(product.images ?? [])[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-gray-900 font-semibold text-sm truncate">{product.title}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {getModuleName(product.moduleId)} · {getBrandName(product.brandId)}
                            {getSubBrandName(product.subBrandId) && ` · ${getSubBrandName(product.subBrandId)}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex gap-1 shrink-0">
                            {onView && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                                onClick={() => onView(product)}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                              onClick={() => onEdit(product)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                              onClick={() => handleDelete(product.id)}
                              disabled={deletingId === product.id}
                            >
                              {deletingId === product.id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Trash2 className="w-3.5 h-3.5" />}
                            </Button>
                          </div>

                          {/* Stock Toggle */}
                          <div className="flex items-center gap-2 px-2 py-1 rounded bg-gray-50 border border-gray-100 h-8">
                            <input
                              type="checkbox"
                              id={`stock-${product.id}`}
                              checked={product.isOutOfStock || false}
                              onChange={async (e) => {
                                const { id, createdAt, ...rest } = product;
                                await updateProduct(id, { ...rest, isOutOfStock: e.target.checked });
                              }}
                              className="h-3.5 w-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                            />
                            <label
                              htmlFor={`stock-${product.id}`}
                              className={`text-[10px] font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap ${product.isOutOfStock ? 'text-red-500' : 'text-emerald-600'}`}
                            >
                              {product.isOutOfStock ? 'Out of Stock' : 'In Stock'}
                            </label>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description || 'No description'}</p>
                      <div className="flex gap-3 mt-2 text-xs">
                        {product.capacity && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {product.capacity}
                          </span>
                        )}
                        {product.productType && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                            {product.productType}
                          </span>
                        )}
                        {product.price > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                        {product.warranty && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            {product.warranty}
                          </span>
                        )}
                        {(product.specifications ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(product.specifications ?? []).slice(0, 3).map((spec, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-500 border border-gray-200">
                                {spec.key}: {spec.value}
                              </span>
                            ))}
                            {(product.specifications ?? []).length > 3 && (
                              <span className="text-[10px] text-gray-400">+{(product.specifications ?? []).length - 3} more</span>
                            )}
                          </div>
                        )}
                        {(product.images ?? []).length > 0 && (
                          <span className="text-gray-400 text-[10px]">{(product.images ?? []).length} images</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Pagination Controls */}
      {products.length > ITEMS_PER_PAGE && (
        <div className="mt-8 flex justify-center items-center gap-2 pb-6">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.ceil(products.length / ITEMS_PER_PAGE) }).map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === Math.ceil(products.length / ITEMS_PER_PAGE) ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'ghost'}
                    size="icon"
                    className="h-8 w-8 text-xs"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="text-gray-400 px-1 text-xs">...</span>;
              }
              return null;
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === Math.ceil(products.length / ITEMS_PER_PAGE)}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
