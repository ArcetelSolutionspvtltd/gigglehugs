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
    content: 'The main dashboard provides a high-level overview of your website\'s content. It displays the total counts for Services, Sitters, Testimonials, FAQs, Social Links, and Contact Details. These numbers are fetched directly from your database and animate on screen to give you a dynamic summary of your platform\'s scale.'
  },
  {
    title: 'Services',
    icon: List,
    content: 'In the "Services" section, you can manage all the babysitting services your platform offers. When adding or editing a service, you can define its Title, a short Description, and select a relevant Icon from a visual picker. These services are then displayed in a dedicated section on your public-facing homepage.'
  },
  {
    title: 'Sitters',
    icon: Users,
    content: 'Manage your team of sitters here. You can add new sitters or edit existing ones. Each sitter has a Name, an Email, an Avatar, and a Bio. The Bio is limited to 150 characters to ensure a consistent and clean look on the homepage. When you upload an avatar, a cropping tool will appear, allowing you to create a perfect circular profile picture.'
  },
  {
    title: 'Testimonials',
    icon: Star,
    content: 'This section is for managing testimonials from families. Each testimonial includes the family\'s Name, a short Bio (e.g., "Parents of two"), a Rating from 1 to 5 stars, and the Testimonial text itself, which is limited to 150 characters. You can also upload an optional avatar, which can be cropped for a perfect fit.'
  },
  {
    title: 'FAQs',
    icon: HelpCircle,
    content: 'Manage the Frequently Asked Questions (FAQs) section of your website. You can add, edit, or delete question-and-answer pairs. This content is displayed on your homepage in an accordion-style format, allowing visitors to easily find answers to common queries.'
  },
  {
    title: 'Contact Details',
    icon: Phone,
    content: 'Here, you can manage the primary contact information displayed on your website, such as phone numbers and email addresses. You can add, edit, or delete these details to ensure your visitors can always reach you.'
  },
  {
    title: 'Social Links',
    icon: Link2,
    content: 'Update the social media links that appear in your website\'s footer. For each link, you select a Platform (like Facebook, Instagram, etc.) and provide the full URL. This helps visitors connect with you on your social channels.'
  },
  {
    title: 'Settings',
    icon: Settings,
    content: 'Customize your website\'s appearance using the AI Theme Customizer. Describe the look and feel you want (e.g., "warm and friendly," "professional and calm") and the AI will generate a new color palette (primary, background, and accent colors) for your site. You can apply the new theme or reset it to the default at any time.'
  },
  {
    title: 'Guide',
    icon: BookOpen,
    content: 'You are currently viewing the guide! This section serves as your reference for understanding and using all the features within the admin dashboard.'
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
            <Accordion type="single" collapsible className="w-full" defaultValue="Dashboard">
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
