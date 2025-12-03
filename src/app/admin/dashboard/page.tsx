import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { admin } from '@/lib/supabase/admin';
import { Users, List, Star, Link2, Phone, HelpCircle } from 'lucide-react';
import { AnimatedCounter } from './_components/animated-counter';

async function getStats() {
  const [
    sitters,
    services,
    testimonials,
    socialLinks,
    contactDetails,
    faqs
  ] = await Promise.all([
    admin.from('sitters').select('*', { count: 'exact', head: true }),
    admin.from('services').select('*', { count: 'exact', head: true }),
    admin.from('testimonials').select('*', { count: 'exact', head: true }),
    admin.from('social_links').select('*', { count: 'exact', head: true }),
    admin.from('contact_details').select('*', { count: 'exact', head: true }),
    admin.from('faqs').select('*', { count: 'exact', head: true })
  ]);

  return {
    sitters: sitters.count ?? 0,
    services: services.count ?? 0,
    testimonials: testimonials.count ?? 0,
    socialLinks: socialLinks.count ?? 0,
    contactDetails: contactDetails.count ?? 0,
    faqs: faqs.count ?? 0,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const statItems = [
    { title: 'Sitters', count: stats.sitters, icon: Users },
    { title: 'Services', count: stats.services, icon: List },
    { title: 'Testimonials', count: stats.testimonials, icon: Star },
    { title: 'FAQs', count: stats.faqs, icon: HelpCircle },
    { title: 'Social Links', count: stats.socialLinks, icon: Link2 },
    { title: 'Contact Details', count: stats.contactDetails, icon: Phone },
  ];

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statItems.map((item, index) => (
          <Card 
            key={item.title} 
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <AnimatedCounter to={item.count} />
              <p className="text-xs text-muted-foreground">Total {item.title.toLowerCase()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
       <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-6"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Welcome to your Dashboard
          </h3>
          <p className="text-sm text-muted-foreground">
            Select a category from the sidebar to manage your site content.
          </p>
        </div>
      </div>
    </>
  );
}
