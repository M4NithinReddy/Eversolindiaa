import { Shield, Zap, Leaf, Award, Clock, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Shield,
    title: '25 Years Warranty',
    description: 'Industry-leading warranty coverage on all our solar products for complete peace of mind.',
    color: 'solar',
  },
  {
    icon: Zap,
    title: 'High Efficiency',
    description: 'Premium monocrystalline panels with up to 22% efficiency for maximum power generation.',
    color: 'eco',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'Reduce your carbon footprint and contribute to India\'s clean energy mission.',
    color: 'eco',
  },
  {
    icon: Award,
    title: 'Certified Quality',
    description: 'ISO, BIS, and IEC certified products meeting international quality standards.',
    color: 'solar',
  },
  {
    icon: Clock,
    title: 'Quick Installation',
    description: 'Professional installation within 7 days with minimal disruption to your routine.',
    color: 'solar',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock customer support and maintenance services across India.',
    color: 'eco',
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            Why EVERSOL
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            Why Choose <span className="text-primary">EVERSOL</span>?
          </h2>
          <p className="text-lg text-muted-foreground">
            We're committed to delivering premium solar solutions that power your home and business 
            while protecting our planet for future generations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 card-hover"
            >
              <div className={`inline-flex p-4 rounded-xl mb-6 ${
                feature.color === 'solar' ? 'bg-solar/10' : 'bg-eco/10'
              }`}>
                <feature.icon className={`h-8 w-8 ${
                  feature.color === 'solar' ? 'text-solar-dark' : 'text-eco'
                }`} />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
