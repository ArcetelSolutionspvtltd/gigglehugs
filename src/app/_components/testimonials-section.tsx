'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import type { Testimonial } from '@/lib/types';
import { User, Star } from 'lucide-react';

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Words of Trust from Our Families</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            See what parents are saying about their GiggleHugs experience.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="flex flex-col h-full">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted flex items-center justify-center ring-4 ring-primary/20 dark:ring-primary/40 ring-offset-4 ring-offset-background">
                            {testimonial.avatar_url ? (
                                <Image
                                    src={testimonial.avatar_url}
                                    alt={testimonial.name || 'Avatar'}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <User className="h-8 w-8 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                            <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 text-primary ${i < (testimonial.rating ?? 0) ? 'fill-primary' : 'fill-none'}`} />
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                      <p className="text-muted-foreground italic flex-grow">&quot;{testimonial.testimonial}&quot;</p>
                      <p className="text-sm font-semibold mt-4 text-foreground">- {testimonial.bio}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
