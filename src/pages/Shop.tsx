import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAdmin } from '@/context/AdminContext';
import { Layout } from '@/components/layout/Layout';
import { findBrandModel, SOLPLANET_MODELS } from '@/lib/brandData';
import { Search, Grid, List, ChevronDown, Zap, ShoppingCart, Filter, Download, X } from 'lucide-react';
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
    description: "Solplanet specializes in high-performance solar inverters and energy storage. Their Solar On-Grid Inverter range includes Single-Phase ASW G2 series (1-10kW) and Three-Phase ASW LT-G2 Pro/LT-G3 series (3-60kW), alongside high-capacity utility-scale inverters like the ASW 75-110K LT and ASWHT series (up to 360kW). All models feature ShadeSol technology and smart monitoring.",
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
    tagline: "Smart Performance. Sustainable Power.",
    description: "Involtics specializes in high-efficiency solar inverters for both residential and commercial applications. Their GT series ON-GRID inverters range from compact 1.5kW units for small homes to powerful 25kW three-phase systems for businesses. Featuring multi-MPPT tracking, built-in WiFi monitoring, and robust 10-year warranties, Involtics delivers reliable power electronics for the modern grid.",
  },
  GoodWe: {
    tagline: "Good Energy. Better Life.",
    description: "GoodWe is a globally recognised solar inverter manufacturer offering a complete range from residential single-phase ON GRID and Hybrid inverters to large-scale commercial and utility units up to 250kW. Their products support Lead Acid and Lithium batteries, feature multi-MPPT tracking, and come with built-in WiFi monitoring for real-time energy management.",
  },
  Sunways: {
    tagline: "Powering Tomorrow, Today.",
    description: "Sunways manufactures high-performance hybrid inverters designed for both single-phase and three-phase applications. Their STH series ranges from 3kW to 33kW, offering 2-MPPT tracking, WiFi monitoring, and robust build quality — ideal for residential and commercial solar installations across India.",
  },
  APAR: {
    tagline: "Excellence in Innovation. Quality in Cables.",
    description: "APAR Industries is a global leader in the cable industry, providing high-quality Solar DC cables designed for long-term outdoor use. Their cables are UV resistant, flame retardant, and engineered to minimize power loss in solar installations.",
  },
  ORIENT: {
    tagline: "Powering a Greener Tomorrow.",
    description: "Orient Cables manufactures premium Solar DC cables that meet international standards for safety and performance. Designed to withstand harsh weather conditions, Orient cables ensure reliable power transmission for residential and commercial solar systems.",
  },
  POLYCAB: {
    tagline: "Connection Zindagi Ka. Leading Cable Manufacturer.",
    description: "Polycab is India's leading cable and wire manufacturer. Their Solar DC cables are specially designed for solar power applications, featuring cross-linked polyolefin insulation for superior thermal and chemical resistance, ensuring a long service life for your solar PV system.",
  },
};

