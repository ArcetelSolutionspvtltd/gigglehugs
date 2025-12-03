'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { animate, stagger } from 'motion';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

const heroImages = [
  {
    src: '/assets/bg/bg-1.jpg',
    alt: 'A child playing happily outdoors.',
    hint: 'child playing'
  },
  {
    src: '/assets/bg/bg-2.jpg',
    alt: 'A babysitter reading a book to a child.',
    hint: 'babysitter reading'
  },
  {
    src: '/assets/bg/bg-3.jpg',
    alt: 'Two children laughing together.',
    hint: 'children laughing'
  },
  {
    src: '/assets/bg/bg-4.jpg',
    alt: 'A child drawing and being creative.',
    hint: 'child drawing'
  }
];

const heroTitle = [
    { text: 'Sunshine' },
    { text: 'Giggles', className: 'text-primary' },
    { text: 'and' },
    { text: 'Hugs', className: 'text-primary' },
];

export function HeroSection() {
  useEffect(() => {
    animate(
      '.hero-title-word',
      { y: [20, 0], opacity: [0, 1] },
      { duration: 0.5, delay: stagger(0.1), easing: 'ease-out' }
    );
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[500px] max-h-[850px] text-white">
      <Carousel
        className="absolute inset-0 w-full h-full"
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {heroImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-screen min-h-[500px] max-h-[850px]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  data-ai-hint={image.hint}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-4xl pt-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-shadow-lg" style={{textShadow: '2px 2px 10px rgba(0,0,0,0.6)'}}>
              {heroTitle.map((word, index) => (
                <span key={index} className={`inline-block hero-title-word opacity-0 ${word.className || ''}`}>
                  {word.text}&nbsp;
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-shadow-md" style={{textShadow: '1px 1px 6px rgba(0,0,0,0.6)'}}>
            Joyful, nurturing, and Christ-centered childcare for your little ones.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="transform transition-transform hover:scale-105">
                <Link href="/#services">Our Services</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="transform transition-transform hover:scale-105">
                <Link href="/#sitters">Meet Our Sitters</Link>
            </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
