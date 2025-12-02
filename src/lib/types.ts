import type { ImagePlaceholder } from '@/lib/placeholder-images';
import type { LucideIcon } from 'lucide-react';

export type Sitter = {
  id: string;
  name: string;
  bio: string;
  image: ImagePlaceholder;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  price?: string;
  icon: LucideIcon;
};

export type Testimonial = {
  id:string;
  name: string;
  relation: string;
  quote: string;
  image: ImagePlaceholder;
};
