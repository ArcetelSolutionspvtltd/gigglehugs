import { query, queryOne } from '@/lib/db';
import type {
  ContactDetail,
  FAQ,
  Font,
  Service,
  Sitter,
  SocialLink,
  Testimonial,
  ColorTheme,
} from '@/lib/types';

export function getServices(): Promise<Service[]> {
  return query<Service>(
    'select id, title, description, icon_name from public.services order by id'
  );
}

export function getSitters(): Promise<Sitter[]> {
  return query<Sitter>(
    'select id, name, avatar_url, bio, email from public.sitters order by name'
  );
}

export function getSittersByAdmin(): Promise<Sitter[]> {
  return query<Sitter>(
    'select id, name, avatar_url, bio, email from public.sitters order by id'
  );
}

export function getTestimonials(): Promise<Testimonial[]> {
  return query<Testimonial>(
    'select id, name, bio, avatar_url, testimonial, rating from public.testimonials order by id'
  );
}

export function getContactDetails(): Promise<ContactDetail[]> {
  return query<ContactDetail>(
    'select id, type, value from public.contact_details order by id'
  );
}

export function getSocialLinks(): Promise<SocialLink[]> {
  return query<SocialLink>(
    'select id, platform, url, icon_name from public.social_links order by id'
  );
}

export function getFaqs(): Promise<FAQ[]> {
  return query<FAQ>('select id, question, answer from public.faqs order by id');
}

export async function getTheme(): Promise<ColorTheme | null> {
  const row = await queryOne<{ value: ColorTheme }>(
    "select value from public.settings where key = 'theme' limit 1"
  );
  return row?.value ?? null;
}

export async function getFontByName(name: string): Promise<Font | null> {
  return queryOne<Font>(
    'select id, name, css_family, source from public.fonts where name = $1 limit 1',
    [name]
  );
}

export function getFonts(): Promise<Font[]> {
  return query<Font>(
    'select id, name, css_family, source from public.fonts order by name'
  );
}

export type DashboardCounts = {
  sitters: number;
  services: number;
  testimonials: number;
  socialLinks: number;
  contactDetails: number;
  faqs: number;
};

export async function getDashboardCounts(): Promise<DashboardCounts> {
  const row = await queryOne<DashboardCounts>(`
    select
      (select count(*) from public.sitters)::int as sitters,
      (select count(*) from public.services)::int as services,
      (select count(*) from public.testimonials)::int as testimonials,
      (select count(*) from public.social_links)::int as "socialLinks",
      (select count(*) from public.contact_details)::int as "contactDetails",
      (select count(*) from public.faqs)::int as faqs
  `);

  return (
    row ?? {
      sitters: 0,
      services: 0,
      testimonials: 0,
      socialLinks: 0,
      contactDetails: 0,
      faqs: 0,
    }
  );
}
