import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-1');

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[720px] flex items-center justify-center text-center text-white overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="relative z-10 p-4 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-shadow-lg" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
          Sunshine, Giggles & Safe Hugs
        </h1>
        <p className="mt-4 max-w-2xl text-lg sm:text-xl md:text-2xl text-shadow-md" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>
          The warm, welcoming, and trustworthy babysitting service that makes parents feel happy and confident.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="transform transition-transform hover:scale-105">
            <Link href="/services">Our Services</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild className="transform transition-transform hover:scale-105">
            <Link href="/sitters">Meet Our Sitters</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
