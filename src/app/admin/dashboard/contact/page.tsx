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
import type { ContactDetail } from '@/lib/types';
import { getIcon } from '@/lib/icons';
import { ContactForm } from './_components/contact-form';
import { DeleteContactButton } from './_components/delete-contact-button';
import { Badge } from '@/components/ui/badge';

export default async function ContactPage() {
  const supabase = createClient();
  const { data: contacts } = await supabase.from('contact_details').select('*').order('id').returns<ContactDetail[]>();

  const getTypeLabel = (type: 1 | 2) => {
    return type === 1 ? 'phone' : 'email';
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Contact Details</h1>
        <div className="ml-auto">
          <ContactForm>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Contact
            </Button>
          </ContactForm>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Contact Details</CardTitle>
          <CardDescription>
            Add, edit, or delete your company's contact details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">Icon</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts?.map((contact) => {
                  const typeLabel = getTypeLabel(contact.type);
                  const Icon = getIcon(typeLabel);
                  return (
                    <TableRow key={contact.id}>
                      <TableCell className="hidden sm:table-cell">
                        <div className="bg-primary/10 p-2 rounded-md inline-flex">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{typeLabel}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{contact.value}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <ContactForm contact={contact}>
                            <Button variant="outline" size="sm">Edit</Button>
                          </ContactForm>
                          <DeleteContactButton contactId={contact.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}