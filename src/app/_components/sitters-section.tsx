import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Sitter } from '@/lib/types';
import { User } from 'lucide-react';

type SittersSectionProps = {
  sitters: Sitter[];
};

export function SittersSection({ sitters }: SittersSectionProps) {
  return (
    <section id="sitters" className="py-16 sm:py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Meet Our Sitters</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Every sitter at GiggleHugs is a part of our family. They are chosen for their experience, warmth, and passion for childcare.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sitters.map((sitter, index) => (
            <Card 
              key={sitter.id} 
              className="overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
                <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative h-32 w-32 sm:h-40 sm:w-40 mb-4 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {sitter.avatar_url ? (
                        <Image
                            src={sitter.avatar_url}
                            alt={`Profile of ${sitter.name}`}
                            fill
                            sizes="(max-width: 640px) 128px, 160px"
                            className="object-cover"
                            data-ai-hint="woman smiling"
                        />
                    ) : (
                        <User className="h-16 w-16 text-muted-foreground" />
                    )}
                </div>
                <h3 className="text-2xl font-bold">{sitter.name}</h3>
                <p className="mt-2 text-base text-muted-foreground flex-grow">{sitter.bio}</p>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    </section>
  );
}
