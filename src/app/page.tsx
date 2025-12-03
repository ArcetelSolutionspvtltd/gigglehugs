import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from './_components/hero-section';
import { AboutSection } from './_components/about-section';
import { ServicesSection } from './_components/services-section';
import { SittersSection } from './_components/sitters-section';
import { TestimonialsSection } from './_components/testimonials-section';
import { ContactSection } from './_components/contact-section';
import { FaqSection } from './_components/faq-section';
import { createClient } from '@/lib/supabase/server';
import type { Service, Sitter, Testimonial, ContactDetail, SocialLink, FAQ } from '@/lib/types';

export default async function Home() {
  const supabase = createClient();
  const { data: services } = await supabase.from('services').select('*').returns<Service[]>();
  const { data: sitters } = await supabase.from('sitters').select('*').order('name').returns<Sitter[]>();
  const { data: testimonials } = await supabase.from('testimonials').select('*').returns<Testimonial[]>();
  const { data: contactDetails } = await supabase.from('contact_details').select('*').returns<ContactDetail[]>();
  const { data: socialLinks } = await supabase.from('social_links').select('*').returns<SocialLink[]>();
  const { data: faqs } = await supabase.from('faqs').select('*').order('id').returns<FAQ[]>();

  const emails = contactDetails?.filter(d => d.type === 2) ?? [];
  const phones = contactDetails?.filter(d => d.type === 1) ?? [];

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
