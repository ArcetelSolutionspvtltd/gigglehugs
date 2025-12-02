import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { services } from '@/lib/data';
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
              Christ-Centered Babysitting Offerings
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-primary/5">
            <div className="container max-w-7xl">
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
