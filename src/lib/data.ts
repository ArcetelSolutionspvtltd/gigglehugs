import type { Sitter, Service, Testimonial } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart, BookOpen, Music, ToyBrick, Baby, HandHelping, Star, Moon } from 'lucide-react';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // Return a default or throw an error
    return PlaceHolderImages[0];
  }
  return image;
};

// This file is now deprecated for homepage data, but can be used for other purposes.
// Homepage data is now fetched from Supabase in src/app/page.tsx.

export const serviceAddons: Service[] = [
    {
        id: 1,
        title: 'Creative Crafts',
        description: 'An hour of guided crafting activities. All materials included.',
        icon_name: 'toy-brick',
      },
      {
        id: 2,
        title: 'Homework Help',
        description: 'Our sitters can provide assistance with school homework for one hour.',
        icon_name: 'book-open',
      },
      {
        id: 3,
        title: 'Music & Movement',
        description: 'A fun session of singing, dancing, and playing simple instruments.',
        icon_name: 'music',
      },
]
