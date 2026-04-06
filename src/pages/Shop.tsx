import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAdmin } from '@/context/AdminContext';
import { Layout } from '@/components/layout/Layout';
import { Search, Grid, List, ChevronDown, Zap, ShoppingCart, Filter, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import panelImg from '@/assets/product-solar-panel.jpg';
import inverterImg from '@/assets/product-inverter.jpg';
import batteryImg from '@/assets/product-battery.jpg';
import kitImg from '@/assets/product-rooftop-kit.jpg';
import ProductsHero from '@/components/products/ProductsHero';

// Dynamic Data using Context
const brandInfo: Record<string, { tagline: string; description: string; logo?: string }> = {
  Solex: {
    tagline: "Zero Shading. Maximum Power.",
    description: "Solex Energy is one of India's fastest-growing solar module manufacturers, known for its advanced Rear Contact and TOPCon technology. Their panels deliver industry-leading efficiency up to 24.6% with ultra-low degradation and 30-year performance warranties, making them ideal for residential, commercial, and utility-scale projects.",
    logo: "/images/eversol.png",
  },
  Pahal: {
    tagline: "Powering India's Solar Future",
    description: "Pahal Solar manufactures high-performance monocrystalline and N-Type TOPCon bifacial solar panels designed for the Indian climate. With BIS certifications and up to 23.8% efficiency, Pahal modules offer an excellent balance of quality, reliability, and value for homes and businesses across India.",
  },
  Waaree: {
    tagline: "India's Largest Solar Panel Manufacturer",
    description: "Waaree Energies is India's largest solar module manufacturer with over 13 GW of installed capacity worldwide. Their diverse product range spans from standard Mono PERC Bifacial to advanced TOPCon N-Type modules, delivering efficiencies up to 23.5% with robust 12/30-year warranties backing every panel.",
  },
  Panasonic: {
    tagline: "Precision Engineering. Proven Performance.",
    description: "Panasonic's solar division brings decades of Japanese engineering excellence to the Indian market. Offering both Bifacial Mono PERC and N-Type TOPCon modules, Panasonic panels achieve up to 22.66% efficiency with BIS certification, backed by up to 30-year performance warranties for long-term peace of mind.",
  },
  Solaryaan: {
    tagline: "Smart Storage for a Smarter Grid",
    description: "Solaryaan specialises in next-generation energy storage systems built with LFP (LiFePO4) chemistry. From compact AIO all-in-one units to high-voltage scalable battery stacks, Solaryaan solutions offer 6000+ cycle life, 90% depth of discharge, and seamless integration with hybrid inverters for residential and commercial applications.",
  },
  Solplanet: {
    tagline: "Intelligent Solar. Global Reach.",
    description: "Solplanet is a global solar technology brand offering a complete ecosystem of inverters and battery storage. Their Ai-HB and Ai-LB battery series feature LiFePO4 chemistry, modular design, real-time monitoring, and IP65 protection - engineered for seamless integration with their own hybrid inverter range.",
  },
  Hoymiles: {
    tagline: "Next-Level Microinverter Innovation",
    description: "Hoymiles is a world leader in microinverter and optimiser technology. Their products enable panel-level MPPT, real-time monitoring, and enhanced safety for solar installations of all sizes - from residential rooftops to commercial arrays - delivering superior energy harvest and extended system lifespans.",
  },
  SolarYana: {
    tagline: "Reliable Inverters. Proven Efficiency.",
    description: "SolarYana manufactures a comprehensive range of on-grid, hybrid, and off-grid inverters engineered for Indian grid conditions. Known for robust build quality, high conversion efficiency, and smart energy management features, SolarYana inverters are a dependable choice for both residential and commercial solar installations.",
  },
  Involtics: {
    tagline: "Smart Inverters. Smarter Energy.",
    description: "Involtics offers a comprehensive lineup of ON GRID and Hybrid inverters for the Indian market. Their GTSI Hybrid series supports both Lead Acid and Lithium batteries with 1-phase and 3-phase options from 3kW to 20kW, while the GT ON GRID series covers 1.5kW to 25kW with up to 10-year warranty and built-in WiFi monitoring.",
  },
  GoodWe: {
    tagline: "Good Energy. Better Life.",
    description: "GoodWe is a globally recognised solar inverter manufacturer offering a complete range from residential single-phase ON GRID and Hybrid inverters to large-scale commercial and utility units up to 250kW. Their products support Lead Acid and Lithium batteries, feature multi-MPPT tracking, and come with built-in WiFi monitoring for real-time energy management.",
  },
  Sunways: {
    tagline: "Powering Tomorrow, Today.",
    description: "Sunways manufactures high-performance hybrid inverters designed for both single-phase and three-phase applications. Their STH series ranges from 3kW to 33kW, offering 2-MPPT tracking, WiFi monitoring, and robust build quality — ideal for residential and commercial solar installations across India.",
  },
};

const Shop = () => {
  const { addToCart } = useCart();
  const { data } = useAdmin();

  const categories = ['All', ...Array.from(new Set(data.modules.map(m => m.name)))];
  
  const getBrandsForCategory = (categoryName: string) => {
    const mod = data.modules.find(m => m.name === categoryName);
    return mod ? data.brands.filter(b => b.moduleId === mod.id) : [];
  };

  const getDefaultImage = (categoryName: string) => {
    const cat = categoryName.toLowerCase();
    if (cat.includes('inverter')) return inverterImg;
    if (cat.includes('module') || cat.includes('panel')) return panelImg;
    if (cat.includes('storage') || cat.includes('battery')) return batteryImg;
    return kitImg;
  };

  const mappedProducts = data.products.map(p => {
    const mod = data.modules.find(m => m.id === p.moduleId);
    const br = data.brands.find(b => b.id === p.brandId);
    const categoryName = mod?.name || 'Unknown';
    return {
      id: p.id,
      name: p.title || '',
      category: categoryName,
      brand: br?.name || 'Unknown',
      capacity: p.capacity || '',
      price: p.price || 0,
      benefit: p.description || '',
      image: (p.images && p.images.length > 0) ? p.images[0] : getDefaultImage(categoryName),
      images: p.images || [],
      warranty: p.warranty || '',
      datasheet: p.datasheet || '',
      specifications: (p.specifications || []).reduce((acc: any, s) => { acc[s.key] = s.value; return acc; }, {}),
      features: p.benefits?.length ? p.benefits : (p.applications || []),
      productType: p.productType || '',
      phase: p.phase || '',
    };
  });

  const inverterProducts = mappedProducts.filter(p => p.category === 'Solar Inverters');
  const derivedInverterTypes = Array.from(new Set(inverterProducts.map(p => p.productType).filter(Boolean)));
  
  const getBrandsForInverterType = (type: string) => {
    return Array.from(new Set(inverterProducts.filter(p => p.productType === type).map(p => p.brand).filter(Boolean)));
  };
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedInverterType, setSelectedInverterType] = useState<string | null>(null);
  const [selectedInverterBrand, setSelectedInverterBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [openBrandDropdown, setOpenBrandDropdown] = useState<string | null>(null);
  const [isInverterFiltersOpen, setIsInverterFiltersOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, selectedInverterType, selectedInverterBrand, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBrandsOpen(false);
        setOpenBrandDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredProducts = mappedProducts.filter(product => {
    // Category filter
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    // Search filter - search across all relevant product fields
    const q = searchQuery.toLowerCase().trim();
    const specValues = Object.values(product.specifications || {}).map(v => String(v).toLowerCase());
    const matchesSearch = q === '' ||
      product.name.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      (product.brand || '').toLowerCase().includes(q) ||
      (product.productType || '').toLowerCase().includes(q) ||
      (product.phase || '').toLowerCase().includes(q) ||
      (product.capacity || '').toLowerCase().includes(q) ||
      (product.benefit || '').toLowerCase().includes(q) ||
      (product.warranty || '').toLowerCase().includes(q) ||
      specValues.some(v => v.includes(q)) ||
      (product.features || []).some((f: string) => f.toLowerCase().includes(q));

    // Category specific filters
    const isSolarModule = selectedCategory === 'Solar Modules';
    const isSolarStorage = selectedCategory === 'Solar Storage';
    const isInverter = selectedCategory === 'Solar Inverters';

    // Brand filtering
    let matchesBrand = true;
    if (isSolarModule && selectedBrand) {
      matchesBrand = product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase();
    } else if (isSolarStorage && selectedBrand) {
      matchesBrand = product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase();
    }
    const matchesInverterType = !isInverter || !selectedInverterType ||
      (product.productType === selectedInverterType);
    const matchesInverterBrand = !isInverter || !selectedInverterBrand ||
      (product.brand && product.brand.toLowerCase() === selectedInverterBrand.toLowerCase());

    return matchesCategory && matchesSearch && matchesBrand && matchesInverterType && matchesInverterBrand;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDownloadDatasheet = (url: string, productName: string) => {
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SOLEX-${productName.replace(/\s+/g, '-')}-Datasheet.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      {/* Hero */}
      <ProductsHero />

      {/* Main Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div id="product-search" className="bg-white rounded-xl shadow-sm p-6 mb-8 sticky top-20 z-30">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>


              {/* Categories */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-wrap gap-2 justify-center" ref={dropdownRef}>
                  {categories.map((category) => (
                    <div key={category} className="relative">
                      <Button
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category);
                          // Toggle brand dropdown for categories with brands
                          if (getBrandsForCategory(category).length > 0) {
                            setOpenBrandDropdown(openBrandDropdown === category ? null : category);
                          } else {
                            setOpenBrandDropdown(null);
                          }
                          // Keep existing inverter filter toggle
                          setIsInverterFiltersOpen(category === 'Solar Inverters' ? !isInverterFiltersOpen : false);
                          
                          // Reset filters when changing category
                          setSelectedBrand(null);
                          setSelectedInverterType(null);
                          setSelectedInverterBrand(null);
                        }}
                        className={`rounded-full ${getBrandsForCategory(category).length > 0 ? 'pr-8' : ''}`}
                      >
                        {category}
                        {getBrandsForCategory(category).length > 0 && (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>

                      {/* Brand Dropdown for categories with brands */}
                      {getBrandsForCategory(category).length > 0 && selectedCategory === category && openBrandDropdown === category && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                          >
                            <div className="p-2">
                              <p className="px-3 py-1 text-sm font-medium text-gray-700">Select Brand</p>
                              {getBrandsForCategory(category).map((brand) => (
                                <button
                                  key={brand.id}
                                  onClick={() => {
                                    setSelectedBrand(brand.name);
                                    setIsBrandsOpen(false);
                                    setOpenBrandDropdown(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedBrand === brand.name
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                  {brand.name}
                                </button>
                              ))}
                              {selectedBrand && (
                                <button
                                  onClick={() => {
                                    setSelectedBrand(null);
                                    setIsBrandsOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mt-1"
                                >
                                  Clear Filter
                                </button>
                              )}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>
                  ))}
                  {selectedBrand && (
                    <div className="ml-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center">
                      {selectedBrand}
                      <button
                        onClick={() => setSelectedBrand(null)}
                        className="ml-2 text-primary/70 hover:text-primary"
                      >
                        Ã—
                      </button>
                    </div>
                  )}
                </div>

                {/* Inverter Filters */}
                {selectedCategory === 'Solar Inverters' && (
                  <div className="flex flex-wrap gap-4 justify-center mt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          {selectedInverterType || 'Select Inverter Type'}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {derivedInverterTypes.map((type) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() => {
                              setSelectedInverterType(type);
                              setSelectedInverterBrand(null);
                            }}
                          >
                            {type}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {selectedInverterType && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="gap-2">
                            {selectedInverterBrand || 'Select Brand'}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {getBrandsForInverterType(selectedInverterType).map((brand) => (
                            <DropdownMenuItem
                              key={brand}
                              onClick={() => setSelectedInverterBrand(brand)}
                            >
                              {brand}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    {(selectedInverterType || selectedInverterBrand) && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedInverterType(null);
                          setSelectedInverterBrand(null);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Brand Info Banner */}
          <AnimatePresence>
            {(() => {
              const activeBrand = selectedBrand || selectedInverterBrand;
              const info = activeBrand ? brandInfo[activeBrand] : null;
              if (!activeBrand || !info) return null;
              return (
                <motion.div
                  key={activeBrand}
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8 rounded-2xl overflow-hidden border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 md:p-8">
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-1">Brand Spotlight</p>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{activeBrand}</h2>
                      <p className="text-sm font-medium text-orange-600 mb-3 italic">{info.tagline}</p>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">{info.description}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedBrand(null); setSelectedInverterBrand(null); }}
                      className="self-start md:self-center text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
                      aria-label="Clear brand filter"
                    >
                      Ã—
                    </button>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                  Showing {Math.min(filteredProducts.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} - {Math.min(filteredProducts.length, currentPage * ITEMS_PER_PAGE)} of {filteredProducts.length} products
              </div>

              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
              }>
                {filteredProducts
                  .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                  .map((product, index) => (
                  <Link key={product.id} to={`/product/${product.id}`} className="block cursor-pointer">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={`group bg-card rounded-2xl overflow-hidden border-4 border-orange-500 hover:border-orange-600 transition-all duration-300 card-hover h-full ${viewMode === 'list' ? 'flex flex-row' : ''
                        }`}
                    >
                      <div className={`relative overflow-hidden bg-card ${viewMode === 'list' ? 'w-40 shrink-0' : 'aspect-square h-64'
                        }`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold max-w-[80%] truncate">
                          {product.category}
                        </span>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        {product.category.toLowerCase().includes('storage') ? (
                          <>
                            {/* 1. Header (Title) */}
                            <h3 className="text-lg font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                              {product.name}
                            </h3>

                            {/* 2. Specs Box */}
                            <div className="grid grid-cols-2 gap-x-2 gap-y-2.5 text-[11px] mb-3 bg-slate-50/80 p-3 rounded-lg border border-slate-100/50">
                               <div className="flex flex-col">
                                 <span className="text-slate-500 font-semibold mb-0.5 uppercase tracking-wider text-[9px]">Capacity</span>
                                 <span className="font-bold text-slate-800">{product.capacity || '-'}</span>
                               </div>
                               <div className="flex flex-col">
                                 <span className="text-slate-500 font-semibold mb-0.5 uppercase tracking-wider text-[9px]">Voltage</span>
                                 <span className="font-bold text-slate-800 truncate" title={product.specifications?.['Battery Nominal Voltage'] || product.specifications?.['Battery Nomi'] || product.specifications?.['Operating V'] || product.specifications?.['Operating Voltage Range'] || '-'} >{product.specifications?.['Battery Nominal Voltage'] || product.specifications?.['Battery Nomi'] || product.specifications?.['Operating V'] || product.specifications?.['Operating Voltage Range'] || '-'}</span>
                               </div>
                               <div className="flex flex-col">
                                 <span className="text-slate-500 font-semibold mb-0.5 uppercase tracking-wider text-[9px]">Cycle Life</span>
                                 <span className="font-bold text-slate-800">{product.specifications?.['Cycle Life'] || '-'}</span>
                               </div>
                               <div className="flex flex-col">
                                 <span className="text-slate-500 font-semibold mb-0.5 uppercase tracking-wider text-[9px]">Warranty</span>
                                 <span className="font-bold text-slate-800">{product.warranty || '-'}</span>
                               </div>
                            </div>

                            {/* 3. Badges (Type & Cooling) */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {product.productType && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-full uppercase font-bold tracking-wide">{product.productType}</span>}
                              {product.specifications?.['Cooling'] && <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[10px] rounded-full uppercase font-bold tracking-wide">{product.specifications['Cooling']}</span>}
                            </div>

                            {/* 4. Sub-info (Description & Brand) */}
                            <div className="flex flex-wrap items-center gap-2 mb-4 mt-auto pt-2">
                              <span className="text-sm font-medium text-gray-500 line-clamp-1 flex-1">{product.benefit || 'Energy Storage Module'}</span>
                              {product.brand && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 text-[10px] rounded-md font-bold uppercase tracking-wide">{product.brand}</span>}
                            </div>
                          </>
                        ) : (
                          <>
                            {/* 1. Type (and phase if applicable) */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {product.productType && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-full uppercase font-bold tracking-wide">{product.productType}</span>}
                              {product.phase && <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] rounded-full uppercase font-bold tracking-wide">{product.phase}</span>}
                            </div>

                            {/* 2. Description Header */}
                            <h3 className="text-lg font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {product.benefit}
                            </h3>

                            {/* 3. Watt and Warranty */}
                            <div className="flex flex-wrap items-center gap-2 text-eco text-sm font-medium mb-2">
                              <span>{product.capacity} <span className="font-bold text-xs tracking-wider">KW</span></span>
                              <span className="text-muted-foreground">•</span>
                              <span>{product.warranty} Warranty</span>
                            </div>

                            {/* 4. Title & Brand */}
                            <div className="flex flex-wrap items-center gap-2 mb-4 mt-auto pt-2">
                              <span className="text-sm font-semibold text-gray-800 tracking-wide">{product.name}</span>
                              {product.brand && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 text-[10px] rounded-md font-bold uppercase tracking-wide">{product.brand}</span>}
                            </div>
                          </>
                        )}
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-2xl font-heading font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="solar"
                              size="sm"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); product.datasheet && handleDownloadDatasheet(product.datasheet, product.name); }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="solar" size="sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart({ id: product.id, name: product.name, category: product.category, brand: product.brand, capacity: product.capacity, price: product.price, image: product.image, warranty: product.warranty }); }}>
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Pagination Controls */}
              {filteredProducts.length > ITEMS_PER_PAGE && (
                <div className="mt-12 flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) }).map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        );
                      }
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page}>...</span>;
                      }
                      return null;
                    })}
                  </div>
                  <Button
                    variant="outline"
                    disabled={currentPage === Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                  <div className="mt-4 flex gap-4">
                    <Button
                      onClick={() => handleDownloadDatasheet(selectedProduct.datasheet, selectedProduct.name)}
                      variant="default"
                      className="w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Datasheet
                    </Button>
                    <Button variant="outline" className="w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact Sales
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                  <p className="text-gray-700 mb-6">{selectedProduct.benefit}</p>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {selectedProduct.features?.map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      )) || (
                          <li>No features listed</li>
                        )}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Specifications</h4>
                    <div className="space-y-2">
                      {selectedProduct.specifications && Object.entries(selectedProduct.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-gray-100 pb-1">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium text-gray-900">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Shop;


