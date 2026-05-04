import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const SubsidyBanner = () => {
  return (
    <div className="bg-solar text-primary py-4 overflow-hidden border-t border-b border-primary/10 relative">
      <div className="flex whitespace-nowrap overflow-hidden items-center group">
        <motion.div
          className="flex items-center gap-8 px-4"
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Duplicate content for seamless scrolling */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <Sparkles className="h-6 w-6 text-primary flex-shrink-0 animate-pulse" />
              <p className="text-xl md:text-2xl font-bold font-heading whitespace-nowrap">
                Get Subsidy upto 78000/*- Under PM SURYAGHAR, Installation Scope Available and PM Suryaghar Subsidy Available upto 78000/*-
              </p>
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-xl md:text-2xl font-bold font-heading">Easy EMI</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-xl md:text-2xl font-bold font-heading">Installation</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
