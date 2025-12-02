import Link from 'next/link';
import { Heart, Sun, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const values = [
    {
        icon: Sun,
        title: 'Joy & Sunshine',
        description: 'We believe in creating a positive, fun-filled environment where children can thrive.'
    },
    {
        icon: Heart,
        title: 'Trust & Safety',
        description: 'Your child\'s safety and your peace of mind are our highest priorities. All sitters are vetted.'
    },
    {
        icon: Smile,
        title: 'Warmth & Care',
        description: 'Every child is treated with the kindness, patience, and warmth they deserve.'
    }
]

export function AboutSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Welcome to GiggleHugs!</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            At GiggleHugs, our mission is to provide exceptional childcare that feels like an extension of your own family's love and care. We are dedicated to creating a joyful, safe, and nurturing space for your little ones to shine.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
                <Card key={value.title} className="text-center transform transition-transform hover:scale-105 hover:shadow-lg">
                    <CardContent className="p-8">
                        <value.icon className="mx-auto h-12 w-12 text-primary mb-4" />
                        <h3 className="text-xl font-bold">{value.title}</h3>
                        <p className="mt-2 text-muted-foreground">{value.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="mt-16 text-center">
            <Button asChild size="lg">
                <Link href="/about">Learn More About Our Story</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
