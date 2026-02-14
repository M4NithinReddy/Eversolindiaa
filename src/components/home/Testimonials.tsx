import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Homeowner, Delhi',
    content: 'EVERSOL transformed our home\'s energy consumption. We\'ve reduced our electricity bill by 85% and the installation was completed in just 5 days. Highly recommend their professional team!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Business Owner, Mumbai',
    content: 'As a business owner, I was skeptical about solar ROI. EVERSOL proved me wrong - our 50kW commercial installation paid for itself in 3 years. Exceptional quality and service.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Dr. Anil Patel',
    role: 'Hospital Administrator, Ahmedabad',
    content: 'For our 200-bed hospital, reliable power is critical. EVERSOL\'s solar + battery solution ensures we never face power outages. Their 24/7 support is outstanding.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Sunita Desai',
    role: 'Homeowner, Bangalore',
    content: 'The team at EVERSOL was incredibly helpful from consultation to installation. Our 5kW system has been running flawlessly for 2 years now. Great investment!',
    rating: 5,
  },
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            What Our <span className="text-primary">Customers Say</span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-0 top-0 -translate-x-4 -translate-y-4 opacity-20">
            <Quote className="h-24 w-24 text-primary" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="text-center px-8 py-12"
            >
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-solar fill-solar" />
                ))}
              </div>
              
              <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 font-body">
                "{testimonials[currentIndex].content}"
              </p>
              
              <div>
                <h4 className="text-xl font-heading font-bold text-foreground">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-muted-foreground">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary w-8' : 'bg-border'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
