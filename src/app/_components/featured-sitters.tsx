import Image from 'next/image';
import Link from 'next/link';
import { sitters } from '@/lib/data';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function FeaturedSitters() {
  const featuredSitters = sitters.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Meet Our Amazing Sitters</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Our sitters are the heart of GiggleHugs—caring, professional, and ready to make your child's day brighter.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredSitters.map((sitter) => (
            <Card key={sitter.id} className="overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <CardContent className="p-0">
                <div className="relative h-64 w-full">
                  <Image
                    src={sitter.image.imageUrl}
                    alt={`Profile of ${sitter.name}`}
                    fill
                    className="object-cover"
                    data-ai-hint={sitter.image.imageHint}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{sitter.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground h-10 overflow-hidden">{sitter.bio}</p>
                   <div className="mt-4 flex flex-wrap gap-2">
                    {sitter.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary">{cert}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Button asChild size="lg">
            <Link href="/sitters">Get to Know All Our Sitters</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
