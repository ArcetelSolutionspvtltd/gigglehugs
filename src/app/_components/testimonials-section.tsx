'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Star, User } from 'lucide-react';
import { useRef } from 'react';
import type { Testimonial } from '@/lib/types';

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
    );

  return (
    <section className="py-16 sm:py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center">
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
          plugins={[plugin.current]}
          className="w-full max-w-4xl mx-auto mt-16"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/1">
                <div className="p-4 h-full">
                  <Card className="h-full flex flex-col">
                    <CardContent className="p-8 flex flex-col items-center justify-center text-center flex-grow">
                      <div className="relative h-20 w-20 rounded-full overflow-hidden bg-muted flex items-center justify-center mb-4 border-4 border-primary/20">
                        {testimonial.avatar_url ? (
                            <Image
                                src={testimonial.avatar_url}
                                alt={`Photo of ${testimonial.name}`}
                                fill
                                sizes='80px'
                                className="object-cover"
                                data-ai-hint="family photo"
                            />
                        ): (
                            <User className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                       <div className="flex gap-1 text-primary mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < (testimonial.rating ?? 5) ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                       </div>
                      <blockquote className="text-lg italic text-foreground flex-grow mt-4">
                        "{testimonial.testimonial}"
                      </blockquote>
                      <p className="mt-4 font-bold text-lg">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.bio}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex"/>
        </Carousel>
      </div>
    </section>
  );
}
