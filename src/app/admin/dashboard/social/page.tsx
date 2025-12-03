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
import type { SocialLink } from '@/lib/types';
import { getIcon } from '@/lib/icons';
import { SocialLinkForm } from './_components/social-link-form';
import { DeleteSocialLinkButton } from './_components/delete-social-link-button';
import { Badge } from '@/components/ui/badge';

export default async function SocialLinksPage() {
  const supabase = createClient();
  const { data: links } = await supabase.from('social_links').select('*').order('id').returns<SocialLink[]>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Social Links</h1>
        <div className="ml-auto">
          <SocialLinkForm>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Link
            </Button>
          </SocialLinkForm>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Social Links</CardTitle>
          <CardDescription>
            Add, edit, or delete your social media links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Icon</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links?.map((link) => {
                const Icon = getIcon(link.icon_name);
                return (
                  <TableRow key={link.id}>
                    <TableCell className="hidden sm:table-cell">
                      <div className="bg-primary/10 p-2 rounded-md inline-flex">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{link.platform}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{link.url}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <SocialLinkForm link={link}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </SocialLinkForm>
                        <DeleteSocialLinkButton linkId={link.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
