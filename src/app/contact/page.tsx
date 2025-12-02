'use client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
    const { toast } = useToast()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast({
            title: "Message Sent!",
            description: "Thanks for reaching out. We'll get back to you soon!",
        });
        (e.target as HTMLFormElement).reset();
    };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-background">
          <div className="container max-w-7xl text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Get in Touch</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              We're here to answer any questions you may have. Reach out to us and we'll respond as soon as we can.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-primary/5">
          <div className="container max-w-7xl">
            <div className="grid md:grid-cols-2 gap-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>Fill out the form and we'll be in touch.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" placeholder="Sunshine Giggle" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Your Email</Label>
                      <Input id="email" type="email" placeholder="sunshine@gigglehugs.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea id="message" placeholder="Tell us how we can help..." required rows={6}/>
                    </div>
                    <Button type="submit" className="w-full">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
              <div className="space-y-8">
                <h2 className="text-3xl font-bold">Other Ways to Connect</h2>
                <p className="text-muted-foreground">
                  We are always happy to chat! Whether you have questions about our services, want to join our team, or just want to say hello, here's how you can reach us.
                </p>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                           <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Email Us</h3>
                            <p className="text-muted-foreground">info@gigglehugs.org</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                           <Phone className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Call Us</h3>
                            <p className="text-muted-foreground">(123) 456-7890</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                           <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Visit Us</h3>
                            <p className="text-muted-foreground">123 Sunshine Lane, Happyville, USA</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
