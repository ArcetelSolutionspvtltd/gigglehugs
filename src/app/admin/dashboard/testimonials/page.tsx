import { PlusCircle, User, Star } from 'lucide-react';
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
import type { Testimonial } from '@/lib/types';
import { TestimonialForm } from './_components/testimonial-form';
import { DeleteTestimonialButton } from './_components/delete-testimonial-button';

export default async function TestimonialsPage() {
  const supabase = createClient();
  const { data: testimonials } = await supabase.from('testimonials').select('*').order('id').returns<Testimonial[]>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Testimonials</h1>
        <div className="ml-auto">
          <TestimonialForm>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Testimonial
            </Button>
          </TestimonialForm>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Testimonials</CardTitle>
          <CardDescription>
            Add, edit, or delete your family testimonials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Testimonial</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials?.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell className="hidden sm:table-cell">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                      {testimonial.avatar_url ? (
                        <Image
                          src={testimonial.avatar_url}
                          alt={testimonial.name || 'Testimonial avatar'}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{testimonial.name}</TableCell>
                  <TableCell>{testimonial.bio}</TableCell>
                   <TableCell>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 text-primary ${i < (testimonial.rating ?? 0) ? 'fill-primary' : 'fill-none'}`} />
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{testimonial.testimonial}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <TestimonialForm testimonial={testimonial}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TestimonialForm>
                      <DeleteTestimonialButton testimonialId={testimonial.id} />
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
