import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, ShoppingCart, Check, ArrowLeft, Phone, Shield, Award, Truck, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { Image360Viewer } from '@/components/product/Image360Viewer';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import panelImg from '@/assets/product-solar-panel.jpg';
import inverterImg from '@/assets/product-inverter.jpg';
import batteryImg from '@/assets/product-battery.jpg';
import kitImg from '@/assets/product-rooftop-kit.jpg';
import { useCart } from '@/context/CartContext';
import { useAdmin } from '@/context/AdminContext';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/lib/api';
import { useState, useMemo } from 'react';

// Product type definitions
type ProductSpecification = {
  label: string;
  value: string | number;
} | Record<string, string | number>;

type Product = {
  id: string | number;
  name: string;
  category: string;
  brand?: string;
  capacity: string;
  price: number;
  benefit?: string;
  image: string;
  images?: string[];
  warranty: string;
  description?: string;
  specifications: ProductSpecification[] | Record<string, string | number>;
  features?: string[];
  benefits?: string[];
  applications?: string[];
  datasheet?: string;
  images360?: string[];
  productType?: string;
  phase?: string;
};

// Products object with string keys

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { data: adminData } = useAdmin();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const { data: apiProduct, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const product = useMemo(() => {
    const pData = Array.isArray(apiProduct) ? apiProduct[0] : apiProduct;
    if (!pData) return null;
    const mod = adminData.modules.find(m => m.id === pData.moduleId);
    const br = adminData.brands.find(b => b.id === pData.brandId);
    
    return {
      id: pData.id,
      name: pData.title || '',
      category: mod?.name || 'Unknown',
      brand: br?.name || 'Unknown',
      capacity: pData.capacity || '',
      price: pData.price || 0,
      benefit: pData.description || '',
      image: pData.images?.[0] || '/images/default.png',
      images: pData.images || [],
      warranty: pData.warranty || '',
      description: pData.description || '',
      specifications: (pData.specifications || []).reduce((acc: any, s) => { acc[s.key] = s.value; return acc; }, {}),
      features: pData.benefits || [],
      benefits: pData.benefits || [],
      applications: pData.applications || [],
      datasheet: pData.datasheet || '',
      productType: pData.productType || '',
      phase: pData.phase || '',
    };
  }, [apiProduct, adminData]);

  const renderSpecifications = () => {
    if (!product || !product.specifications) return null;

    // Handle array format
    if (Array.isArray(product.specifications)) {
      return product.specifications.map((spec, index) => (
        <div key={index} className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground">
            {typeof spec === 'object' && 'label' in spec ? spec.label : ''}
          </span>
          <span className="font-medium text-right">
            {typeof spec === 'object' && 'value' in spec ? String(spec.value) : ''}
          </span>
        </div>
      ));
    }

    // Handle object format
    return Object.entries(product.specifications).map(([key, value]) => (
      <div key={key} className="flex justify-between py-2 border-b">
        <span className="text-muted-foreground">{key}</span>
        <span className="font-medium text-right">{String(value)}</span>
      </div>
    ));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: String(product.id),
      name: product.name,
      category: product.category,
      brand: product.brand,
      capacity: product.capacity,
      price: product.price,
      image: product.image,
      warranty: product.warranty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDownloadDatasheet = (url: string, productName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EVERSOL-${productName.replace(/\s+/g, '-')}-Datasheet.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-16 flex flex-col items-center justify-center min-h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="pt-32 pb-16 flex flex-col items-center justify-center min-h-[500px]">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="pt-28 pb-8 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{product.category}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl p-8 border border-border"
            >
              {product.images && product.images.length > 0 ? (
                <ProductImageGallery
                  images={product.images}
                  productName={product.name}
                />
              ) : (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto object-contain max-h-96 mx-auto"
                />
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                {product.category}
              </span>

              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
                {product.name}
              </h1>

              {product.brand && product.brand !== 'Unknown' && (
                <div className="text-primary font-bold text-lg mb-4">
                  {product.brand}
                </div>
              )}

              <div className="flex items-center gap-4 text-eco font-medium mb-6">
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {product.capacity}
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {product.warranty} Warranty
                </span>
                {product.productType && (
                  <span className="flex items-center gap-2 text-primary font-bold">
                    <Check className="h-5 w-5" />
                    {product.productType}
                  </span>
                )}
                {product.phase && (
                  <span className="flex items-center gap-2 text-blue-600 font-bold">
                    <Zap className="h-5 w-5" />
                    {product.phase}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-heading font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                <span className="text-muted-foreground line-through text-xl">
                  {formatPrice(product.price * 1.2)}
                </span>
                <span className="px-3 py-1 rounded-full bg-eco/10 text-eco text-sm font-semibold">
                  Save 20%
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  variant="solar"
                  size="xl"
                  className={`flex-1 transition-all duration-300 ${added ? 'bg-green-500 hover:bg-green-600' : ''}`}
                  onClick={handleAddToCart}
                >
                  {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </Button>
                {product.datasheet && (
                  <Button
                    variant="outline"
                    size="xl"
                    className="flex-1"
                    onClick={() => handleDownloadDatasheet(product.datasheet!, product.name)}
                  >
                    <Download className="h-5 w-5" />
                    Datasheet
                  </Button>
                )}
                <Button variant="outline" size="xl" asChild>
                  <Link to="/contact">
                    <Phone className="h-5 w-5" />
                    Request Quote
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-eco mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Genuine Product</span>
                </div>
                <div className="text-center">
                  <Truck className="h-8 w-8 text-solar mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Free Delivery</span>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">BIS Certified</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Specifications & Benefits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl p-8 border border-border"
            >
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                Technical Specifications
              </h2>
              {renderSpecifications()}
            </motion.div>

            {/* Benefits & Applications */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card rounded-2xl p-8 border border-border"
              >
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                  Key Benefits
                </h2>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-eco shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border"
              >
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                  Applications
                </h2>
                <ul className="space-y-3">
                  {product.applications.map((app, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-solar shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{app}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
