import Image from 'next/image';
import { Heart, Handshake, Smile, BookHeart, HandHelping, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

const values = [
    { icon: Heart, title: "Love & Compassion", description: "We follow Christ’s example, loving every child as He loves us." },
    { icon: Handshake, title: "Integrity & Honesty", description: "We honor God in all we do and teach children to walk in truth." },
    { icon: Smile, title: "Patience & Gentleness", description: "We create a calm, nurturing environment where children feel safe and valued." },
    { icon: BookHeart, title: 'Faith & Guidance', description: 'We share age-appropriate Biblical truths and model Christ-like behavior.' },
    { icon: HandHelping, title: 'Service & Family Support', description: 'We serve families with heart, offering care that encourages parents and nurtures children.' }
];

export function AboutSection() {
    return (
        <section id="about" className="py-16 sm:py-24 bg-background">
            <div className="container mx-auto max-w-7xl px-4 md:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="prose lg:prose-lg max-w-none text-muted-foreground">
                        <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                        <p>
                            To provide joyful, nurturing, and Christ-centered childcare, where every child is loved, valued, and guided with kindness, patience, and faith. We aim to support families by creating a safe, playful, and spiritually uplifting environment for children to grow in heart, mind, and spirit.
                        </p>
                        <h3 className="text-2xl font-bold text-foreground mt-8">Our Commitment to You</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start"><CheckCircle className="inline-block mr-2 h-5 w-5 text-primary flex-shrink-0 mt-1" /><span>Thoroughly vetted and background-checked sitters who share our values.</span></li>
                            <li className="flex items-start"><CheckCircle className="inline-block mr-2 h-5 w-5 text-primary flex-shrink-0 mt-1" /><span>A focus on creative play and positive, faith-based engagement.</span></li>
                            <li className="flex items-start"><CheckCircle className="inline-block mr-2 h-5 w-5 text-primary flex-shrink-0 mt-1" /><span>Flexible and reliable service tailored to your family's needs.</span></li>
                            <li className="flex items-start"><CheckCircle className="inline-block mr-2 h-5 w-5 text-primary flex-shrink-0 mt-1" /><span>Open, honest, and clear communication at all times.</span></li>
                        </ul>
                    </div>
                    <div className="rounded-lg overflow-hidden shadow-lg h-full">
                        <div className="relative w-full h-full min-h-[400px] md:min-h-[500px]">
                            <Image
                                src="/assets/elements/child.png"
                                alt="Child playing happily"
                                fill
                                className="object-cover"
                                data-ai-hint="child playing"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-16 sm:mt-24 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Core Values</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        These biblical and Christ-centered principles guide everything we do.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                    {values.map((value) => (
                        <Card key={value.title} className="text-center border-0 shadow-none bg-transparent">
                            <CardContent className="p-4 flex flex-col items-center">
                                <div className="bg-primary/10 p-4 rounded-full mb-4">
                                    <value.icon className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-lg font-bold">{value.title}</CardTitle>
                                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}