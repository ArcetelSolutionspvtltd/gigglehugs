'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { ContactDetail, Sitter } from '@/lib/types';

type ContactSectionProps = {
  emails: ContactDetail[];
  phones: ContactDetail[];
  sitters: Sitter[];
}

export function ContactSection({ emails, phones, sitters }: ContactSectionProps) {
    const { toast } = useToast()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, you'd handle form submission here (e.g., send to an API)
        toast({
            title: "Message Sent!",
            description: "Thanks for reaching out. We'll get back to you soon!",
        });
        (e.target as HTMLFormElement).reset();
    };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-background">
        <div className="container">
            <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Get in Touch</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                We're here to answer any questions you may have. Reach out to us and we'll respond as soon as we can.
                </p>
            </div>

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
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="Question about services" required />
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
                    {emails.length > 0 && (
                      <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Mail className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                              <h3 className="font-semibold text-lg">Email Us</h3>
                              {emails.map(email => <p key={email.id} className="text-muted-foreground">{email.value}</p>)}
                          </div>
                      </div>
                    )}
                     {phones.length > 0 && (
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Phone className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                              <h3 className="font-semibold text-lg">Call Us</h3>
                              {phones.map(phone => <p key={phone.id} className="text-muted-foreground">{phone.value}</p>)}
                          </div>
                        </div>
                     )}
                     {sitters.filter(s => s.email).length > 0 && (
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                              <h3 className="font-semibold text-lg">Our Team</h3>
                              {sitters.map(sitter => sitter.email && <p key={sitter.id} className="text-muted-foreground">{sitter.email}</p>)}
                          </div>
                        </div>
                     )}
                </div>
              </div>
            </div>
        </div>
    </section>
  );
}
