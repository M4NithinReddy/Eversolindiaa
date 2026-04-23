import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/context/AdminContext';

export const FeaturedProducts = () => {
  const { data, productsLoading } = useAdmin();
  const { modules, products } = data;

  // Pick exactly exactly 4 dynamic products strictly from the database modules
  const featuredProducts = modules.map((module) => {
    // Find first product that belongs to this specific module/category
    const product = products.find(p => p.moduleId === module.id);
    const brand = product ? data.brands.find(b => b.id === product.brandId)?.name : '';

    return {
      id: product?.id || `empty-${module.id}`,
      name: product?.title || 'Coming Soon',
      category: module.name,
      capacity: product?.capacity || '-',
      price: product ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price || 0) : '-',
      benefit: product?.description || 'Stay tuned for premium products in this category.',
      image: product?.images && product.images.length > 0 ? product.images[0] : '/images/default.png',
      brand: brand || 'Eversol',
      hasProduct: !!product,
      isOutOfStock: !!product?.isOutOfStock
    };
  }).slice(0, 4);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16"
        >
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-solar/10 text-solar-dark font-semibold text-sm mb-4">
              Featured Products
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
              High-Quality <span className="text-primary">Solar Products</span>
            </h2>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link to="/shop">
              View All Products
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {productsLoading ? (
          <div className="flex justify-center items-center py-12 min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 card-hover"
              >
                <div className="aspect-square p-2 bg-solar relative overflow-hidden shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 ${product.isOutOfStock ? 'grayscale opacity-50' : ''}`}
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    {product.category}
                  </span>
                  {product.isOutOfStock && (
                    <>
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-10" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
                        <img
                          src="/images/out-of-stock-illustration.png"
                          alt="Out of stock"
                          className="w-2/3 h-auto object-contain drop-shadow-xl mb-1"
                        />
                        <span className="bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 shadow-lg uppercase tracking-widest border border-white/20">
                          Sold Out
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6 flex flex-col grow">
                  <div className="flex items-center gap-2 text-eco text-sm font-medium mb-2">
                    <Zap className="h-4 w-4" />
                    {product.capacity}
                  </div>
                  {product.hasProduct && (
                    <div className="text-base font-heading font-bold text-primary mb-1 uppercase tracking-tighter leading-none">
                      {product.brand}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-muted-foreground mb-4 group-hover:text-foreground transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.benefit}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <span className="text-2xl font-heading font-bold text-primary">
                      {product.price}
                    </span>
                    {product.hasProduct ? (
                      <Button variant="solar" size="sm" asChild>
                        <Link to={`/product/${product.id}`}>
                          <ShoppingCart className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="solar" size="sm" disabled>
                        <ShoppingCart className="h-4 w-4" opacity={0.5} />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12 border border-dashed rounded-xl">
            No featured products available at the moment. Add products to modules via admin to see them here!
          </div>
        )}
      </div>
    </section>
  );
};
