import Image from 'next/image';
import { sitters } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SittersSection() {
  return (
    <section id="sitters" className="py-16 sm:py-24 bg-secondary/30">
        <div className="container max-w-7xl">
        <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Meet Our Sitters</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Every sitter at GiggleHugs is a part of our family. They are chosen for their experience, warmth, and passion for childcare.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sitters.map((sitter) => (
            <Card key={sitter.id} className="overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative h-40 w-40 mb-4">
                    <Image
                    src={sitter.image.imageUrl}
                    alt={`Profile of ${sitter.name}`}
                    fill
                    className="object-cover rounded-full border-4 border-white shadow-md"
                    sizes="160px"
                    data-ai-hint={sitter.image.imageHint}
                    />
                </div>
                <h3 className="text-2xl font-bold">{sitter.name}</h3>
                <p className="mt-2 text-base text-muted-foreground flex-grow">{sitter.bio}</p>
                <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2">Certifications:</h4>
                    <div className="flex flex-wrap justify-center gap-2">
                        {sitter.certifications.map((cert) => (
                        <Badge key={cert} variant="secondary">{cert}</Badge>
                        ))}
                    </div>
                </div>
                <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2">Comfortable with:</h4>
                    <div className="flex flex-wrap justify-center gap-2">
                        {sitter.ageGroups.map((group) => (
                        <Badge key={group} variant="outline">{group}</Badge>
                        ))}
                    </div>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    </section>
  );
}
