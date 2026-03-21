import { useState } from 'react';
import { useAdmin, AdminProduct } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, ShoppingBag, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductListProps {
  moduleId?: string;
  brandId?: string;
  subBrandId?: string;
  onEdit: (product: AdminProduct) => void;
}

const ProductList = ({ moduleId, brandId, subBrandId, onEdit }: ProductListProps) => {
  const { data, deleteProduct } = useAdmin();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteProduct(id);
    setDeletingId(null);
  };

  let products = data.products;
  if (moduleId) products = products.filter(p => p.moduleId === moduleId);
  if (brandId) products = products.filter(p => p.brandId === brandId);
  if (subBrandId) products = products.filter(p => p.subBrandId === subBrandId);

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
        <p className="text-sm text-gray-500">{products.length} product{products.length !== 1 ? 's' : ''}</p>
      </div>

      <AnimatePresence>
        {products.map(product => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            layout
          >
            <Card className="bg-white border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
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
                      <div className="flex gap-1 shrink-0">
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
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description || 'No description'}</p>
                    <div className="flex gap-3 mt-2 text-xs">
                      {product.capacity && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {product.capacity}
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
                      {product.specifications.length > 0 && (
                        <span className="text-gray-400">{product.specifications.length} specs</span>
                      )}
                      {product.images.length > 0 && (
                        <span className="text-gray-400">{product.images.length} images</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;
