import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { List, Users, Star, HelpCircle, Phone, Link2, Settings, Home, BookOpen } from "lucide-react";

const guideSections = [
  {
    title: 'Dashboard',
    icon: Home,
    content: 'The main dashboard gives you a quick overview of your site\'s content. It shows total counts for services, sitters, testimonials, and more.'
  },
  {
    title: 'Services',
    icon: List,
    content: 'In the Services section, you can add, edit, or delete the babysitting services offered on your website. Each service has a title, description, and an icon.'
  },
  {
    title: 'Sitters',
    icon: Users,
    content: 'Manage your team of sitters here. You can add new sitters, update their name, bio, and email, and upload an avatar for them. The bio has a character limit to keep the layout consistent.'
  },
  {
    title: 'Testimonials',
    icon: Star,
    content: 'Add and manage family testimonials. Each testimonial includes a name, a short bio (e.g., "Parents of two"), a rating from 1 to 5, the testimonial text, and an optional avatar.'
  },
  {
    title: 'FAQs',
    icon: HelpCircle,
    content: 'Here you can manage the Frequently Asked Questions section. Add new questions and answers, or edit existing ones to keep your visitors informed.'
  },
  {
    title: 'Contact Details',
    icon: Phone,
    content: 'Manage the phone numbers and email addresses displayed on your public website. You can add, edit, or delete contact details as needed.'
  },
  {
    title: 'Social Links',
    icon: Link2,
    content: 'Update the social media links that appear in your website\'s footer. You can select the platform and provide the full URL.'
  },
  {
    title: 'Settings',
    icon: Settings,
    content: 'Customize your website\'s appearance. Use the AI Theme Customizer to generate a new color palette for your site by describing the look and feel you want.'
  },
  {
    title: 'Guide',
    icon: BookOpen,
    content: 'This is the guide you are currently reading! It provides a brief explanation of each section in the admin dashboard.'
  }
];

export default function GuidePage() {
  return (
    <div className="flex flex-col gap-8">
       <div>
        <h1 className="text-lg font-semibold md:text-2xl">Admin Dashboard Guide</h1>
        <p className="text-muted-foreground">A quick tour of how to manage your website's content.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Section Explanations</CardTitle>
            <CardDescription>Click on each section to learn more about what it does.</CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {guideSections.map((section) => (
                    <AccordionItem key={section.title} value={section.title}>
                        <AccordionTrigger className="text-lg hover:no-underline">
                            <div className="flex items-center gap-3">
                                <section.icon className="h-5 w-5 text-primary" />
                                <span>{section.title}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground pl-10">
                            {section.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
