import type { LucideIcon } from 'lucide-react';

export type Sitter = {
  id: number;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
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
  type: 1 | 2; // 1 for phone, 2 for email
  value: string;
}

export type SocialLink = {
  id: number;
  platform: string | null;
  url: string | null;
  icon_name: string | null;
}

export type FAQ = {
  id: number;
  question: string;
  answer: string;
}

export type ColorTheme = {
  primary?: string;
  background?: string;
  accent?: string;
  font?: string;
}

export type Setting = {
    id: number;
    key: string;
    value: any;
}
