import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/context/AdminContext';

export const HeroSection = () => {
  const { data } = useAdmin();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-x-0 top-0 h-screen z-0 flex items-center justify-center">
        <img
          src="/images/herohome11.png"
          alt="EVERSOL solar panels at sunset"
          className="h-full w-auto max-w-none object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
      </div>

      {/* Content */}
      <div className="w-full pl-8 md:pl-20 pr-8 relative z-10 py-20">
        <div className="w-full">
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
          </div>

          {/* Subsidy Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="mt-4"
          >
            <div style={{
              background: 'linear-gradient(135deg, rgba(20, 30, 60, 0.7) 0%, rgba(30, 45, 90, 0.7) 100%)',
              border: '1.5px solid rgba(255,165,0,0.3)',
              borderRadius: '16px',
              padding: '8px 12px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              width: '100%',
              maxWidth: '1000px',
            }}>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* Left Side: Title */}
                <div className="flex-shrink-0 bg-white rounded-lg py-3 px-6 text-left shadow-inner text-center lg:text-left">
                  <h2 className="text-xl md:text-2xl font-extrabold leading-tight tracking-tight">
                    <span className="block text-[#0f172a]">PM SuryaGhar</span>
                    <span className="block text-[#ea580c]">Muft Bijli Yojana</span>
                  </h2>
                </div>

                {/* Right Side: Subsidy Details */}
                <div className="flex-grow grid md:grid-cols-2 gap-3 relative w-full">
                  {/* Vertical Divider (Desktop) */}
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2" />

                  {/* Column 1: Residential */}
                  <div className="flex flex-col items-center text-center">
                    <h4 className="text-[10px] font-bold text-white">Subsidy for</h4>
                    <h4 className="text-xs font-extrabold text-[#FFE08A] mb-2">Residential Households</h4>

                    <div className="grid grid-cols-3 gap-1 w-full">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-white">Rs. 30,000</span>
                        <span className="text-[8px] text-white/80"></span>
                        <span className="text-[7px] text-white/60"></span>
                      </div>
                      <div className="flex flex-col items-center border-l border-white/20 px-1">
                        <span className="text-sm font-bold text-white">Rs. 18,000</span>
                        <span className="text-[8px] text-white/80"></span>
                        <span className="text-[7px] text-white/60 leading-tight"></span>
                      </div>
                      <div className="flex flex-col items-center border-l border-white/20 px-1">
                        <span className="text-sm font-bold text-white">Rs. 78,000</span>
                        <span className="text-[7px] text-white/60 leading-tight"></span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: GHS/RWA */}
                  <div className="flex flex-col items-center text-center">
                    <h4 className="text-[10px] font-bold text-white">Subsidy for <span className="text-[#FFE08A]">GHS/RWA</span></h4>
                    <span className="text-[7px] text-white/70 mb-1 px-2">(Group Housing Society/Resident Welfare Association)</span>

                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-white">Rs. 18,000</span>
                      <span className="text-[8px] text-white/80">per kW</span>
                      <p className="text-[7px] text-white/60 leading-tight mt-1 max-w-[200px]">
                        for common facilities, including EV charging, up to 500 kW Capacity(@3 kW per house)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 mt-10 pt-6 border-t border-primary-foreground/20"
          >
            <div>
              <div className="text-3xl md:text-4xl font-heading font-bold text-solar">{data.catalogStats.brands}+</div>
              <div className="text-primary-foreground/70 text-sm mt-1">Global Brands</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-heading font-bold text-solar">{data.catalogStats.products}+</div>
              <div className="text-primary-foreground/70 text-sm mt-1">Premium Products</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-heading font-bold text-solar">10K+</div>
              <div className="text-primary-foreground/70 text-sm mt-1">Happy Customers</div>
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
