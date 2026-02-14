import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Leaf, Sun, Users, Building } from 'lucide-react';

const stats = [
  {
    icon: Sun,
    value: 500,
    suffix: 'MW+',
    label: 'Solar Capacity Installed',
    color: 'solar',
  },
  {
    icon: Leaf,
    value: 250000,
    suffix: '',
    label: 'Tons CO₂ Reduced',
    color: 'eco',
  },
  {
    icon: Users,
    value: 10000,
    suffix: '+',
    label: 'Happy Customers',
    color: 'solar',
  },
  {
    icon: Building,
    value: 500,
    suffix: '+',
    label: 'Commercial Projects',
    color: 'eco',
  },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <span ref={ref} className="counter-glow">
      {formatNumber(count)}{suffix}
    </span>
  );
};

export const ImpactStats = () => {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-solar blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-eco blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-solar/20 text-solar font-semibold text-sm mb-4 border border-solar/30">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-6">
            Powering India's <span className="text-solar">Green Revolution</span>
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Every installation brings us closer to a sustainable future. 
            Here's the impact we've made together.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex p-4 rounded-2xl mb-6 ${
                stat.color === 'solar' ? 'bg-solar/20' : 'bg-eco/20'
              }`}>
                <stat.icon className={`h-10 w-10 ${
                  stat.color === 'solar' ? 'text-solar' : 'text-eco-light'
                }`} />
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-solar mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-primary-foreground/70 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
