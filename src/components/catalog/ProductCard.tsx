import { Download, Zap, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ProductCardData {
  id: string;
  name: string;
  image?: string;
  specifications?: Record<string, string>;
  price?: number;
  datasheetLink?: string;
  capacity?: string;
  warranty?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const specs = product.specifications ? Object.entries(product.specifications).slice(0, 3) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col"
    >
      {/* Product Image */}
      <div className="relative h-44 bg-gradient-to-br from-gray-50 to-emerald-50 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Zap className="w-16 h-16 text-emerald-200" />
          </div>
        )}
        {product.capacity && (
          <span className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {product.capacity}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <h4 className="text-gray-900 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h4>

        {/* Specs */}
        {specs.length > 0 && (
          <ul className="space-y-1">
            {specs.map(([key, val]) => (
              <li key={key} className="flex items-start gap-1.5 text-xs text-gray-500">
                <span className="text-emerald-500 mt-0.5 shrink-0">▸</span>
                <span><span className="font-medium text-gray-600">{key}:</span> {val}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Price */}
          <div>
            {product.price && product.price > 0 ? (
              <p className="text-emerald-700 font-bold text-sm">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            ) : (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Tag className="w-3 h-3" />
                <span>Price on request</span>
              </div>
            )}
            {product.warranty && (
              <p className="text-xs text-gray-400 mt-0.5">{product.warranty} warranty</p>
            )}
          </div>

          {/* Datasheet */}
          {product.datasheetLink && (
            <a
              href={product.datasheetLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Datasheet
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Placeholder card for "coming soon" state
export const PlaceholderProductCard = ({ index = 0 }: { index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.06 }}
    className="bg-gradient-to-br from-gray-50 to-emerald-50/30 border border-dashed border-emerald-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[220px]"
  >
    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
      <Zap className="w-6 h-6 text-emerald-400" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">Product Coming Soon</p>
      <p className="text-xs text-gray-400 mt-1">Products will appear here once added</p>
    </div>
  </motion.div>
);

export default ProductCard;
