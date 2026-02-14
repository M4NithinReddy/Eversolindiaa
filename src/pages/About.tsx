import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Award, Users, Lightbulb, ArrowRight } from 'lucide-react';

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Continuously pushing boundaries to deliver cutting-edge solar technology.',
  },
  {
    icon: Heart,
    title: 'Sustainability',
    description: 'Committed to protecting our planet for future generations.',
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description: 'Your satisfaction is our primary measure of success.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Uncompromising quality in every product and service we deliver.',
  },
];

const milestones = [
  { year: '2010', title: 'Founded', description: 'EVERSOL established with a vision for clean energy' },
  { year: '2013', title: '100MW Milestone', description: 'Crossed 100MW cumulative installation capacity' },
  { year: '2016', title: 'Pan-India Presence', description: 'Expanded operations to 15+ states across India' },
  { year: '2019', title: 'Manufacturing', description: 'Launched state-of-the-art panel manufacturing facility' },
  { year: '2022', title: '500MW Achievement', description: 'Surpassed 500MW of total installed capacity' },
  { year: '2025', title: 'Vision 2030', description: 'Targeting 2GW capacity with new technology solutions' },
];

const projects = [
  { image: '/images/pro1.png', title: 'Tech Park Solar Carport', location: 'Bangalore, Karnataka', capacity: '1.2 MW', description: 'Large-scale solar carport providing shade and power for a major IT campus.' },
  { image: '/images/pro2.png', title: 'Industrial Rooftop', location: 'Pune, Maharashtra', capacity: '850 kW', description: 'High-efficiency rooftop installation for a manufacturing unit, offsetting 40% of energy needs.' },
  { image: '/images/pro3.png', title: 'Utility Scale Solar Farm', location: 'Kurnool, Andhra Pradesh', capacity: '5 MW', description: 'Ground-mounted solar park contributing clean energy to the state grid.' },
  { image: '/images/pro4.png', title: 'Residential Community', location: 'Hyderabad, Telangana', capacity: '200 kW', description: 'Rooftop solar solution for a gated community, powering common areas and amenities.' },
  { image: '/images/pro5.png', title: 'Educational Campus', location: 'Chennai, Tamil Nadu', capacity: '500 kW', description: 'Sustainable energy solution for a university campus, reducing carbon footprint.' },
  { image: '/images/pro6.png', title: 'Hospital Backup System', location: 'Delhi, NCR', capacity: '350 kW', description: 'Reliable solar-hybrid system ensuring uninterrupted power for critical healthcare facilities.' },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-solar/20 text-solar font-semibold text-sm mb-4 border border-solar/30">
              About EVERSOL
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground mb-6">
              Powering India's <span className="text-solar">Clean Energy</span> Future
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-6">
              Generate | Conserve | Contribute
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                From Vision to India's Trusted Solar Brand
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Founded in 2010, EVERSOL began with a simple yet powerful vision: to make clean,
                renewable solar energy accessible to every Indian home and business. What started
                as a small team of passionate engineers has grown into one of India's most trusted
                solar energy companies.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Today, with over 500MW of installed capacity across 15+ states, we continue to
                lead India's solar revolution. Our commitment to quality, innovation, and customer
                satisfaction has earned us the trust of over 10,000 customers nationwide.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-solar-dark">500+</div>
                  <div className="text-sm text-muted-foreground">MW Installed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-eco">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
              </div>
            </motion.div>

            <div className="relative">
              <img
                src="/images/home5.png"
                alt="EVERSOL Team at work"
                className="rounded-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl bg-primary text-primary-foreground"
            >
              <div className="p-4 rounded-xl bg-solar/20 w-fit mb-6">
                <Target className="h-10 w-10 text-solar" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Our Mission</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                To accelerate India's transition to clean energy by providing high-quality,
                affordable solar solutions that empower homes, businesses, and communities
                to generate their own sustainable power.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-2xl border-2 border-primary bg-background"
            >
              <div className="p-4 rounded-xl bg-eco/10 w-fit mb-6">
                <Eye className="h-10 w-10 text-eco" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be India's most trusted solar energy partner, contributing 2GW+ of clean
                energy capacity by 2030 and inspiring a nationwide movement towards a
                sustainable, carbon-neutral future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-eco/10 text-eco font-semibold text-sm mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              The Principles That Guide Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="inline-flex p-4 rounded-xl bg-solar/10 mb-6">
                  <value.icon className="h-8 w-8 text-solar-dark" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
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
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground">
              Milestones of Growth
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-primary-foreground/20 hidden md:block" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="inline-block px-4 py-2 rounded-full bg-solar text-accent-foreground font-bold text-lg mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-heading font-bold text-primary-foreground">
                      {milestone.title}
                    </h3>
                    <p className="text-primary-foreground/70 mt-2">
                      {milestone.description}
                    </p>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-solar hidden md:block relative z-10" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Projects */}
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
              Our Projects
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Powering Progress Across India
            </h2>
            <p className="text-muted-foreground mt-4">
              Here's a glimpse of some of our successful installations delivering clean energy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-2xl overflow-hidden bg-white shadow-sm border border-border hover:shadow-md transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white font-medium">{project.location}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <span className="px-2 py-1 bg-solar/10 text-solar-dark text-xs font-bold rounded">
                      {project.capacity}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Join the Solar Revolution
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Be part of India's clean energy future. Let's power your tomorrow together.
            </p>
            <Button variant="solar" size="xl" asChild>
              <Link to="/contact">
                Get Started Today
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
