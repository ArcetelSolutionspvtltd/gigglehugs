import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Service } from '@/lib/types';
import { getIcon } from '@/lib/icons';

type ServicesSectionProps = {
  services: Service[];
};

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="py-16 sm:py-24 bg-primary/5">
        <div className="container">
            <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Our Services</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                Christ-Centered Babysitting Offerings
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = getIcon(service.icon_name);
              return (
                <Card key={service.id} className="flex flex-col text-center hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="items-center">
                      <div className="bg-primary/10 p-4 rounded-full">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                      <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                      <CardDescription className="mt-2 flex-grow">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
            </div>
        </div>
    </section>
  );
}
