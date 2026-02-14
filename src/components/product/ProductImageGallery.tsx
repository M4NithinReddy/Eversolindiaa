import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const visibleThumbnails = 5;

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const scrollUp = () => {
    setStartIndex(prev => Math.max(0, prev - 1));
  };

  const scrollDown = () => {
    setStartIndex(prev => 
      Math.min(images.length - visibleThumbnails, prev + 1)
    );
  };

  const visibleThumbnailsList = images.slice(startIndex, startIndex + visibleThumbnails);

  return (
    <div className="flex gap-4 h-[500px]">
      {/* Thumbnails column */}
      <div className="flex flex-col gap-2 w-20">
        {startIndex > 0 && (
          <button 
            onClick={scrollUp}
            className="w-full flex justify-center py-1 bg-secondary hover:bg-secondary/90 rounded text-black"
            aria-label="Scroll thumbnails up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        )}
        
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-col gap-2">
            {visibleThumbnailsList.map((img, index) => {
              const actualIndex = startIndex + index;
              return (
                <button
                  key={actualIndex}
                  onClick={() => handleThumbnailClick(actualIndex)}
                  className={`w-20 h-20 border-2 rounded overflow-hidden transition-all ${
                    currentImageIndex === actualIndex 
                      ? 'border-secondary' 
                      : 'border-transparent hover:border-secondary/50'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${productName} - View ${actualIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {startIndex + visibleThumbnails < images.length && (
          <button 
            onClick={scrollDown}
            className="w-full flex justify-center py-1 bg-secondary hover:bg-secondary/90 rounded text-black"
            aria-label="Scroll thumbnails down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Main image */}
      <div className="flex-1 bg-white border rounded-lg overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={`${productName} - Main view`}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default ProductImageGallery;
