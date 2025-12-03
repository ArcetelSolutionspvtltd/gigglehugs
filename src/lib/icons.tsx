import { 
    Heart, BookOpen, Music, ToyBrick, Baby, HandHelping, Star, Moon, 
    type LucideIcon, Twitter, Facebook, Instagram, Linkedin, Rss, Image,
    Smartphone, Mail, Home, List, Users, Link2, Phone
} from 'lucide-react';

export const iconMap: { [key: string]: LucideIcon } = {
  heart: Heart,
  'book-open': BookOpen,
  music: Music,
  'toy-brick': ToyBrick,
  baby: Baby,
  'hand-helping': HandHelping,
  star: Star,
  moon: Moon,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  rss: Rss,
  whatsapp: Smartphone, // Using Smartphone for WhatsApp
  tiktok: Music, // Using Music for TikTok as a placeholder
  phone: Phone,
  email: Mail,
  home: Home,
  list: List,
  users: Users,
  link2: Link2,
  default: Image,
};

export const getIcon = (name: string | null): LucideIcon => {
  return name && name in iconMap ? iconMap[name] : iconMap['default'];
};
