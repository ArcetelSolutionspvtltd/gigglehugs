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
import { useEffect, useState } from 'react';

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

const subtitles = [
    "Joyful, nurturing, and Christ-centered childcare for your little ones.",
    "Where little hearts are cherished and big smiles are made.",
    "Your trusted partner in faith-based childcare.",
    "Safe, loving care from our family to yours."
];

export function HeroSection() {
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    (animate as any)(
      '.hero-title-word',
      { y: [20, 0], opacity: [0, 1] },
      { duration: 0.5, delay: stagger(0.1), ease: 'ease-out' }
    );
  }, []);

  useEffect(() => {
    const typeSpeed = isDeleting ? 30 : 60;
    const currentText = subtitles[subtitleIndex];

    const handleTyping = () => {
      if (isDeleting) {
        if (charIndex > 0) {
          setCurrentSubtitle(currentText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setSubtitleIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
        }
      } else {
        if (charIndex < currentText.length) {
          setCurrentSubtitle(currentText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Pause at the end of the sentence before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    };

    const typingTimeout = setTimeout(handleTyping, typeSpeed);
    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, subtitleIndex]);

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
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-shadow-lg" style={{textShadow: '2px 2px 10px rgba(0,0,0,0.6)'}}>
              {heroTitle.map((word, index) => (
                <span key={index} className={`inline-block hero-title-word opacity-0 ${word.className || ''}`}>
                  {word.text}&nbsp;
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-shadow-md min-h-[64px] sm:min-h-[84px]" style={{textShadow: '1px 1px 6px rgba(0,0,0,0.6)'}}>
              {currentSubtitle}
              <span className="animate-pulse">|</span>
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
