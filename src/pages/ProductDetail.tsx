import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, ShoppingCart, Check, ArrowLeft, Phone, Shield, ShieldCheck, Award, Truck, Download, ChevronUp, ChevronDown, Package } from 'lucide-react';
import { Image360Viewer } from '@/components/product/Image360Viewer';
import { Advanced360Viewer } from '@/components/product/Advanced360Viewer';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import panelImg from '@/assets/product-solar-panel.jpg';
import inverterImg from '@/assets/product-inverter.jpg';
import batteryImg from '@/assets/product-battery.jpg';
import kitImg from '@/assets/product-rooftop-kit.jpg';
import { useCart } from '@/context/CartContext';
import { useAdmin } from '@/context/AdminContext';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/lib/api';
import { useState, useMemo, useEffect } from 'react';

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
  isOutOfStock?: boolean;
};

const HighVoltageIcon = ({ className = "h-5 w-5" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M14 8l-4 6h5l-4 6" fill="currentColor" stroke="none" />
  </svg>
);

// Products object with string keys

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { data: adminData } = useAdmin();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | '360'>('gallery');

  const { data: apiProduct, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const product = useMemo(() => {
    const pData = Array.isArray(apiProduct)
      ? apiProduct.find((p: any) => String(p.id) === String(id)) || apiProduct[0]
      : apiProduct;
    if (!pData) return null;

    // CRITICAL: moduleId/brandId may be buried in extraFields in the new schema
    const resolvedModuleId = pData.moduleId || pData.extraFields?.moduleId || '';
    const resolvedBrandId = pData.brandId || pData.extraFields?.brandId || '';

    // Support both old schema (moduleId lookup) and new flat schema (category field)
    const mod = adminData.modules.find(m => m.id === resolvedModuleId);
    const br = adminData.brands.find(b => b.id === resolvedBrandId);
    const categoryName = mod?.name || pData.category || 'Unknown';
    const brandName = br?.name || pData.brandName || 'Unknown';

    const isSolarPanel = categoryName.toLowerCase().includes('module') || categoryName.toLowerCase().includes('panel');

    const getDefaultImage = (catName: string) => {
      const cat = catName.toLowerCase();
      if (cat.includes('inverter')) return inverterImg;
      if (cat.includes('module') || cat.includes('panel')) return panelImg;
      if (cat.includes('storage') || cat.includes('battery')) return batteryImg;
      return kitImg;
    };

    // Merge flat spec fields into specifications object
    const flatSpecMap: Record<string, string> = {};
    const flatFields: Array<[string, any]> = [
      ['MONO/BIFACIAL', pData.mono_bifacial],
      ['Model / Type', pData.model_number],
      ['Wattage (W)', pData.wattage_w],
      ['Cell Type', pData.cell_type],
      ['Module Efficiency (%)', pData.module_efficiency],
      ['No. of Cells', pData.no_of_cells],
      ['Available Stock', pData.available_stock],
      ['Battery Type', pData.battery_type],
      ['Capacity (kWh/Ah)', pData.capacity_kwh_ah],
      ['Battery Nominal Voltage', pData.battery_nominal_voltage_v],
      ['Operating Voltage', pData.operating_voltage],
      ['Cycle Life', pData.cycle_life],
      ['Cooling', pData.cooling],
      ['Compatible Inverters', pData.compatible_inverters],
      ['System Size (kW)', pData.system_size_kw],
      ['Included Module Brand', pData.included_module_brand],
      ['Included Inverter Brand', pData.included_inverter_brand],
      ['Structure Type', pData.structure_type],
      ['Area Required (sq.ft)', pData.area_required_sqft],
      ['Subsidy Eligible', pData.subsidy_eligible],
      ['Installation Included', pData.installation_included],
      ['Meters', pData.meters],
      ['Total Price', pData.total_price],
    ];
    flatFields.forEach(([k, v]) => { if (v !== undefined && v !== null && String(v).trim() !== '') flatSpecMap[k] = String(v); });
    // Normalize specifications to an object
    const rawSpecs = pData.specifications || [];
    let arraySpecs: Record<string, any> = {};
    if (Array.isArray(rawSpecs)) {
      rawSpecs.forEach((s: any) => {
        if (s) {
          const k = s.key || s.label;
          const v = s.value;
          if (k !== undefined) arraySpecs[k] = v;
        }
      });
    } else if (typeof rawSpecs === 'object') {
      arraySpecs = { ...rawSpecs };
    }

    // Extract potential benefits/applications (typo-tolerant)
    const findSpecValue = (keywords: string[]) => {
      const key = Object.keys(arraySpecs).find(k =>
        keywords.some(kw => String(k).toLowerCase().includes(kw.toLowerCase()))
      );
      if (key) {
        const val = arraySpecs[key];
        delete arraySpecs[key]; // Remove from specs table
        return val;
      }
      return '';
    };

    const specBenefits = findSpecValue(['benefit', 'benifit']);
    const specApps = findSpecValue(['application']);

    const specifications = { ...flatSpecMap, ...arraySpecs };

    // Helper to split by multiple delimiters (* and ,)
    const splitItems = (raw: any): string[] => {
      if (Array.isArray(raw) && raw.length > 0) return raw;
      if (typeof raw === 'string' && raw.trim()) {
        // Split by *, comma, or newline and filter
        return String(raw).split(/[\*\n\|]/).flatMap(s => s.split(',')).map((s: string) => s.trim()).filter(Boolean);
      }
      return [];
    };

    // Resolve benefits
    let benefits = splitItems(pData.benefits);
    if (benefits.length === 0) benefits = splitItems(specBenefits);

    // Resolve applications
    let applications = splitItems(pData.applications);
    if (applications.length === 0) applications = splitItems(specApps);

    // Resolve capacity
    const capacity = pData.capacity || pData.capacity_kwh_ah || pData.wattage_w || pData.system_size_kw || '';

    return {
      id: pData.id,
      name: pData.title || '',
      category: categoryName,
      brand: brandName,
      capacity,
      price: pData.price || 0,
      benefit: pData.description || '',
      image: (pData.images && pData.images.length > 0) ? pData.images[0] : getDefaultImage(categoryName),
      images: pData.images || [],
      warranty: pData.warranty || '',
      isSolarPanel,
      description: pData.description || '',
      specifications,
      features: benefits.length > 0 ? benefits : applications,
      benefits,
      applications,
      datasheet: pData.datasheet || '',
      images360: pData.images360 || [],
      productType: pData.productType || pData.product_type || '',
      phase: pData.phase || '',
      isOutOfStock: !!pData.isOutOfStock,
    };
  }, [apiProduct, adminData]);

  // Set default view mode to 360 if available
  useEffect(() => {
    const hasImages360 = product?.images360 && product.images360.length > 0;
    const hasMultipleImages = product?.images && product.images.length > 1;
    if (hasImages360 || hasMultipleImages) {
      setViewMode('360');
    }
  }, [product?.images360, product?.images]);

  const availableStock = useMemo(() => {
    if (!product || !product.specifications) return null;
    if (Array.isArray(product.specifications)) {
      const stockSpec = product.specifications.find(s => {
        if (typeof s === 'object' && 'label' in s) return String(s.label) === 'Available Stock';
        return false;
      });
      return stockSpec && 'value' in stockSpec ? String(stockSpec.value) : null;
    }
    return product.specifications['Available Stock'] ? String(product.specifications['Available Stock']) : null;
  }, [product]);

  const getSpecColor = (key: string, value: string) => {
    if (key === 'Available Stock' && String(value).toLowerCase() === 'yes') return 'text-eco font-semibold';
    if (key.startsWith('Module Efficiency')) return 'text-blue-600 font-semibold';
    if (key.startsWith('Cell Type')) return 'text-purple-700 font-semibold';
    return '';
  };

  const renderSpecifications = () => {
    if (!product || !product.specifications) return null;

    const excludedKeys = ['Available Stock', 'Key Benefits', 'Key Benifits', 'Applications'];

    // Handle array format
    if (Array.isArray(product.specifications)) {
      return product.specifications
        .filter(s => typeof s === 'object' && 'label' in s && !excludedKeys.includes(String(s.label)))
        .map((spec, index) => (
          <div key={index} className="flex justify-between items-start gap-4 py-2 border-b">
            <span className="text-muted-foreground shrink-0" style={{ maxWidth: '55%' }}>
              {typeof spec === 'object' && 'label' in spec ?
                (() => {
                  const label = String(spec.label);
                  if (label.toLowerCase() === 'warranty' && (product as any).isSolarPanel) return 'Warranty (product)';
                  if (label.toLowerCase() === 'model number') return 'Model / Type';
                  return label;
                })()
                : ''}
            </span>
            <span className={`font-medium text-right ${getSpecColor(
              typeof spec === 'object' && 'label' in spec ? String(spec.label) : '',
              typeof spec === 'object' && 'value' in spec ? String(spec.value) : ''
            )}`}>
              {typeof spec === 'object' && 'value' in spec ? String(spec.value) : ''}
            </span>
          </div>
        ));
    }

    // Handle object format
    return Object.entries(product.specifications)
      .filter(([key]) => !excludedKeys.includes(key))
      .map(([key, value]) => (
        <div key={key} className="flex justify-between items-start gap-4 py-2 border-b">
          <span className="text-muted-foreground shrink-0" style={{ maxWidth: '55%' }}>
            {(() => {
              if (key.toLowerCase() === 'warranty' && (product as any).isSolarPanel) return 'Warranty (product)';
              if (key.toLowerCase() === 'model number') return 'Model / Type';
              return key;
            })()}
          </span>
          <span className={`font-medium text-right ${getSpecColor(key, String(value))}`}>
            {String(value)}
          </span>
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
              className="bg-card rounded-2xl p-8 border border-border relative group"
            >
              {(() => {
                const hasImages360 = product.images360 && product.images360.length > 0;
                const hasMultipleImages = product.images && product.images.length > 1;
                const canShow360 = hasImages360 || hasMultipleImages;

                if (!canShow360) return null;

                return (
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <Button
                      size="sm"
                      variant={viewMode === 'gallery' ? 'default' : 'outline'}
                      onClick={() => setViewMode('gallery')}
                      className="rounded-full shadow-sm"
                    >
                      Gallery
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === '360' ? 'default' : 'outline'}
                      onClick={() => setViewMode('360')}
                      className="rounded-full shadow-sm"
                    >
                      360° View
                    </Button>
                  </div>
                );
              })()}

              {viewMode === '360' && ((product.images360 && product.images360.length > 0) || (product.images && product.images.length > 1)) ? (
                <Advanced360Viewer
                  images={[product.images360 && product.images360.length > 0 ? product.images360 : product.images]}
                  className="w-full h-full"
                />
              ) : product.images && product.images.length > 0 ? (
                <ProductImageGallery
                  images={product.images}
                  productName={product.name}
                />
              ) : (
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-auto object-contain max-h-96 mx-auto ${product.isOutOfStock ? 'grayscale opacity-50' : ''}`}
                />
              )}

              {product.isOutOfStock && (
                <>
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-10 rounded-2xl" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-12 pointer-events-none">
                    <img
                      src="/images/out-of-stock-illustration.png"
                      alt="Out of stock"
                      className="w-1/3 h-auto object-contain drop-shadow-2xl mb-4"
                    />
                    <div className="bg-red-600 text-white text-sm font-bold px-6 py-2 rounded-lg shadow-2xl uppercase tracking-[0.2em] border-2 border-white/30 transition-transform hover:scale-105">
                      Temporarily Sold Out
                    </div>
                  </div>
                </>
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

              <h1 className="text-lg md:text-xl font-medium text-muted-foreground mb-1">
                {product.name}
              </h1>

              {product.brand && product.brand !== 'Unknown' && (
                <div className="text-2xl md:text-3xl font-black text-primary mb-6 tracking-tighter uppercase leading-none">
                  {product.brand}
                </div>
              )}

              <div className="flex items-center gap-4 text-eco font-medium mb-6">
                <span className="flex items-center gap-2">
                  {product.capacity || ''}
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {product.warranty} Warranty{(product as any).isSolarPanel ? ' (product)' : ''}
                </span>
                {product.productType && (
                  <span className="flex items-center gap-2 text-primary font-bold">
                    <Check className="h-5 w-5" />
                    {product.productType}
                  </span>
                )}
                {product.phase && (
                  <span className="flex items-center gap-2 text-blue-600 font-bold">
                    <HighVoltageIcon className="h-5 w-5" />
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
                  disabled={product.isOutOfStock}
                >
                  {product.isOutOfStock ? (
                    <>OUT OF STOCK</>
                  ) : (
                    <>
                      {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                      {added ? 'Added to Cart!' : 'Add to Cart'}
                    </>
                  )}
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
                  <ShieldCheck className="h-8 w-8 text-eco mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Genuine Product</span>
                </div>
                <div className="text-center">
                  <Package className="h-8 w-8 text-solar mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Paid Delivery</span>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">BIS Certified Product</span>
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
              {availableStock && (
                <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-eco/10 text-eco rounded-full text-sm font-bold border border-eco/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-eco animate-pulse inline-block"></span>
                  Available Stock: {availableStock}
                </div>
              )}
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
                  {(product.benefits ?? []).length > 0 ? (
                    (product.benefits ?? []).map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-eco text-lg leading-none shrink-0 mt-0.5 select-none">✳</span>
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground italic">No benefits listed</li>
                  )}
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
                  {(product.applications ?? []).length > 0 ? (
                    (product.applications ?? []).map((app, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-solar text-lg leading-none shrink-0 mt-0.5 select-none">✳</span>
                        <span className="text-muted-foreground">{app}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground italic">No applications listed</li>
                  )}
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
