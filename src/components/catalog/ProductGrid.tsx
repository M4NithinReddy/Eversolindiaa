import { Package } from 'lucide-react';
import ProductCard, { PlaceholderProductCard, ProductCardData } from './ProductCard';

interface ProductGridProps {
  products: ProductCardData[];
  moduleName: string;
}

const ProductGrid = ({ products, moduleName }: ProductGridProps) => {
  return (
    <div className="mt-3">
      {products.length === 0 ? (
        // Show 3 placeholder cards when no products yet
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <PlaceholderProductCard index={0} />
          <PlaceholderProductCard index={1} />
          <PlaceholderProductCard index={2} />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-gray-500">{products.length} product{products.length !== 1 ? 's' : ''} in {moduleName}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductGrid;
