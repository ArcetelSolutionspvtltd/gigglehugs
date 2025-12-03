'use client';

import type { Testimonial } from '@/lib/types';
import NewCarousel from './new-carousel';
import { Star } from 'lucide-react';
import './new-carousel.css';

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const carouselItems = testimonials.map(testimonial => ({
    id: testimonial.id,
    title: testimonial.name || 'Anonymous',
    description: `"${testimonial.testimonial}" — ${testimonial.bio}`,
    icon: <Star className="carousel-icon" />,
  }));

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Words of Trust from Our Families</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            See what parents are saying about their GiggleHugs experience.
          </p>
        </div>
        <div className="flex justify-center">
            {carouselItems.length > 0 && (
                <div style={{ height: '400px', position: 'relative' }}>
                    <NewCarousel
                        items={carouselItems}
                        baseWidth={400}
                        autoplay={true}
                        autoplayDelay={5000}
                        pauseOnHover={true}
                        loop={true}
                        round={false}
                    />
                </div>
            )}
        </div>
      </div>
    </section>
  );
}
