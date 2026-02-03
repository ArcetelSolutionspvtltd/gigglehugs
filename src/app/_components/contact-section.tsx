'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, Users, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { ContactDetail, Sitter } from '@/lib/types';
import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

type ContactSectionProps = {
  emails: ContactDetail[];
  phones: ContactDetail[];
  sitters: Sitter[];
}

export function ContactSection({ emails, phones, sitters }: ContactSectionProps) {
    const { toast } = useToast()
    const teamEmails = sitters.filter(s => s.email);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

        if (!serviceId || !templateId || !publicKey) {
            toast({
                title: "Configuration Error",
                description: "The email service is not configured correctly. Please contact the site administrator.",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }

        if (!form.current) {
            setIsSubmitting(false);
            return;
        }

        try {
            await emailjs.sendForm(serviceId, templateId, form.current, publicKey);
            toast({
                title: "Message Sent!",
                description: "Your message has been sent. We'll get back to you soon!",
            });
            form.current.reset();
        } catch (error: any) {
            console.error('FAILED...', error);
            toast({
                title: "Uh oh! Something went wrong.",
                description: "Could not send your message. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Get in Touch</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                We're here to answer any questions you may have. Messages will be sent to shaynesebmuzah@gmail.com.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>Fill out the form and we'll be in touch.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form ref={form} className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" name="user_name" placeholder="e.g., John Doe" required />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" name="subject" placeholder="e.g., Question about weekend care" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Your Email</Label>
                      <Input id="email" type="email" name="user_email" placeholder="your-email@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea id="message" name="message" placeholder="Tell us how we can help..." required rows={6}/>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
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
                              {emails.map(email => 
                                <a key={email.id} href={`mailto:${email.value}`} className="text-muted-foreground hover:text-primary block">
                                  {email.value}
                                </a>
                              )}
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
                     {teamEmails.length > 0 && (
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                              <h3 className="font-semibold text-lg">Our Team</h3>
                              {teamEmails.map(sitter => sitter.email && (
                                <a key={sitter.id} href={`mailto:${sitter.email}`} className="text-muted-foreground hover:text-primary block">
                                  {sitter.email}
                                </a>
                              ))}
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