const Shop = () => {
  const { addToCart } = useCart();
  const { data } = useAdmin();

  const categories = ['All', ...Array.from(new Set([...data.modules.map(m => m.name), 'Solar DC Cables'])).sort((a, b) => {
    const desiredOrder = [
      'Solar Modules ( Panels )',
      'Eversol Roof Top Kit',
      'Solar On Grid Inverter',
      'Solar Hybrid Inverter',
      'Solar Roof Top On Grid Kit',
      'Solar Roof Top Hybrid Kit',
      'Battery Energy Storage System ( BESS )',
      'Solar Earthing Kit',
      'Solar DC Cables'
    ];

    const indexA = desiredOrder.indexOf(a);
    const indexB = desiredOrder.indexOf(b);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  })];

  const getBrandsForCategory = (categoryName: string) => {
    const mod = data.modules.find(m => m.name === categoryName);
    const brands = mod ? data.brands.filter(b => b.moduleId === mod.id) : [];

    // 1. Custom sort for "Solar Modules ( Panels )"
    if (categoryName.toLowerCase().includes('module') || categoryName.toLowerCase().includes('panel')) {
      const excelOrder = ['SOLEX', 'WAAREE', 'PANASONIC', 'AXITEC'];
      return [...brands].sort((a, b) => {
        const indexA = excelOrder.indexOf(a.name.toUpperCase());
        const indexB = excelOrder.indexOf(b.name.toUpperCase());

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.name.localeCompare(b.name);
      });
    }

    // 2. Custom brands for "Solar DC Cables"
    if (categoryName === 'Solar DC Cables') {
      const excelOrder = ['APAR', 'ORIENT', 'POLYCAB'];
      const brandsMap = new Map(brands.map(b => [b.name.toUpperCase().trim(), b]));

      const result = excelOrder.map(name => {
        const existing = brandsMap.get(name);
        if (existing) return existing;
        return { id: `mock-${name.toLowerCase()}`, name, moduleId: mod?.id || 'solar-dc-cables', createdAt: new Date().toISOString() };
      }) as any[];

      // Add any other brands from DB that aren't in the list
      brands.forEach(b => {
        if (!excelOrder.includes(b.name.toUpperCase().trim())) {
          result.push(b);
        }
      });
      return result;
    }

    // 2. Custom sort for product brands (DCR first, then by Kw value)
    return [...brands].sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();

      const isNonDcrA = nameA.includes('NON DCR');
      const isNonDcrB = nameB.includes('NON DCR');

      // DCR comes before NON DCR
      if (isNonDcrA !== isNonDcrB) {
        return isNonDcrA ? 1 : -1;
      }

      // Extract Kw value
      const getKw = (name: string) => {
        const match = name.match(/(\d+)Kw/i) || name.match(/K(\d+)w/i);
        return match ? parseInt(match[1]) : 0;
      };

      const kwA = getKw(nameA);
      const kwB = getKw(nameB);

      if (kwA !== kwB) {
        return kwA - kwB;
      }

      // Fallback to alphabetical
      return nameA.localeCompare(nameB);
    });
  };

  const getDefaultImage = (categoryName: string) => {
    const cat = categoryName.toLowerCase();
    if (cat.includes('inverter')) return inverterImg;
    if (cat.includes('module') || cat.includes('panel')) return panelImg;
    if (cat.includes('storage') || cat.includes('battery')) return batteryImg;
    return kitImg;
  };

  const mappedProducts = data.products.map(p => {
    // CRITICAL: moduleId/brandId may be buried in extraFields in the new schema
    const pAny = p as any;
    const resolvedModuleId = p.moduleId || pAny.extraFields?.moduleId || '';
    const resolvedBrandId = p.brandId || pAny.extraFields?.brandId || '';

    // Support BOTH old schema (moduleId/brandId lookup) AND new flat schema (category/brandName)
    const mod = data.modules.find(m => m.id === resolvedModuleId);
    const br = data.brands.find(b => b.id === resolvedBrandId);

    // Resolve category: prefer module lookup, fall back to flat 'category' field
    const categoryName = mod?.name || pAny.category || 'General';
    // Resolve brand: prefer brand lookup, fall back to flat 'brandName' field
    const brandName = br?.name || pAny.brandName || '';

    // Resolve image: uploaded image or category default
    const image = (p.images && p.images.length > 0) ? p.images[0] : getDefaultImage(categoryName);

    // Build specifications: merge flat spec fields + array of {key,value}
    const flatSpecMap: Record<string, string> = {};
    const flatFields: Array<[string, any]> = [
      ['MONO/BIFACIAL', (p as any).mono_bifacial],
      ['Model / Type', (p as any).model_number],
      ['Wattage (W)', (p as any).wattage_w],
      ['Cell Type', (p as any).cell_type],
      ['Module Efficiency (%)', (p as any).module_efficiency],
      ['No. of Cells', (p as any).no_of_cells],
      ['Available Stock', (p as any).available_stock],
      ['Battery Type', (p as any).battery_type],
      ['Capacity (kWh/Ah)', (p as any).capacity_kwh_ah],
      ['Battery Nominal Voltage', (p as any).battery_nominal_voltage_v],
      ['Operating Voltage', (p as any).operating_voltage],
      ['Cycle Life', (p as any).cycle_life],
      ['Cooling', (p as any).cooling],
      ['Compatible Inverters', (p as any).compatible_inverters],
      ['System Size (kW)', (p as any).system_size_kw],
      ['Included Module Brand', (p as any).included_module_brand],
      ['Included Inverter Brand', (p as any).included_inverter_brand],
      ['Structure Type', (p as any).structure_type],
      ['Area Required (sq.ft)', (p as any).area_required_sqft],
      ['Subsidy Eligible', (p as any).subsidy_eligible],
      ['Installation Included', (p as any).installation_included],
      ['Meters', (p as any).meters],
      ['Total Price', (p as any).total_price],
    ];
    flatFields.forEach(([k, v]) => { if (v !== undefined && v !== null && String(v).trim() !== '') flatSpecMap[k] = String(v); });
    const arraySpecs = (p.specifications || []).reduce((acc: any, s) => { acc[s.key] = s.value; return acc; }, {});
    const specifications = { ...flatSpecMap, ...arraySpecs };

    // Resolve capacity from multiple fallbacks
    const capacity = p.capacity || (p as any).capacity_kwh_ah || (p as any).wattage_w || (p as any).system_size_kw || '';

    // Resolve productType
    const productType = p.productType || (p as any).product_type || (p as any).battery_type || '';

    // Resolve features/benefits (handle comma-string from new schema)
    const rawBenefits = (p as any).benefits;
    let features: string[] = [];
    if (Array.isArray(p.benefits) && p.benefits.length > 0) features = p.benefits;
    else if (typeof rawBenefits === 'string' && rawBenefits.trim()) features = rawBenefits.split(',').map((s: string) => s.trim()).filter(Boolean);
    else if (Array.isArray(p.applications) && p.applications.length > 0) features = p.applications;

    // 4. Resolve Model Number with Brand lookup fallback
    let finalModel = flatSpecMap['Model / Type'] || arraySpecs['Model Number'] || (p as any).model_number || (p as any).model || '';
    const brandLower = brandName.toLowerCase().trim();
    const enrichmentBrands = ['solplanet', 'involtics', 'sunways', 'turno volt', 'dyness']; // Brands that should have model enrichment

    if (!finalModel && enrichmentBrands.some(b => brandLower.includes(b))) {
      finalModel = findBrandModel(brandName, capacity, p.price || 0, p.phase) || '';
    }
    const isRedundantModel = ['dcr', 'non dcr', 'nondcr'].includes(String(finalModel).toLowerCase().trim());

    if (!isRedundantModel && finalModel) {
      specifications['Model / Type'] = finalModel;
    }

    // Robust case-insensitive cleanup of model-related keys to avoid duplicates
    Object.keys(specifications).forEach(k => {
      const lowerK = k.toLowerCase().trim();
      if ((lowerK === 'model number' || lowerK === 'model / type' || lowerK === 'model') && k !== 'Model / Type') {
        delete (specifications as any)[k];
      }
    });

    if (!specifications['Model / Type'] && isRedundantModel) {
      delete (specifications as any)['Model / Type'];
    }

    const wifiBrands = ['involtics', 'sunways'];
    const isWIFIDevice = (wifiBrands.some(b => brandName.toLowerCase().includes(b)) &&
      (categoryName.toLowerCase().includes('hybrid') || categoryName.toLowerCase().includes('on-grid') || categoryName.toLowerCase().includes('on grid'))) ||
      categoryName.toLowerCase().includes('battery') ||
      categoryName.toLowerCase().includes('energy storage') ||
      categoryName.toLowerCase().includes('bess');

    let finalName = p.title || '';
    // Replace WIFI with accurate MPPT info for Solplanet on-grid inverters
    if (brandName.toLowerCase().includes('solplanet')) {
      // Specifically handle "WIFI" in title
      if (finalName.toUpperCase().includes('WIFI')) {
        const mpptKey = Object.keys(specifications).find(k => k.toLowerCase().includes('mppt'));
        if (specifications[mpptKey || '']) {
          finalName = specifications[mpptKey || ''];
        } else {
          const capStr = String(capacity).replace(/[^\d.]/g, '');
          const isThreePhase = (p.phase || (p as any).phase || '').toLowerCase().includes('3ph') || (p.phase || (p as any).phase || '').toLowerCase().includes('three');
          const match = SOLPLANET_MODELS.find(m => m.capacity === capStr && (isThreePhase ? m.phase === '3Ph' : m.phase === '1Ph'));
          if (match?.mppt) finalName = match.mppt;
          else if (categoryName.toLowerCase().includes('on grid')) {
            finalName = isThreePhase ? '2-10 MPPT' : '1-2 MPPT';
          } else {
            finalName = finalName.replace(/WIFI/gi, '').trim() || 'Solar Inverter';
          }
        }
      }
    }

    if (
      categoryName.toLowerCase().includes('panel') ||
      categoryName.toLowerCase().includes('module') ||
      isWIFIDevice
    ) {
      specifications['Features'] = finalName;
    }

    return {
      id: p.id,
      name: finalName,
      category: categoryName,
      brand: brandName,
      isSolarPanel: categoryName.toLowerCase().includes('panel') || categoryName.toLowerCase().includes('module'),
      capacity,
      price: p.price || 0,
      benefit: (() => {
        if (brandName.toLowerCase().includes('solplanet') && categoryName.toLowerCase().includes('on grid')) {
          const phaseStr = (p.phase || (p as any).phase || '').trim();
          if (phaseStr && !phaseStr.toUpperCase().includes('MPPT') && finalName.toUpperCase().includes('MPPT')) {
            return `${phaseStr} - ${finalName}`;
          }
          return phaseStr ? phaseStr : finalName;
        }
        let desc = p.description || '';
        if (brandName.toLowerCase().includes('solplanet')) {
          desc = desc.replace(/WIFI/gi, '').trim();
        }
        return desc;
      })(),
      image,
      images: p.images || [],
      warranty: (() => {
        if (p.warranty) return p.warranty;
        if (categoryName === 'Solar Roof Top Hybrid Kit') {
          const wKey = Object.keys(specifications).find(k => k.toLowerCase().includes('warranty'));
          if (wKey) return String(specifications[wKey]).replace(/^[:\s-]+/, '').trim();
        }
        return '';
      })(),
      datasheet: p.datasheet || '',
      specifications,
      features,
      productType,
      phase: p.phase || '',
      isOutOfStock: !!p.isOutOfStock,
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollUpBtn, setShowScrollUpBtn] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Responsive Items Per Page
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1024 ? 200 : 20);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset page and scroll to results on mobile when filters change
  useEffect(() => {
    setCurrentPage(1);
    
    // Check if the current category has brands
    const currentBrands = getBrandsForCategory(selectedCategory);
    const hasBrands = currentBrands.length > 0;

    // SCROLL LOGIC:
    // 1. Scroll if a brand is specifically selected
    // 2. Scroll if a category name that has NO brands is selected
    // 3. Scroll if 'All' is selected
    if (window.innerWidth < 1024) {
      const shouldScroll = selectedBrand !== null || (selectedCategory === 'All') || !hasBrands;
      
      if (shouldScroll) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300); // Slightly longer delay for better feel
      }
    }
  }, [selectedCategory, selectedBrand, selectedInverterType, selectedInverterBrand, searchQuery]);

  // Show floating button and detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Bottom button show threshold
      setShowScrollTop(currentScrollY > 600);

      // Top button show logic (scrolling up after threshold)
      if (currentScrollY > 600) {
        if (currentScrollY < lastScrollY) {
          setShowScrollUpBtn(true);
        } else {
          setShowScrollUpBtn(false);
        }
      } else {
        setShowScrollUpBtn(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
    const isInverter = selectedCategory === 'Solar Inverters';

    // Module validation: only show products linked to current modules
    const matchesModuleLink = data.modules.some(m => m.id === (product.id ? data.products.find(p => p.id === product.id)?.moduleId : ''));

    // Brand filtering — applies to all categories
    const matchesBrand = !selectedBrand ||
      (product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase());

    const matchesInverterType = !isInverter || !selectedInverterType ||
      (product.productType === selectedInverterType);
    const matchesInverterBrand = !isInverter || !selectedInverterBrand ||
      (product.brand && product.brand.toLowerCase() === selectedInverterBrand.toLowerCase());

    return matchesCategory && matchesSearch && matchesBrand && matchesInverterType && matchesInverterBrand;
  }).sort((a, b) => {
    // Custom sort for Solar On Grid/Hybrid (Solplanet and Involtics) by capacity
    if (selectedCategory === 'Solar On Grid' || selectedCategory === 'Solar Hybrid') {
      const isTargetA = a.brand?.toUpperCase() === 'SOLPLANET' || a.brand?.toUpperCase() === 'INVOLTICS';
      const isTargetB = b.brand?.toUpperCase() === 'SOLPLANET' || b.brand?.toUpperCase() === 'INVOLTICS';

      if (isTargetA && isTargetB) {
        const getCap = (c: string) => parseFloat(String(c).match(/(\d+(\.\d+)?)/)?.[0] || '0');
        return getCap(a.capacity) - getCap(b.capacity);
      }
    }
    return 0;
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
    <>
      <Layout>
      {/* Hero */}
      <ProductsHero />

      {/* Main Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div id="product-search" className="bg-white rounded-xl shadow-sm p-6 mb-8 lg:sticky lg:top-20 z-30">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
              <div className="flex flex-row gap-2 w-full lg:w-96">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
                          const isChangingCategory = selectedCategory !== category;
                          setSelectedCategory(category);
                          // Toggle brand dropdown for categories with brands
                          if (getBrandsForCategory(category).length > 0) {
                            setOpenBrandDropdown(openBrandDropdown === category ? null : category);
                          } else {
                            setOpenBrandDropdown(null);
                          }
                          // Keep existing inverter filter toggle
                          setIsInverterFiltersOpen(category === 'Solar Inverters' ? !isInverterFiltersOpen : false);

                          // Reset filters only when changing category
                          if (isChangingCategory) {
                            setSelectedBrand(null);
                            setSelectedInverterType(null);
                            setSelectedInverterBrand(null);
                          }
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
          <div ref={resultsRef} className="py-16 bg-background pt-8 scroll-mt-24">
            <div className="container mx-auto px-4">
              

              <div className="mb-8">
                Showing {Math.min(filteredProducts.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(filteredProducts.length, currentPage * itemsPerPage)} of {data.catalogStats.products} products
              </div>

              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
              }>
                {filteredProducts
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((product, index) => (
                    <Link key={product.id} to={`/product/${product.id}`} className="block cursor-pointer">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className={`group bg-card rounded-2xl overflow-hidden border-4 border-orange-500 hover:border-orange-600 transition-all duration-300 card-hover h-full ${viewMode === 'list' ? 'flex flex-row' : ''
                          }`}
                      >
                        <div className={`relative flex justify-center items-center overflow-hidden bg-card ${viewMode === 'list' ? 'w-28 sm:w-48 shrink-0' : 'aspect-square h-64'
                          }`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className={`w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105 ${product.isOutOfStock ? 'grayscale opacity-50' : ''}`}
                          />
                          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold max-w-[80%] truncate">
                            {product.category}
                          </span>
                          {product.isOutOfStock && (
                            <>
                              <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-10" />
                              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6">
                                <img
                                  src="/images/out-of-stock-illustration.png"
                                  alt="Out of stock"
                                  className="w-1/2 h-auto object-contain drop-shadow-xl mb-2"
                                />
                                <div className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg uppercase tracking-widest border border-white/20">
                                  Currently Out of Stock
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        <div className={`flex flex-col min-w-0 ${viewMode === 'list' ? 'p-3 sm:p-6 flex-1' : 'p-6 flex-1'}`}>
                          {product.category.toLowerCase().includes('storage') ? (
                            <>
                              <h3 className={`font-heading font-semibold text-muted-foreground mb-1 group-hover:text-foreground transition-colors ${viewMode === 'list' ? 'text-lg line-clamp-2' : 'text-xl line-clamp-1'}`}>
                                {product.name}
                              </h3>
                              {/* 1. Brand (Now under name) */}
                              {product.brand && (
                                <div className="text-xs font-heading font-bold text-primary mb-4 uppercase tracking-wider leading-none">
                                  {product.brand}
                                </div>
                              )}

                              {/* 2. Specs Box */}
                              <div className="grid grid-cols-2 gap-x-2 gap-y-2.5 text-[10px] mb-3 bg-slate-50/80 p-3 rounded-lg border border-slate-100/50">
                                <div className="flex flex-col">
                                  <span className="text-slate-500 font-heading font-semibold mb-0.5 uppercase tracking-wider text-[10px]">Capacity</span>
                                  <span className="font-heading font-bold text-slate-800">{product.capacity || '-'}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-slate-500 font-semibold mb-0.5 uppercase tracking-wider text-[10px]">Voltage</span>
                                  <span className="font-bold text-slate-800 truncate" title={product.specifications?.['Battery Nominal Voltage'] || product.specifications?.['Battery Nomi'] || product.specifications?.['Operating V'] || product.specifications?.['Operating Voltage Range'] || '-'} >{product.specifications?.['Battery Nominal Voltage'] || product.specifications?.['Battery Nomi'] || product.specifications?.['Operating V'] || product.specifications?.['Operating Voltage Range'] || '-'}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-slate-500 font-semibold mb-0.5 uppercase tracking-wider text-[10px]">Cycle Life</span>
                                  <span className="font-bold text-slate-800">{product.specifications?.['Cycle Life'] || '-'}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-slate-500 font-semibold mb-0.5 uppercase tracking-wider text-[10px]">{['solplanet', 'involtics', 'sunways', 'turno volt', 'dyness'].some(b => product.brand?.toLowerCase().trim().includes(b)) ? 'Model' : 'Warranty'}</span>
                                  <span className="font-bold text-slate-800 truncate">
                                    {['solplanet', 'involtics', 'sunways', 'turno volt', 'dyness'].some(b => product.brand?.toLowerCase().trim().includes(b))
                                      ? `Model: ${product.specifications['Model / Type'] || product.specifications['Model Number'] || (product as any).model_number || (product as any).model || product.warranty}`
                                      : (product.warranty || '-')}
                                  </span>
                                </div>
                              </div>

                              {/* 3. Badges (Type & Cooling) */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {product.productType && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-full uppercase font-bold tracking-wide">{product.productType}</span>}
                                {product.specifications?.['Cooling'] && <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[10px] rounded-full uppercase font-bold tracking-wide">{product.specifications['Cooling']}</span>}
                              </div>

                              {/* 4. Sub-info (Description & Brand) */}
                              <div className="flex flex-wrap items-center gap-2 mb-4 mt-auto pt-2">
                                <span className="text-sm font-medium text-gray-400 line-clamp-1 flex-1 italic">{product.benefit || 'Energy Storage Module'}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* 1. Type (and phase if applicable) */}
                              <div className="flex flex-wrap gap-2 mb-2">
                                {product.productType && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-full uppercase font-bold tracking-wide">{product.productType}</span>}
                                {product.phase && <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] rounded-full uppercase font-bold tracking-wide">{product.phase}</span>}
                              </div>

                              <h3 className={`font-heading font-semibold text-muted-foreground mb-1 group-hover:text-foreground transition-colors ${viewMode === 'list' ? 'text-lg line-clamp-2' : 'text-xl line-clamp-1'}`}>
                                {product.benefit}
                              </h3>
                              {/* 2. Brand Header (Now under benefit) */}
                              {product.brand && (
                                <div className="text-xs font-heading font-bold text-primary mb-4 uppercase tracking-wider leading-none">
                                  {product.brand}
                                </div>
                              )}

                              {/* 3. Watt and Model/Warranty */}
                              <div className="flex flex-wrap items-center gap-2 text-eco text-sm font-heading font-medium mb-2">
                                <span>{product.capacity}{product.capacity && !/[wk]w$/i.test(String(product.capacity)) ? (product.isSolarPanel ? 'W' : 'kW') : ''}</span>
                                <span className="text-muted-foreground">•</span>
                                <span>{['solplanet', 'involtics', 'sunways', 'turno volt'].some(b => product.brand?.toLowerCase().trim().includes(b))
                                  ? `Model: ${product.specifications['Model / Type'] || product.specifications['Model Number'] || (product as any).model_number || (product as any).model || product.warranty}`
                                  : (
                                    <>
                                      <span className="font-semibold">Warranty:</span>
                                      {product.category === 'Solar Roof Top Hybrid Kit' ? product.warranty : `${product.warranty}${(product as any).isSolarPanel ? ' (product)' : ''}`}
                                    </>
                                  )}
                                </span>
                              </div>

                              {/* 4. Title & Brand */}
                              <div className="flex flex-wrap items-center gap-2 mb-4 mt-auto pt-2">
                                <span className="text-xl font-heading font-medium text-gray-400 tracking-wide italic">{product.name}</span>
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
              {filteredProducts.length > itemsPerPage && (
                <div className="mt-12 flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }).map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === Math.ceil(filteredProducts.length / itemsPerPage) ||
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
                    disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
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

    <AnimatePresence>
      {(showScrollTop || showScrollUpBtn) && (
        <motion.div
          initial={{ opacity: 0, y: showScrollUpBtn ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: showScrollUpBtn ? -20 : 20 }}
          className={`fixed ${showScrollUpBtn ? 'top-20' : 'bottom-6'} right-6 z-50 lg:hidden`}
        >
          <Button
            variant="solar"
            size="lg"
            className="rounded-full shadow-2xl gap-2 font-bold py-6 px-6"
            onClick={() => {
              const element = document.getElementById('product-search');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Filter className="h-5 w-5" />
            Change Brand
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Shop;


