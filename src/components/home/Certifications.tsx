import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle2 } from 'lucide-react';

const certifications = [
  { name: 'ISO 9001:2015', description: 'Quality Management' },
  { name: 'ISO 14001:2015', description: 'Environmental Management' },
  { name: 'BIS Certified', description: 'Bureau of Indian Standards' },
  { name: 'IEC 61215', description: 'Design Qualification' },
  { name: 'IEC 61730', description: 'Safety Certification' },
  { name: 'MNRE Approved', description: 'Ministry Registered' },
];

export const Certifications = () => {
  return (
    <section className="py-16 bg-background border-y border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-eco" />
            <span className="font-heading font-bold text-lg text-foreground">
              Trusted & Certified
            </span>
          </div>
          <p className="text-muted-foreground">
            Our products meet the highest international quality and safety standards
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-col items-center p-4 rounded-xl bg-card border border-border hover:border-eco/30 transition-colors"
            >
              <div className="p-2 rounded-lg bg-eco/10 mb-3">
                <CheckCircle2 className="h-6 w-6 text-eco" />
              </div>
              <h4 className="font-heading font-bold text-foreground text-center">
                {cert.name}
              </h4>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {cert.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
