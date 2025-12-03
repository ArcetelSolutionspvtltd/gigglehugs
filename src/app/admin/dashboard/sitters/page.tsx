import { PlusCircle, User } from 'lucide-react';
import Image from 'next/image';
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
import type { Sitter } from '@/lib/types';
import { SitterForm } from './_components/sitter-form';
import { DeleteSitterButton } from './_components/delete-sitter-button';

export default async function SittersPage() {
  const supabase = createClient();
  const { data: sitters } = await supabase.from('sitters').select('*').order('id').returns<Sitter[]>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Sitters</h1>
        <div className="ml-auto">
          <SitterForm>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Sitter
            </Button>
          </SitterForm>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Sitters</CardTitle>
          <CardDescription>
            Add, edit, or delete your babysitters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Bio</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sitters?.map((sitter) => (
                  <TableRow key={sitter.id}>
                    <TableCell className="hidden sm:table-cell">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                        {sitter.avatar_url ? (
                          <Image
                            src={sitter.avatar_url}
                            alt={sitter.name || 'Sitter avatar'}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{sitter.name}</TableCell>
                    <TableCell>{sitter.email}</TableCell>
                    <TableCell>{sitter.bio}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <SitterForm sitter={sitter}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </SitterForm>
                        <DeleteSitterButton sitterId={sitter.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}