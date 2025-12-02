import type { Sitter, Service, Testimonial } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart, Sun, Smile, ToyBrick, BookOpen, Music } from 'lucide-react';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // Return a default or throw an error
    return PlaceHolderImages[0];
  }
  return image;
};

export const sitters: Sitter[] = [
  {
    id: 'sitter-1',
    name: 'Emily Day',
    age: 24,
    bio: 'A recent child psychology graduate with a passion for creative play and learning. Emily brings a ray of sunshine and patience to every family.',
    certifications: ['CPR Certified', 'First-Aid Trained'],
    ageGroups: ['Infants', 'Toddlers'],
    image: getImage('sitter-1'),
  },
  {
    id: 'sitter-2',
    name: 'Jessica Sunshine',
    age: 28,
    bio: 'With over 5 years of experience, Jessica is a natural with kids of all ages. She loves outdoor adventures and crafting.',
    certifications: ['Early Childhood Education Cert.', 'First-Aid Trained'],
    ageGroups: ['Toddlers', 'Preschoolers'],
    image: getImage('sitter-2'),
  },
  {
    id: 'sitter-3',
    name: 'Mark Giggle',
    age: 26,
    bio: 'Mark brings endless energy and fun to babysitting. He is great at sports, games, and telling silly stories to make anyone laugh.',
    certifications: ['CPR Certified', 'Water Safety Cert.'],
    ageGroups: ['School-Age', 'Pre-Teens'],
    image: getImage('sitter-3'),
  },
  {
    id: 'sitter-4',
    name: 'Sarah Hugs',
    age: 32,
    bio: 'A former nanny with a decade of experience, Sarah is calm, nurturing, and an expert at handling multiple children with ease and grace.',
    certifications: ['Advanced Childcare Cert.', 'First-Aid Trained'],
    ageGroups: ['Infants', 'Multi-Age'],
    image: getImage('sitter-4'),
  },
  {
    id: 'sitter-5',
    name: 'Chloe Light',
    age: 22,
    bio: 'Chloe is an aspiring teacher who loves incorporating educational activities into her sitting sessions. She is fluent in Spanish.',
    certifications: ['CPR Certified'],
    ageGroups: ['Toddlers', 'Preschoolers'],
    image: getImage('sitter-5'),
  },
  {
    id: 'sitter-6',
    name: 'David Beam',
    age: 29,
    bio: 'David is a musician who enjoys sharing his love for music with children. He can play guitar and piano and loves a good sing-along.',
    certifications: ['First-Aid Trained'],
    ageGroups: ['School-Age', 'Pre-Teens'],
    image: getImage('sitter-6'),
  },
];

export const services: Service[] = [
  {
    id: 'service-1',
    title: 'Sunshine Sitting',
    description: 'Our standard daytime babysitting service, filled with fun, play, and attentive care.',
    price: '$25/hr',
    icon: Sun,
  },
  {
    id: 'service-2',
    title: 'Giggle-Time Playdates',
    description: 'We can supervise and facilitate playdates for your child and their friends.',
    price: '$30/hr',
    icon: Smile,
  },
  {
    id: 'service-3',
    title: 'Date Night Hugs',
    description: 'Enjoy your evening out knowing your little ones are in safe, caring hands.',
    price: '$28/hr',
    icon: Heart,
  },
];

export const serviceAddons: Service[] = [
    {
        id: 'addon-1',
        title: 'Creative Crafts',
        description: 'An hour of guided crafting activities. All materials included.',
        price: '+$15',
        icon: ToyBrick,
      },
      {
        id: 'addon-2',
        title: 'Homework Help',
        description: 'Our sitters can provide assistance with school homework for one hour.',
        price: '+$20',
        icon: BookOpen,
      },
      {
        id: 'addon-3',
        title: 'Music & Movement',
        description: 'A fun session of singing, dancing, and playing simple instruments.',
        price: '+$15',
        icon: Music,
      },
]

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'The Miller Family',
    relation: "Parents of 2",
    quote: "GiggleHugs has been a lifesaver! Our sitter, Emily, is an absolute gem. Our kids adore her and we can finally enjoy our date nights without a worry.",
    image: getImage('testimonial-1'),
  },
  {
    id: 'testimonial-2',
    name: 'Susan P.',
    relation: "Mother of Leo (4)",
    quote: "The name says it all! So much joy and warmth from this service. Mark had our son in fits of giggles the whole evening. Highly recommend!",
    image: getImage('testimonial-2'),
  },
  {
    id: 'testimonial-3',
    name: 'David Chen',
    relation: "Father of Mia (6)",
    quote: "Professional, trustworthy, and so caring. Sarah has a magical way with children. We feel so confident leaving Mia in her care. A truly five-star service.",
    image: getImage('testimonial-3'),
  },
];
