import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Building2, Factory, Landmark, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import residentialImg from '@/assets/solution-residential.jpg';
import commercialImg from '@/assets/solution-commercial.jpg';
import industrialImg from '@/assets/solution-industrial.jpg';
import governmentImg from '@/assets/solution-government.jpg';

const solutions = [
  {
    icon: Home,
    title: 'Residential',
    description: 'Power your home with clean solar energy and save up to 90% on electricity bills.',
    image: residentialImg,
    link: '/solutions#residential',
  },
  {
    icon: Building2,
    title: 'Commercial',
    description: 'Reduce operational costs and enhance your business sustainability credentials.',
    image: commercialImg,
    link: '/solutions#commercial',
  },
  {
    icon: Factory,
    title: 'Industrial',
    description: 'Large-scale solar installations for manufacturing and industrial facilities.',
    image: industrialImg,
    link: '/solutions#industrial',
  },
  {
    icon: Landmark,
    title: 'Government',
    description: 'Partner with us for institutional solar projects and public infrastructure.',
    image: governmentImg,
    link: '/solutions#government',
  },
];

export const SolutionsPreview = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-eco/10 text-eco font-semibold text-sm mb-4">
            Our Solutions
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            Solar Solutions for <span className="text-primary">Every Need</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From homes to industries, we provide comprehensive solar solutions tailored 
            to your specific energy requirements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl card-hover"
            >
              <div className="aspect-[4/5] relative">
                <img 
                  src={solution.image} 
                  alt={solution.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="p-3 rounded-xl bg-solar/20 backdrop-blur-sm w-fit mb-4 border border-solar/30">
                    <solution.icon className="h-6 w-6 text-solar" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-2">
                    {solution.title}
                  </h3>
                  <p className="text-primary-foreground/80 text-sm mb-4 line-clamp-2">
                    {solution.description}
                  </p>
                  <Link 
                    to={solution.link}
                    className="inline-flex items-center gap-2 text-solar font-semibold text-sm group-hover:gap-3 transition-all"
                  >
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="default" size="lg" asChild>
            <Link to="/solutions">
              View All Solutions
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
