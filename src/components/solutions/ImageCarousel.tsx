import React, { useEffect, useRef, useState } from 'react';

interface ImageCarouselProps {
  children: React.ReactNode;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ children }) => {
  const images = [
    '/images/solexlogo.png',
    '/images/axitec_logo.jpg',
    '/images/solplanetlogo.png',
    '/images/sunway_logo.png',
    '/images/dyness_logo.jpg',
    '/images/involitics_logo.png',
    '/images/waareelogo.webp',
    '/images/turnovolt_logo.png',
    '/images/apar_logo.png',
    '/images/anchor_logo.png',
    '/images/orient_logo.png',
    '/images/polycab_logo.png'
  ];

  // clones
  const extendedImages = [
    images[images.length - 1],
    ...images,
    images[0],
  ];

  const [index, setIndex] = useState(1);
  const [transition, setTransition] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  // 🔁 Auto scroll (faster)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 1500); // Faster transition for logos

    return () => clearInterval(interval);
  }, []);

  // 🔄 Seamless jump logic
  useEffect(() => {
    if (index === extendedImages.length - 1) {
      setTimeout(() => {
        setTransition(false);
        setIndex(1);
      }, 700);
    }

    if (index === 0) {
      setTimeout(() => {
        setTransition(false);
        setIndex(extendedImages.length - 2);
      }, 700);
    }
  }, [index, extendedImages.length]);

  // Re-enable animation after jump
  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => setTransition(true));
    }
  }, [transition]);

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10">

          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            {children}
          </div>

          {/* Right Carousel */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-solar w-full max-w-lg mt-12">
              <div className="relative h-[220px] overflow-hidden flex items-center">
                <div
                  ref={sliderRef}
                  className={`flex h-full items-center ${transition ? 'transition-transform duration-700 ease-in-out' : ''}`}
                  style={{
                    transform: `translateX(-${index * 100}%)`,
                  }}
                >
                  {extendedImages.map((image, i) => (
                    <div key={i} className="min-w-full h-full flex items-center justify-center">
                      <img
                        src={image}
                        alt={`logo-${i}`}
                        className={`block object-contain ${image.includes('anchor') || image.includes('turnovolt') || image.includes('involitics')
                            ? 'max-h-[160px] max-w-[90%] scale-[1.3]'
                            : 'max-h-[140px] max-w-[80%]'
                          }`}
                      />
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;
