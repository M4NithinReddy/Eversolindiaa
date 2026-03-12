import { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Search, ChevronDown, ChevronRight, Boxes, Tags, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProductGrid from '@/components/catalog/ProductGrid';
import { ProductCardData } from '@/components/catalog/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

/** Map AdminProduct → ProductCardData */
function toCardData(p: ReturnType<typeof useAdmin>['data']['products'][number]): ProductCardData {
  return {
    id: p.id,
    name: p.title,
    image: p.images?.[0],
    specifications: Object.fromEntries(p.specifications.map(s => [s.key, s.value])),
    price: p.price,
    datasheetLink: p.datasheet || undefined,
    capacity: p.capacity || undefined,
    warranty: p.warranty || undefined,
  };
}

const CatalogView = () => {
  const { data, modulesLoading, modulesError, brandsLoading, brandsError } = useAdmin();
  const [search, setSearch] = useState('');
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [filterBrand, setFilterBrand] = useState('');
  const [filterModule, setFilterModule] = useState('');

  const toggleBrand = (id: string) =>
    setExpandedBrands(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleModule = (id: string) =>
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));

  const lowerSearch = search.toLowerCase();

  /** Brands that pass the search + filter */
  const filteredBrands = useMemo(() => {
    return data.brands.filter(b => {
      if (filterBrand && b.id !== filterBrand) return false;
      if (lowerSearch && !b.name.toLowerCase().includes(lowerSearch)) {
        // check if any child module matches too
        const moduleMatch = data.brands
          .filter(br => br.id === b.id)
          .some(() => data.modules.filter(m => m.id === (b as any).moduleId).some(m => m.name.toLowerCase().includes(lowerSearch)));
        if (!moduleMatch) return false;
      }
      return true;
    });
  }, [data.brands, filterBrand, lowerSearch, data.modules]);

  /** Modules under a brand that pass the search + filter */
  const modulesForBrand = (brandId: string) =>
    data.modules.filter(m => {
      const moduleOwned = data.brands.some(b => b.id === brandId && b.moduleId === m.id)
        || (m as any).brandId === brandId;
      // Since modules don't directly have brandId in our schema, show all modules
      // filtered by what's under that brand from brands list
      if (filterModule && m.id !== filterModule) return false;
      if (lowerSearch && !m.name.toLowerCase().includes(lowerSearch)) return false;
      return true;
    });

  const isLoading = modulesLoading || brandsLoading;
  const hasError  = modulesError || brandsError;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="text-sm">Loading catalog…</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-xl p-4">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p className="text-sm">{modulesError || brandsError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search brands, modules…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Brand filter */}
        <select
          value={filterBrand}
          onChange={e => setFilterBrand(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="">All Brands</option>
          {data.brands.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        {/* Module filter */}
        <select
          value={filterModule}
          onChange={e => setFilterModule(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="">All Modules</option>
          {data.modules.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Empty state */}
      {data.brands.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Boxes className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-base font-medium">No brands yet</p>
          <p className="text-sm mt-1">Add brands and modules from the Dashboard tab to see them here.</p>
        </div>
      )}

      {/* Brand → Module → ProductGrid hierarchy */}
      <div className="space-y-4">
        {filteredBrands.map(brand => {
          const brandModules = modulesForBrand(brand.id);
          const isBrandOpen = expandedBrands[brand.id] ?? true;

          return (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Brand header */}
              <button
                onClick={() => toggleBrand(brand.id)}
                className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    {brand.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{brand.name}</p>
                    <p className="text-xs text-gray-500">{brandModules.length} module{brandModules.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                {isBrandOpen
                  ? <ChevronDown className="w-4 h-4 text-gray-400" />
                  : <ChevronRight className="w-4 h-4 text-gray-400" />
                }
              </button>

              {/* Modules under brand */}
              <AnimatePresence>
                {isBrandOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    {brandModules.length === 0 ? (
                      <div className="px-5 py-6 text-center text-gray-400 text-sm">
                        No modules match the current filter.
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {brandModules.map(mod => {
                          const modProducts = data.products
                            .filter(p => p.moduleId === mod.id && p.brandId === brand.id)
                            .map(toCardData);
                          const isModOpen = expandedModules[`${brand.id}-${mod.id}`] ?? true;

                          return (
                            <div key={mod.id} className="px-5 py-4">
                              {/* Module header */}
                              <button
                                onClick={() => toggleModule(`${brand.id}-${mod.id}`)}
                                className="w-full flex items-center justify-between mb-2 group"
                              >
                                <div className="flex items-center gap-2">
                                  <Tags className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {mod.name}
                                  </span>
                                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {modProducts.length} product{modProducts.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                {isModOpen
                                  ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                  : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                }
                              </button>

                              {/* ProductGrid */}
                              <AnimatePresence>
                                {isModOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <ProductGrid products={modProducts} moduleName={mod.name} />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CatalogView;
