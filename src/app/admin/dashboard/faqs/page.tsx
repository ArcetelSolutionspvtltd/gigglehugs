import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createClient } from '@/lib/supabase/server';
import type { FAQ } from '@/lib/types';
import { FaqForm } from './_components/faq-form';
import { DeleteFaqButton } from './_components/delete-faq-button';

export default async function FaqsPage() {
  const supabase = createClient();
  const { data: faqs } = await supabase.from('faqs').select('*').order('id').returns<FAQ[]>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">FAQs</h1>
        <div className="ml-auto">
          <FaqForm>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add FAQ
            </Button>
          </FaqForm>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage FAQs</CardTitle>
          <CardDescription>
            Add, edit, or delete frequently asked questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Answer</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs?.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium max-w-sm truncate">{faq.question}</TableCell>
                  <TableCell className="max-w-sm truncate">{faq.answer}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <FaqForm faq={faq}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </FaqForm>
                      <DeleteFaqButton faqId={faq.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
