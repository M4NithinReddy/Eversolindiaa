import { Sparkles, CheckCircle2 } from 'lucide-react';

export const SubsidyBanner = () => {
  return (
    <div className="bg-solar text-primary py-4 border-t border-b border-primary/10">
      <div className="flex flex-wrap items-center justify-center gap-4 px-4">
        <Sparkles className="h-6 w-6 text-primary flex-shrink-0 animate-pulse" />
        <p className="text-xl md:text-2xl font-bold font-heading text-center">
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
    </div>
  );
};
