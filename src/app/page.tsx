import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from './_components/hero-section';
import { AboutSection } from './_components/about-section';
import { FeaturedServices } from './_components/featured-services';
import { FeaturedSitters } from './_components/featured-sitters';
import { TestimonialsSection } from './_components/testimonials-section';
import { CtaSection } from './_components/cta-section';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <FeaturedServices />
        <FeaturedSitters />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
