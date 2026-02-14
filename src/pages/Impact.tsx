import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Leaf, Sun, Droplets, TreePine, Factory, Home, ArrowRight, Battery, Zap, Check, Banknote, HelpCircle, FileText, Clock, ShieldCheck } from 'lucide-react';
import impactHeroImg from '@/assets/impact-hero.jpg';
import ImageCarousel from '@/components/solutions/ImageCarousel';

const impactStats = [
  { icon: Sun, value: 750000000, suffix: '', label: 'kWh Clean Energy Generated', format: 'M' },
  { icon: Leaf, value: 525000, suffix: '', label: 'Tons CO₂ Emissions Prevented', format: 'K' },
  { icon: TreePine, value: 8750000, suffix: '', label: 'Trees Equivalent Planted', format: 'M' },
  { icon: Droplets, value: 2100000000, suffix: '', label: 'Liters of Water Saved', format: 'B' },
];

const AnimatedCounter = ({ value, format }: { value: number; format: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2500;
      const steps = 80;
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
    if (format === 'B') return (num / 1000000000).toFixed(1) + 'B';
    if (format === 'M') return (num / 1000000).toFixed(1) + 'M';
    if (format === 'K') return (num / 1000).toFixed(0) + 'K';
    return num.toLocaleString('en-IN');
  };

  return <span ref={ref}>{formatNumber(count)}</span>;
};

