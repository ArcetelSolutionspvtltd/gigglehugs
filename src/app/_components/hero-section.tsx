'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImages = [
  PlaceHolderImages.find(img => img.id === 'hero-1'),
  PlaceHolderImages.find(img => img.id === 'hero-2'),
  PlaceHolderImages.find(img => img.id === 'sitter-1'),
].filter(Boolean);

export function HeroSection() {
  return (
    <section className="relative w-full h-[80vh] min-h-[500px] max-h-[800px] text-white overflow-hidden">
      <Carousel
        className="absolute inset-0 w-full h-full"
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        opts={{ loop: true }}
      >
        <CarouselContent className="h-full">
          {heroImages.map((image, index) =>
            image ? (
              <CarouselItem key={index} className="h-full">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  data-ai-hint={image.imageHint}
                />
              </CarouselItem>
            ) : null
          )}
        </CarouselContent>
      </Carousel>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-shadow-lg" style={{textShadow: '2px 2px 10px rgba(0,0,0,0.6)'}}>
            Sunshine Giggles and Hugs
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-shadow-md" style={{textShadow: '1px 1px 6px rgba(0,0,0,0.6)'}}>
            The welcoming, and trustworthy babysitting service that makes parents and kids happy.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="transform transition-transform hover:scale-105">
                <Link href="/services">Our Services</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="transform transition-transform hover:scale-105">
                <Link href="/sitters">Meet Our Sitters</Link>
            </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
