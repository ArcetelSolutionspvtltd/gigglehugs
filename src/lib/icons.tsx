import { 
    Heart, BookOpen, Music, ToyBrick, Baby, HandHelping, Star, Moon, 
    type LucideIcon, Twitter, Facebook, Instagram, Linkedin, Rss, Image,
    Smartphone, Mail, Home, List, Users, Link2, Phone, Youtube, HelpCircle,
    Settings, Car, School, Stethoscope, UtensilsCrossed, Palette, Languages, 
    Sparkles, ShieldCheck, Clock, Sun
} from 'lucide-react';

export const iconMap: { [key: string]: LucideIcon } = {
  // Social
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: Smartphone, 
  tiktok: Music,
  rss: Rss,
  
  // Contact
  phone: Phone,
  email: Mail,
  
  // Dashboard Navigation
  home: Home,
  list: List,
  users: Users,
  star: Star,
  'help-circle': HelpCircle,
  settings: Settings,
  link2: Link2,
  'book-open': BookOpen,

  // Service & Value Icons
  heart: Heart,
  music: Music,
  'toy-brick': ToyBrick,
  baby: Baby,
  'hand-helping': HandHelping,
  moon: Moon,
  sun: Sun,
  car: Car,
  school: School,
  stethoscope: Stethoscope,
  'utensils-crossed': UtensilsCrossed,
  palette: Palette,
  languages: Languages,
  sparkles: Sparkles,
  'shield-check': ShieldCheck,
  clock: Clock,
  
  // Default
  default: Image,
};

export const getIcon = (name: string | null): LucideIcon => {
  return name && name in iconMap ? iconMap[name] : iconMap['default'];
};
