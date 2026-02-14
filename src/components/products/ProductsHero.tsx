import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ImageCarousel from '../solutions/ImageCarousel';

const ProductsHero = () => {
  return (
    <ImageCarousel>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center lg:text-left pt-12"
      >
        <span className="inline-block px-4 py-2 rounded-full bg-eco/20 text-eco-light font-semibold text-sm mb-4 border border-eco/30">
          Premium Solar Products
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          High-Quality Solar <span className="text-solar">Products</span>
        </h1>
        <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0">
          Discover our range of premium solar products designed for maximum efficiency and durability.
          Power your home or business with clean, renewable energy solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Button variant="solar" className="px-8 py-6 rounded-lg transition-all duration-300">
            Shop Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:text-white font-semibold px-8 py-6 rounded-lg transition-all duration-300"
          >
            Learn More
          </Button>
        </div>
      </motion.div>
    </ImageCarousel>
  );
};

export default ProductsHero;
