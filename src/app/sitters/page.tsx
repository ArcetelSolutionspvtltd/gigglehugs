import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { sitters } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CtaSection } from '../_components/cta-section';

export default function SittersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-background">
          <div className="container max-w-7xl text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Meet Our Sitters</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              Every sitter at GiggleHugs is a part of our family. They are chosen for their experience, warmth, and passion for childcare.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-secondary/30">
          <div className="container max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sitters.map((sitter) => (
                <Card key={sitter.id} className="overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <CardContent className="p-0 flex flex-col">
                    <div className="relative h-80 w-full">
                      <Image
                        src={sitter.image.imageUrl}
                        alt={`Profile of ${sitter.name}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        data-ai-hint={sitter.image.imageHint}
                      />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold">{sitter.name}</h3>
                      <p className="mt-2 text-base text-muted-foreground flex-grow">{sitter.bio}</p>
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2">Certifications:</h4>
                        <div className="flex flex-wrap gap-2">
                          {sitter.certifications.map((cert) => (
                            <Badge key={cert} variant="secondary">{cert}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2">Comfortable with:</h4>
                        <div className="flex flex-wrap gap-2">
                          {sitter.ageGroups.map((group) => (
                            <Badge key={group} variant="outline">{group}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
