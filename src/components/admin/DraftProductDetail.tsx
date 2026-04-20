import { AdminProduct } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Download, ExternalLink, Image as ImageIcon } from 'lucide-react';

const HighVoltageIcon = ({ className = "h-4 w-4" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M14 8l-4 6h5l-4 6" fill="currentColor" stroke="none" />
  </svg>
);

interface DraftProductDetailProps {
  product: AdminProduct;
  onBack: () => void;
  brandName?: string;
  moduleName?: string;
}

const DraftProductDetail = ({ product, onBack, brandName, moduleName }: DraftProductDetailProps) => {
  const availableStock = product.specifications?.find(s => s.key === 'Available Stock')?.value;
  const getSpecHighlight = (key: string, value: string) => {
    if (key === 'Available Stock' && value.toLowerCase() === 'yes') return 'text-emerald-600 font-semibold';
    if (key.startsWith('Module Efficiency')) return 'text-blue-700 font-semibold';
    if (key.startsWith('Cell Type')) return 'text-purple-700 font-semibold';
    return 'text-gray-900';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Preview
        </Button>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-30" />
                  <p>No Image</p>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-blue-50 text-blue-700 uppercase">
                  {moduleName || 'Unknown Module'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                  {brandName || 'Unknown Brand'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              {product.price > 0 && (
                <div className="text-2xl font-bold text-emerald-600 mb-4">
                  ₹{product.price.toLocaleString()}
                </div>
              )}
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {product.description || 'No description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
              {product.capacity && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">System Size</p>
                  <p className="font-semibold text-gray-900">{product.capacity}</p>
                </div>
              )}
              {product.phase && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phase</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <HighVoltageIcon className="h-4 w-4 text-blue-600" />
                    {product.phase}
                  </p>
                </div>
              )}
              {product.warranty && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Warranty</p>
                  <p className="font-semibold text-gray-900">{product.warranty}</p>
                </div>
              )}
              {product.productType && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Inverter Type</p>
                  <p className="font-semibold text-purple-700 flex items-center gap-1.5">
                    <HighVoltageIcon className="h-4 w-4" />
                    {product.productType}
                  </p>
                </div>
              )}

              {/* Prominent Solar Specifications */}
              {product.specifications.find(s => s.key === 'Area Required') && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Area Required</p>
                  <p className="font-semibold text-gray-900">{product.specifications.find(s => s.key === 'Area Required')?.value} sq.ft</p>
                </div>
              )}
              {product.specifications.find(s => s.key === 'Subsidy Eligible') && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Subsidy Eligible</p>
                  <p className={`font-bold ${product.specifications.find(s => s.key === 'Subsidy Eligible')?.value === 'YES' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {product.specifications.find(s => s.key === 'Subsidy Eligible')?.value}
                  </p>
                </div>
              )}
              {product.specifications.find(s => s.key === 'Meters') && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Meters</p>
                  <p className="font-semibold text-gray-900">{product.specifications.find(s => s.key === 'Meters')?.value}</p>
                </div>
              )}
              {product.specifications.find(s => s.key === 'Installation Included') && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Installation Included</p>
                  <p className="font-semibold text-blue-600">{product.specifications.find(s => s.key === 'Installation Included')?.value}</p>
                </div>
              )}
              {product.specifications.find(s => s.key === 'Structure Type') && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Structure Type</p>
                  <p className="font-semibold text-gray-900">{product.specifications.find(s => s.key === 'Structure Type')?.value}</p>
                </div>
              )}
            </div>

            {/* Specs */}
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Specifications</h3>
                <div className="space-y-2">
                  {product.specifications
                    .filter(spec => ![
                      'Subsidy Eligible',
                      'Installation Included',
                      'Meters',
                      'Structure Type',
                      'Area Required',
                      'System Size'
                    ].includes(spec.key))
                    .map((spec, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-2 py-2 border-b border-gray-50 text-sm">
                        <span className="font-medium text-gray-600 col-span-1">{spec.key}</span>
                        <span className="text-gray-900 col-span-2">{spec.value}</span>
                      </div>
                    ))}
                  {availableStock && (
                    <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      Available Stock: {availableStock}
                    </div>
                  )}
                  <div className="space-y-1 rounded-lg border border-gray-100 overflow-hidden">
                    {product.specifications
                      .filter(s => s.key !== 'Available Stock')
                      .map((spec, idx) => (
                        <div key={idx} className={`flex justify-between items-start gap-4 px-4 py-2.5 text-sm ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                          <span className="font-medium text-gray-600 shrink-0 min-w-0" style={{ maxWidth: '55%' }}>{spec.key}</span>
                          <span className={`text-right min-w-0 ${getSpecHighlight(spec.key, spec.value)}`}>{spec.value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Benefits & Apps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {product.benefits && product.benefits.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Benefits</h3>
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex flex-start gap-2 text-sm text-gray-600">
                        <span className="text-emerald-500 text-lg leading-none select-none shrink-0 mt-0.5">✳</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {product.applications && product.applications.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Applications</h3>
                  <ul className="space-y-2">
                    {product.applications.map((app, idx) => (
                      <li key={idx} className="flex flex-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-500 text-lg leading-none select-none shrink-0 mt-0.5">✳</span>
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Datasheet */}
            {product.datasheet && (
              <div className="pt-4">
                <Button variant="outline" className="w-full sm:w-auto gap-2" asChild>
                  <a href={product.datasheet} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4" /> Download Datasheet
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftProductDetail;
