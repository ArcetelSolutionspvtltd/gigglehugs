import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { services, serviceAddons } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CtaSection } from '../_components/cta-section';

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-background">
          <div className="container max-w-7xl text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Our Services</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              Flexible, reliable, and heartwarming care tailored to your family's schedule and needs.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-secondary/30">
            <div className="container max-w-7xl">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-16">Main Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
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
            </div>
        </section>

        <section className="py-16 sm:py-24 bg-background">
            <div className="container max-w-7xl">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-16">Optional Add-ons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceAddons.map((service) => (
                    <Card key={service.id} className="flex flex-col text-center hover:shadow-xl transition-shadow duration-300 bg-secondary/50">
                    <CardHeader className="items-center">
                        <div className="bg-primary/10 p-3 rounded-full">
                        <service.icon className="h-8 w-8 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                        <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                        <CardDescription className="mt-2 flex-grow">{service.description}</CardDescription>
                        <p className="mt-4 text-xl font-bold text-accent">{service.price}</p>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </div>
        </section>
        
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
