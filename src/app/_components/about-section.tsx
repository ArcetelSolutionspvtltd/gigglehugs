import { Heart, BookHeart, Smile, HandHelping, Handshake } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

const values = [
    {
        icon: Heart,
        title: 'Love & Compassion',
        description: 'We follow Christ’s example, loving every child as He loves us.'
    },
    {
        icon: Handshake,
        title: 'Integrity & Honesty',
        description: 'We honor God in all we do and teach children to walk in truth.'
    },
    {
        icon: Smile,
        title: 'Patience & Gentleness',
        description: 'We create a calm, nurturing environment where children feel safe and valued.'
    },
    {
        icon: BookHeart,
        title: 'Faith & Guidance',
        description: 'We share age-appropriate Biblical truths and model Christ-like behavior.'
    },
    {
        icon: HandHelping,
        title: 'Service & Family Support',
        description: 'We serve families with heart, offering care that encourages parents and nurtures children.'
    }
]

export function AboutSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Mission</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            "To provide joyful, nurturing, and Christ-centered childcare, where every child is loved, valued, and guided with kindness, patience, and faith. We aim to support families by creating a safe, playful, and spiritually uplifting environment for children to grow in heart, mind, and spirit."
          </p>
        </div>
        <div className="mt-16 text-center">
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Core Values</h3>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                These biblical and Christ-centered principles guide everything we do.
            </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.slice(0, 3).map((value) => (
                <Card key={value.title} className="text-center transform transition-transform hover:scale-105 hover:shadow-lg">
                    <CardContent className="p-8 flex flex-col items-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                            <value.icon className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-bold">{value.title}</CardTitle>
                        <p className="mt-2 text-muted-foreground">{value.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:w-2/3 md:mx-auto">
            {values.slice(3).map((value) => (
                <Card key={value.title} className="text-center transform transition-transform hover:scale-105 hover:shadow-lg">
                    <CardContent className="p-8 flex flex-col items-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                            <value.icon className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-bold">{value.title}</CardTitle>
                        <p className="mt-2 text-muted-foreground">{value.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
