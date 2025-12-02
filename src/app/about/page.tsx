import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Heart, Handshake, Smile, BookHeart, HandHelping, CheckCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const values = [
    { icon: Heart, title: "Love & Compassion", description: "We follow Christ’s example, loving every child as He loves us." },
    { icon: Handshake, title: "Integrity & Honesty", description: "We honor God in all we do and teach children to walk in truth." },
    { icon: Smile, title: "Patience & Gentleness", description: "We create a calm, nurturing environment where children feel safe and valued." },
    { icon: BookHeart, title: 'Faith & Guidance', description: 'We share age-appropriate Biblical truths and model Christ-like behavior.' },
    { icon: HandHelping, title: 'Service & Family Support', description: 'We serve families with heart, offering care that encourages parents and nurtures children.' }
];

export default function AboutPage() {
    const aboutImage = PlaceHolderImages.find(img => img.id === 'hero-1');

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <section className="py-16 sm:py-24 bg-primary/5">
                    <div className="container max-w-7xl text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">About GiggleHugs</h1>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                            Learn about our mission to provide joyful, nurturing, and Christ-centered childcare.
                        </p>
                    </div>
                </section>

                <section className="py-16 sm:py-24">
                    <div className="container max-w-7xl">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="prose lg:prose-lg max-w-none text-muted-foreground">
                                <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                                <p>
                                    To provide joyful, nurturing, and Christ-centered childcare, where every child is loved, valued, and guided with kindness, patience, and faith. We aim to support families by creating a safe, playful, and spiritually uplifting environment for children to grow in heart, mind, and spirit.
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mt-8">Our Commitment to You</h3>
                                <ul>
                                    <li><CheckCircle className="inline-block mr-2 h-5 w-5 text-primary" />Thoroughly vetted and background-checked sitters who share our values.</li>
                                    <li><CheckCircle className="inline-block mr-2 h-5 w-5 text-primary" />A focus on creative play and positive, faith-based engagement.</li>
                                    <li><CheckCircle className="inline-block mr-2 h-5 w-5 text-primary" />Flexible and reliable service tailored to your family's needs.</li>
                                    <li><CheckCircle className="inline-block mr-2 h-5 w-5 text-primary" />Open, honest, and clear communication at all times.</li>
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

                <section className="py-16 sm:py-24 bg-primary/5">
                    <div className="container max-w-7xl">
                        <div className="text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Core Values</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                                These biblical and Christ-centered principles guide everything we do.
                            </p>
                        </div>
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {values.map((value) => (
                                <Card key={value.title} className="text-center">
                                    <CardContent className="p-8">
                                         <div className="bg-primary/10 p-4 rounded-full mb-4 inline-block">
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
            </main>
            <Footer />
        </div>
    );
}
