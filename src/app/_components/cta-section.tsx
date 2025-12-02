import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container max-w-7xl">
        <div className="bg-primary/10 rounded-2xl p-8 sm:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ready to Find the Perfect Sitter?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Let us bring some sunshine and giggles to your day. Get in touch to discuss your family's needs or book a sitter.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="transform transition-transform hover:scale-105">
              <Link href="/contact">Book a Sitter Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="transform transition-transform hover:scale-105">
              <Link href="/contact">Ask a Question</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