const Impact = () => {
  return (
    <Layout>
      {/* Hero */}
      {/* Hero */}
      <ImageCarousel>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left pt-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-eco/20 text-eco-light font-semibold text-sm mb-4 border border-eco/30">
            Our Environmental Impact
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground mb-6">
            Making a <span className="text-eco-light">Real Difference</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Every solar panel we install contributes to a cleaner, greener India.
            See the collective impact of our sustainable energy solutions.
          </p>
        </motion.div>
      </ImageCarousel>

      {/* Impact Stats */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Our Cumulative <span className="text-primary">Environmental Impact</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              These numbers represent the positive change we've achieved together with our customers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-card border border-border"
              >
                <div className="inline-flex p-4 rounded-xl bg-eco/10 mb-6">
                  <stat.icon className="h-10 w-10 text-eco" />
                </div>
                <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">
                  <AnimatedCounter value={stat.value} format={stat.format} />
                </div>
                <p className="text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solar Education & Financing Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              Comprehensive Solutions
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Tailored Solar Solutions for Every Need
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At EVERSOL, we offer a variety of solar system solutions designed to meet the specific needs of our discerning clients.
              Regardless of your selection, you can count on the outstanding service and maintenance dedication of EVERSOL.
            </p>
          </motion.div>

          {/* Determine Requirement */}
          <div className="mb-24">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-8 text-center">Determine Your Requirement</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-background p-8 rounded-2xl border border-border"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-solar/10 rounded-xl">
                      <Zap className="h-6 w-6 text-solar-dark" />
                    </div>
                    <h4 className="text-xl font-bold">Capacity Needed</h4>
                  </div>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Calculated as per load requirement / quantum of electricity bill</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Varies from state to state for the same electricity bill</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-background p-8 rounded-2xl border border-border"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-eco/10 rounded-xl">
                      <Home className="h-6 w-6 text-eco" />
                    </div>
                    <h4 className="text-xl font-bold">Capacity Updated</h4>
                  </div>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <span className="font-semibold text-foreground">Shadow free space available:</span>
                        <br />Typically, 1 kW system requires 60-70 sq ft
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <span className="font-semibold text-foreground">Sanctioned load:</span>
                        <br />A limit on capacity varies from state to state
                      </div>
                    </li>
                  </ul>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden shadow-lg group"
              >
                <img
                  src="/images/impact1.png"
                  alt="Solar Capacity Planning"
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                    e.currentTarget.parentElement?.classList.add('bg-muted');
                  }}
                />

              </motion.div>
            </div>
          </div>

          {/* Know Your Solar */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2 rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src="/images/impact4.png"
                  alt="Solar System Types"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                    e.currentTarget.parentElement?.classList.add('bg-muted');
                  }}
                />
              </motion.div>
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-4 uppercase tracking-wider">Know Your Solar</h3>
                <p className="text-lg text-muted-foreground">
                  Understanding the different types of solar systems is the first step towards energy independence.
                  Whether you need grid reliability, backup power, or complete autonomy, there's a solution for you.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Grid-Tied System',
                  icon: Sun,
                  desc: 'Most systems are grid-tied, meaning that the solar panels provide power during the day and the power company provides power at night.',
                  features: ['Grid connected', 'No generation during outage', 'Net metering enabled']
                },
                {
                  title: 'Off-Grid System',
                  icon: Battery,
                  desc: 'With an off-grid system, the home or business is fully disconnected from the grid. Solar panels power the load and charge batteries for night use.',
                  features: ['Fully independent', 'Battery equipped', 'Ideal for remote areas']
                },
                {
                  title: 'Hybrid System',
                  icon: Zap,
                  desc: 'Solar panels provide power and charge batteries. The home remains connected to the grid, which serves as a backup power source.',
                  features: ['Best of both worlds', 'Battery backup', 'Grid reliability']
                }
              ].map((system, i) => (
                <motion.div
                  key={system.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-primary text-primary-foreground p-8 rounded-2xl relative overflow-hidden group hover:shadow-xl transition-all"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <system.icon className="h-32 w-32" />
                  </div>
                  <system.icon className="h-10 w-10 mb-6 text-solar" />
                  <h4 className="text-xl font-bold mb-4">{system.title}</h4>
                  <p className="mb-6 opacity-90 leading-relaxed">{system.desc}</p>
                  <ul className="space-y-2 text-sm opacity-80">
                    {system.features.map(f => (
                      <li key={f} className="flex gap-2 items-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-solar" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Financing Section */}
          <div className="bg-gradient-to-br from-solar/10 to-orange-50 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-3 py-1 bg-white text-solar-dark text-xs font-bold rounded mb-4 shadow-sm">
                  SMART FINANCING
                </span>
                <h3 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                  Going Solar has never been <br className="hidden md:block" /> so Easy & Affordable
                </h3>
                <p className="text-gray-700 mb-6 text-lg">
                  Take the right step into the world of Solar Power Solutions with our Hassle-free and Easy Financing Schemes for both Residential Customers as well as SMEs and Corporates.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: Banknote, text: 'Low Interest Rates' },
                    { icon: FileText, text: 'Minimum Documentation' },
                    { icon: Clock, text: 'Quick Processing Speed' },
                    { icon: ShieldCheck, text: 'No Collaterals Required' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                      <item.icon className="h-5 w-5 text-solar" />
                      <span className="font-medium text-gray-800">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="px-6 py-3 bg-gray-900 text-white rounded-xl">
                    <span className="block text-xs opacity-70">ROI</span>
                    <span className="text-xl font-bold">8.5 - 14%</span>
                  </div>
                  <div className="px-6 py-3 bg-white text-gray-900 rounded-xl shadow-sm border border-gray-100">
                    <span className="block text-xs text-gray-500">Tenure</span>
                    <span className="text-xl font-bold">3 - 7 Years</span>
                  </div>
                  <div className="px-6 py-3 bg-white text-gray-900 rounded-xl shadow-sm border border-gray-100">
                    <span className="block text-xs text-gray-500">Down Payment</span>
                    <span className="text-xl font-bold">15 - 30%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {/* Images split for layout matching sample */}
                <div className="relative group">
                  <img
                    src="/images/impact3.png"
                    alt="Residential Solar Finance"
                    className="w-full h-auto rounded-xl shadow-md border-4 border-white transform hover:scale-[1.02] transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="relative group ml-12 -mt-12">
                  <img
                    src="/images/impact2.png"
                    alt="Commercial Solar Finance"
                    className="w-full h-auto rounded-xl shadow-lg border-4 border-white transform hover:scale-[1.02] transition-transform duration-500 relative z-10"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Environmental Benefits */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-eco/10 text-eco font-semibold text-sm mb-4">
                Environmental Benefits
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                How Solar Energy Helps Our Planet
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-eco/10 h-fit">
                    <Leaf className="h-6 w-6 text-eco" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground mb-2">Zero Carbon Emissions</h4>
                    <p className="text-muted-foreground">
                      Solar power generates electricity without releasing harmful greenhouse gases,
                      directly combating climate change.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-solar/10 h-fit">
                    <Droplets className="h-6 w-6 text-solar-dark" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground mb-2">Water Conservation</h4>
                    <p className="text-muted-foreground">
                      Unlike thermal power plants, solar requires minimal water for operation,
                      preserving this precious resource.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-eco/10 h-fit">
                    <Factory className="h-6 w-6 text-eco" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground mb-2">Reduced Air Pollution</h4>
                    <p className="text-muted-foreground">
                      By replacing coal and diesel power, solar significantly reduces air pollutants
                      that affect human health.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-solar/10 h-fit">
                    <TreePine className="h-6 w-6 text-solar-dark" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground mb-2">Ecosystem Protection</h4>
                    <p className="text-muted-foreground">
                      Clean energy reduces the need for mining and drilling, protecting natural
                      habitats and biodiversity.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={impactHeroImg}
                alt="Solar panels in nature"
                className="rounded-2xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Your Impact Calculator */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-solar/20 text-solar font-semibold text-sm mb-4 border border-solar/30">
              Your Potential Impact
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-6">
              What a 5kW System Can Do in 25 Years
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl bg-primary-foreground/10 text-center"
            >
              <Home className="h-10 w-10 text-solar mx-auto mb-4" />
              <div className="text-3xl font-heading font-bold text-solar mb-2">₹18L+</div>
              <p className="text-primary-foreground/80">Electricity Savings</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl bg-primary-foreground/10 text-center"
            >
              <Sun className="h-10 w-10 text-solar mx-auto mb-4" />
              <div className="text-3xl font-heading font-bold text-solar mb-2">1,87,500</div>
              <p className="text-primary-foreground/80">kWh Clean Energy</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl bg-primary-foreground/10 text-center"
            >
              <Leaf className="h-10 w-10 text-eco-light mx-auto mb-4" />
              <div className="text-3xl font-heading font-bold text-eco-light mb-2">131</div>
              <p className="text-primary-foreground/80">Tons CO₂ Prevented</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-2xl bg-primary-foreground/10 text-center"
            >
              <TreePine className="h-10 w-10 text-eco-light mx-auto mb-4" />
              <div className="text-3xl font-heading font-bold text-eco-light mb-2">2,183</div>
              <p className="text-primary-foreground/80">Trees Equivalent</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Start Your Sustainability Journey Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Every kilowatt of solar you install makes a difference. Join thousands of
              eco-conscious Indians powering a greener future.
            </p>
            <Button variant="eco" size="xl" asChild>
              <Link to="/contact">
                Calculate Your Impact
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Impact;
