import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import panelImg from '@/assets/product-solar-panel.jpg';
import inverterImg from '@/assets/product-inverter.jpg';
import batteryImg from '@/assets/product-battery.jpg';
import kitImg from '@/assets/product-rooftop-kit.jpg';

const products = [
  {
    id: 1,
    name: 'EVERSOL Pro 550W Panel',
    category: 'Solar Panels',
    capacity: '550W',
    price: '₹15,999',
    benefit: 'Highest efficiency monocrystalline cells',
    image: panelImg,
  },
  {
    id: 2,
    name: 'EVERSOL PowerMax Inverter',
    category: 'Solar Inverters',
    capacity: '5kW',
    price: '₹45,999',
    benefit: 'Smart MPPT technology with app control',
    image: inverterImg,
  },
  {
    id: 3,
    name: 'EVERSOL LithiumStore',
    category: 'Solar Batteries',
    capacity: '10kWh',
    price: '₹1,25,999',
    benefit: '6000+ cycle life lithium battery',
    image: batteryImg,
  },
  {
    id: 4,
    name: 'EVERSOL Complete Kit',
    category: 'Rooftop Kits',
    capacity: '3kW',
    price: '₹1,89,999',
    benefit: 'All-inclusive home solar solution',
    image: kitImg,
  },
];

export const FeaturedProducts = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16"
        >
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-solar/10 text-solar-dark font-semibold text-sm mb-4">
              Featured Products
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
              Premium <span className="text-primary">Solar Products</span>
            </h2>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link to="/shop">
              View All Products
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 card-hover"
            >
              <div className="aspect-square p-2 bg-solar relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {product.category}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-eco text-sm font-medium mb-2">
                  <Zap className="h-4 w-4" />
                  {product.capacity}
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.benefit}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-heading font-bold text-primary">
                    {product.price}
                  </span>
                  <Button variant="solar" size="sm" asChild>
                    <Link to={`/product/${product.id}`}>
                      <ShoppingCart className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
