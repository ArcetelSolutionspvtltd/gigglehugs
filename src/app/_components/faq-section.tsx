import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { FAQ } from '@/lib/types';

type FaqSectionProps = {
  faqs: FAQ[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }
  
  return (
    <section id="faq" className="py-16 sm:py-24 bg-secondary/30">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Have questions? We've got answers. Here are some of the most common questions we get.
            </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
             <AccordionItem 
                key={faq.id} 
                value={`item-${faq.id}`}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
              <AccordionTrigger className="text-lg text-left hover:no-underline">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
