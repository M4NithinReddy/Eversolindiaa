import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, ArrowRight, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const CTASection = () => {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-solar/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-eco/10 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-solar/20 text-solar font-semibold text-sm mb-6 border border-solar/30">
            <Sun className="h-4 w-4" />
            Start Your Solar Journey Today
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-6">
            Ready to Switch to{' '}
            <span className="text-solar">Clean Energy</span>?
          </h2>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Get a free consultation and customized solar solution for your home or business. 
            Our experts will help you maximize savings and minimize your carbon footprint.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild className="group">
              <Link to="/contact">
                Get Free Quote
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="tel:+911234567890">
                <Phone className="h-5 w-5" />
                Call: +91 123 456 7890
              </a>
            </Button>
          </div>

          <p className="text-primary-foreground/60 text-sm mt-8">
            No obligation • Free site survey • Expert consultation
          </p>
        </motion.div>
      </div>
    </section>
  );
};
