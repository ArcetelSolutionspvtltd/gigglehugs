import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from './_components/hero-section';
import { AboutSection } from './_components/about-section';
import { ServicesSection } from './_components/services-section';
import { SittersSection } from './_components/sitters-section';
import { TestimonialsSection } from './_components/testimonials-section';
import { ContactSection } from './_components/contact-section';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <SittersSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
