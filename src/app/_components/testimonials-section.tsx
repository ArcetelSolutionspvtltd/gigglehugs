'use client';

import Image from 'next/image';
import { testimonials } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-secondary/30">
      <div className="container max-w-7xl">
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
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full max-w-4xl mx-auto mt-16"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-4 h-full">
                  <Card className="h-full flex flex-col">
                    <CardContent className="p-8 flex flex-col items-center text-center flex-grow">
                      <Image
                        src={testimonial.image.imageUrl}
                        alt={`Photo of ${testimonial.name}`}
                        width={80}
                        height={80}
                        className="rounded-full mb-4 border-4 border-primary/20"
                        data-ai-hint={testimonial.image.imageHint}
                      />
                       <div className="flex gap-1 text-primary mb-2">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                       </div>
                      <blockquote className="text-lg italic text-foreground flex-grow">
                        "{testimonial.quote}"
                      </blockquote>
                      <p className="mt-4 font-bold text-lg">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.relation}</p>
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
