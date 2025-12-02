
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

export const sitters: Sitter[] = [
  {
    id: 'sitter-1',
    name: 'Natsai Mudzengi',
    bio: 'A recent child psychology graduate with a passion for creative play and learning. Natsai brings a ray of sunshine and patience to every family.',
    image: getImage('sitter-1'),
  },
  {
    id: 'sitter-2',
    name: 'Ruvimbo Chigumira',
    bio: 'With over 5 years of experience, Ruvimbo is a natural with kids of all ages. She loves outdoor adventures and crafting.',
    image: getImage('sitter-2'),
  },
  {
    id: 'sitter-3',
    name: 'Shaynese Muzah',
    bio: 'Shaynese brings endless energy and fun to babysitting. She is great at sports, games, and telling silly stories to make anyone laugh.',
    image: getImage('sitter-3'),
  }
];

export const services: Service[] = [
    {
      id: 'service-1',
      title: 'Gentle Care for Infants & Toddlers',
      description: 'Nurturing the youngest hearts with love, patience, and safety. We treat every child as a precious gift from God.',
      icon: Baby,
    },
    {
      id: 'service-2',
      title: 'Playful Learning & Creative Activities',
      description: 'Age-appropriate crafts, storytime, music, and imaginative play to inspire joy, curiosity, and faith-based values.',
      icon: ToyBrick,
    },
    {
      id: 'service-3',
      title: 'Storytime & Biblical Lessons',
      description: 'Short Bible stories, prayers, and songs to teach kindness, honesty, and love in a fun and age-appropriate way.',
      icon: BookOpen,
    },
    {
      id: 'service-4',
      title: 'After-School Care & Homework Help',
      description: 'Supportive guidance that encourages diligence, learning, and positive character development.',
      icon: BookOpen,
    },
    {
      id: 'service-5',
      title: 'Date Night or Parent Respite Care',
      description: 'Safe, loving childcare so parents can rest, recharge, or enjoy time together, knowing their children are in God-centered hands.',
      icon: Star,
    },
    {
      id: 'service-6',
      title: 'Special Needs & Individual Attention',
      description: 'Compassionate care for children who need extra support, embracing patience and grace in all interactions.',
      icon: HandHelping,
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
