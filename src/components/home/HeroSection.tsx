import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <img 
          src="/images/herohome11.png" 
          alt="EVERSOL solar panels at sunset" 
          className="h-full w-auto max-w-none object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-solar/20 text-solar font-semibold text-sm mb-6 border border-solar/30">
              India's Trusted Solar Energy Partner
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-primary-foreground leading-tight mb-6"
          >
            Powering a{' '}
            <span className="text-solar">Sustainable</span>{' '}
            Tomorrow
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/90 mb-4 max-w-2xl leading-relaxed"
          >
            Join millions of Indians switching to clean, affordable solar energy. 
            Reduce your electricity bills by up to 90% while contributing to a greener planet.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-xl font-heading font-semibold text-solar mb-8"
          >
            Generate | Conserve | Contribute
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="hero" size="xl" asChild className="group">
              <Link to="/shop">
                <ShoppingBag className="h-5 w-5" />
                Shop Solar Products
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/contact">
                <FileText className="h-5 w-5" />
                Get a Free Quote
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary-foreground/20"
          >
            <div>
              <div className="text-3xl md:text-4xl font-heading font-bold text-solar">500+</div>
              <div className="text-primary-foreground/70 text-sm mt-1">MW Installed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-heading font-bold text-solar">10K+</div>
              <div className="text-primary-foreground/70 text-sm mt-1">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-heading font-bold text-solar">25+</div>
              <div className="text-primary-foreground/70 text-sm mt-1">Years Warranty</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-solar"
          />
        </div>
      </motion.div>
    </section>
  );
};
