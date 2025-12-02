import Link from 'next/link';
import { services } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function FeaturedServices() {
  const featuredServices = services.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-secondary/30">
      <div className="container max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Services</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We offer a range of services designed to meet your family's needs with flexibility and care.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <Card key={service.id} className="flex flex-col text-center hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <service.icon className="h-10 w-10 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                <CardDescription className="mt-2 flex-grow">{service.description}</CardDescription>
                <p className="mt-4 text-2xl font-bold text-primary">{service.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Button asChild size="lg">
            <Link href="/services">View All Services & Add-ons</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
