import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sun, Smile, CheckCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const values = [
    { icon: Sun, title: "Joy & Sunshine", description: "We foster a positive and uplifting atmosphere in every home." },
    { icon: Heart, title: "Trust & Safety", description: "Our rigorous vetting process ensures your children are in the safest hands." },
    { icon: Smile, title: "Warmth & Care", description: "We treat every child with the kindness, patience, and attention they deserve." },
];

export default function AboutPage() {
    const aboutImage = PlaceHolderImages.find(img => img.id === 'hero-1');

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <section className="py-16 sm:py-24 bg-secondary/30">
                    <div className="container max-w-7xl text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Our Story</h1>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                            GiggleHugs was founded on a simple idea: childcare should be filled with as much joy, warmth, and laughter as a family's love. We wanted to create a service that parents could trust completely and that kids would be excited about.
                        </p>
                    </div>
                </section>

                <section className="py-16 sm:py-24">
                    <div className="container max-w-7xl">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="prose lg:prose-lg max-w-none text-muted-foreground">
                                <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                                <p>
                                    Our mission is to provide outstanding, reliable, and heartwarming childcare. We connect families with professional, vetted babysitters who are passionate about creating a safe, engaging, and fun environment for children. We aim to be more than just a service; we want to be a trusted partner in your parenting journey, bringing peace of mind to you and joyful moments to your kids.
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mt-8">Our Commitment to You</h3>
                                <ul>
                                    <li><CheckCircle className="inline-block mr-2 h-5 w-5 text-primary" />Thoroughly vetted and background-checked sitters.</li>
                                    <li><CheckCircle className="inline-block mr-2 h-5 w-5 text-primary" />A focus on creative play and positive engagement.</li>
                                    <li><CheckCircle className="inline-block mr-2 h-5 w-5 text-primary" />Flexible and reliable service tailored to your needs.</li>
                                    <li><CheckCircle className="inline-block mr-2 h-5 w-5 text-primary" />Open and clear communication at all times.</li>
                                </ul>
                            </div>
                            <div className="rounded-lg overflow-hidden shadow-lg">
                                {aboutImage && (
                                    <Image
                                        src={aboutImage.imageUrl}
                                        alt="Child playing happily"
                                        width={600}
                                        height={400}
                                        className="object-cover w-full h-full"
                                        data-ai-hint={aboutImage.imageHint}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-24 bg-secondary/30">
                    <div className="container max-w-7xl">
                        <div className="text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Core Values</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                                These principles guide everything we do at GiggleHugs.
                            </p>
                        </div>
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {values.map((value) => (
                                <Card key={value.title} className="text-center">
                                    <CardContent className="p-8">
                                        <value.icon className="mx-auto h-12 w-12 text-primary mb-4" />
                                        <h3 className="text-xl font-bold">{value.title}</h3>
                                        <p className="mt-2 text-muted-foreground">{value.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
