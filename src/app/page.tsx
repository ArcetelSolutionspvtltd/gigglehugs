import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from './_components/hero-section';
import { AboutSection } from './_components/about-section';
import { ServicesSection } from './_components/services-section';
import { SittersSection } from './_components/sitters-section';
import { TestimonialsSection } from './_components/testimonials-section';
import { ContactSection } from './_components/contact-section';
import { FaqSection } from './_components/faq-section';
import {
  getContactDetails,
  getFaqs,
  getServices,
  getSitters,
  getSocialLinks,
  getTestimonials,
} from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [services, sitters, testimonials, contactDetails, socialLinks, faqs] =
    await Promise.all([
      getServices(),
      getSitters(),
      getTestimonials(),
      getContactDetails(),
      getSocialLinks(),
      getFaqs(),
    ]);

  const emails = contactDetails.filter(d => d.type === 2);
  const phones = contactDetails.filter(d => d.type === 1);

  return (
    <div className="flex min-h-screen flex-col">
      <Header socialLinks={socialLinks ?? []} />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection services={services ?? []} />
        <SittersSection sitters={sitters ?? []} />
        <TestimonialsSection testimonials={testimonials ?? []} />
        <FaqSection faqs={faqs ?? []} />
        <ContactSection emails={emails} phones={phones} sitters={sitters ?? []}/>
      </main>
      <Footer socialLinks={socialLinks ?? []} contactDetails={contactDetails ?? []} />
    </div>
  );
}
