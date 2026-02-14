import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Building2, Factory, Landmark, Check, ArrowRight, Phone } from 'lucide-react';
import ImageCarousel from '@/components/solutions/ImageCarousel';
import residentialImg from '@/assets/solution-residential.jpg';
import commercialImg from '@/assets/solution-commercial.jpg';
import industrialImg from '@/assets/solution-industrial.jpg';
import governmentImg from '@/assets/solution-government.jpg';

const solutions = [
  {
    id: 'residential',
    icon: Home,
    title: 'Residential Solar',
    subtitle: 'Power your home with clean energy',
    description: 'Transform your home into a sustainable power hub with EVERSOL residential solar solutions. Our rooftop systems are designed for Indian homes, offering maximum efficiency and reliability.',
    image: residentialImg,
    benefits: [
      'Reduce electricity bills by up to 90%',
      'Government subsidy up to ₹78,000 for systems up to 3kW',
      'Net metering allows you to sell excess power',
      '25-year performance warranty',
      'Quick installation in 5-7 days',
      'Zero maintenance with remote monitoring',
    ],
    capacities: ['1kW - 3kW', '3kW - 5kW', '5kW - 10kW'],
    idealFor: 'Homes, apartments, villas, and independent houses',
  },
  {
    id: 'commercial',
    icon: Building2,
    title: 'Commercial Solar',
    subtitle: 'Sustainable solutions for businesses',
    description: 'Reduce operational costs and demonstrate your commitment to sustainability with our commercial solar installations. Perfect for offices, hotels, hospitals, educational institutions, and retail spaces.',
    image: commercialImg,
    benefits: [
      'ROI in 3-4 years with accelerated depreciation',
      'Significantly reduce operating expenses',
      'Enhance brand image with green credentials',
      'High-efficiency systems for maximum generation',
      'Dedicated project management team',
      'Custom financing options available',
    ],
    capacities: ['10kW - 50kW', '50kW - 100kW', '100kW - 500kW'],
    idealFor: 'Offices, hotels, hospitals, schools, malls, and warehouses',
  },
  {
    id: 'industrial',
    icon: Factory,
    title: 'Industrial Solar',
    subtitle: 'Large-scale power for manufacturing',
    description: 'Power your industrial operations with megawatt-scale solar installations. Our industrial solutions are engineered for heavy-duty applications with maximum uptime and efficiency.',
    image: industrialImg,
    benefits: [
      'MW-scale installations for large facilities',
      'Ground-mounted and rooftop options',
      'Industrial-grade equipment for harsh environments',
      'Power Purchase Agreements (PPA) available',
      'CAPEX and OPEX models',
      'Dedicated O&M support team',
    ],
    capacities: ['500kW - 1MW', '1MW - 5MW', '5MW+'],
    idealFor: 'Manufacturing plants, data centers, cold storage, and industrial estates',
  },
  {
    id: 'government',
    icon: Landmark,
    title: 'Government & Institutional',
    subtitle: 'Public infrastructure solar solutions',
    description: 'Partner with EVERSOL for government tenders and institutional solar projects. We have extensive experience working with public sector organizations across India.',
    image: governmentImg,
    benefits: [
      'MNRE empaneled solar developer',
      'Experience with KUSUM, PM-KUSUM schemes',
      'Complete tender documentation support',
      'Turnkey project execution',
      'Long-term warranty and AMC options',
      'Compliance with all government standards',
    ],
    capacities: ['Custom capacity as per requirements'],
    idealFor: 'Government buildings, schools, hospitals, railways, and public infrastructure',
  },
];

const Solutions = () => {
  return (
    <Layout>
      {/* Hero with Side-by-Side Layout */}
      <ImageCarousel>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left pt-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-eco/20 text-eco-light font-semibold text-sm mb-4 border border-eco/30">
            Comprehensive Solar Solutions
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground mb-6">
            Solar Solutions for <span className="text-solar">Every Need</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8">
            From residential rooftops to megawatt industrial plants, we provide tailored
            solar solutions that maximize your energy savings and environmental impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button variant="solar" size="lg" asChild>
              <Link to="/contact">
                Get Free Quote
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-white/20 text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </motion.div>
      </ImageCarousel>

      {/* Solutions */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="space-y-32">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.id}
                id={solution.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
              >
                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src={solution.image}
                      alt={solution.title}
                      className="w-full h-auto aspect-[4/3] object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl bg-primary shadow-lg hidden lg:block">
                    <solution.icon className="h-12 w-12 text-solar" />
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-solar/10 text-solar-dark font-semibold text-sm mb-4">
                    <solution.icon className="h-4 w-4" />
                    {solution.subtitle}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                    {solution.title}
                  </h2>

                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    {solution.description}
                  </p>

                  <div className="mb-8">
                    <h4 className="font-heading font-bold text-foreground mb-4">Key Benefits:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {solution.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-eco shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8 p-4 rounded-xl bg-card border border-border">
                    <span className="text-sm text-muted-foreground">Available Capacities:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {solution.capacities.map((capacity, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {capacity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="solar" size="lg" asChild>
                      <Link to="/contact">
                        Get Free Quote
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <a href="tel:+911234567890">
                        <Phone className="h-5 w-5" />
                        Talk to Expert
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-6">
              Not Sure Which Solution is Right for You?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Our solar experts will analyze your energy requirements and recommend the perfect solution.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Schedule Free Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Solutions;
