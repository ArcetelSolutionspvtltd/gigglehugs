import type { LucideIcon } from 'lucide-react';

export type Sitter = {
  id: number;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export type Service = {
  id: number;
  title: string | null;
  description: string | null;
  icon_name: string | null;
};

export type Testimonial = {
  id: number;
  name: string | null;
  bio: string | null;
  testimonial: string | null;
  avatar_url: string | null;
  rating: number | null;
};

export type ContactDetail = {
  id: number;
  contact_type: string;
  value: string;
}

export type SocialLink = {
  id: number;
  platform: string | null;
  url: string | null;
  icon_name: string | null;
}
