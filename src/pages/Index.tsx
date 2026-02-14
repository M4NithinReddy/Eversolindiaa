import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { SolutionsPreview } from '@/components/home/SolutionsPreview';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ImpactStats } from '@/components/home/ImpactStats';
import { Testimonials } from '@/components/home/Testimonials';
import { Certifications } from '@/components/home/Certifications';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <WhyChooseUs />
      <SolutionsPreview />
      <FeaturedProducts />
      <ImpactStats />
      <Testimonials />
      <Certifications />
      <CTASection />
    </Layout>
  );
};

export default Index;
