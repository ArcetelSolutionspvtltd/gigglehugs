'use client';

import { useActionState, useState, useRef, useEffect, type ReactNode, useCallback, ChangeEvent } from 'react';
import Image from 'next/image';
import { useFormStatus } from 'react-dom';

import { Loader2, ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { upsertTestimonialAction, type FormState } from '../actions';
import type { Testimonial } from '@/lib/types';
import { useMediaQuery } from '@/hooks/use-media-query';

const MAX_TESTIMONIAL_LENGTH = 150;

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? 'Saving...' : 'Adding...'}
        </>
      ) : (
        isEditing ? 'Save Changes' : 'Add Testimonial'
      )}
    </Button>
  );
}

type TestimonialFormProps = {
  children: ReactNode;
  testimonial?: Testimonial;
};

export function TestimonialForm({ children, testimonial }: TestimonialFormProps) {
  const isEditing = !!testimonial;
  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useActionState(upsertTestimonialAction, initialState);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(testimonial?.avatar_url || null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [charCount, setCharCount] = useState(testimonial?.testimonial?.length || 0);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const resetFormState = useCallback(() => {
    formRef.current?.reset();
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    setAvatarPreview(testimonial?.avatar_url || null);
    setCharCount(testimonial?.testimonial?.length || 0);
  }, [testimonial]);

  useEffect(() => {
    if (!isOpen) {
      resetFormState();
    }
  }, [isOpen, resetFormState]);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: isEditing ? 'Success!' : 'Testimonial Added!',
          description: state.message,
        });
        setIsOpen(false);
      } else {
        toast({
          title: 'Oops!',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast, isEditing]);


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(testimonial?.avatar_url || null);
    }
  };
  
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
  };

  const FormContent = (
    <form
        ref={formRef}
        action={formAction}
        className="flex flex-col gap-6 mt-6"
    >
      <input type="hidden" name="id" value={testimonial?.id} />
      <input type="hidden" name="current_avatar_url" value={testimonial?.avatar_url || ''} />
      
      <div className="space-y-2">
        <Label>Avatar</Label>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            {avatarPreview ? (
              <Image src={avatarPreview} alt="Avatar preview" fill className="object-cover" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            {avatarPreview ? 'Change' : 'Upload'}
          </Button>
          <Input
            id="testimonial-avatar-upload"
            name="avatar_file"
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
        {state?.errors?.avatar_file && <p className="text-sm font-medium text-destructive">{state.errors.avatar_file[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., The Chitehwe Family"
          defaultValue={testimonial?.name ?? ''}
          required
        />
        {state?.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Input
          id="bio"
          name="bio"
          placeholder="e.g., Parents of two"
          defaultValue={testimonial?.bio ?? ''}
          required
        />
        {state?.errors?.bio && <p className="text-sm font-medium text-destructive">{state.errors.bio[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rating">Rating (1-5)</Label>
        <Input
          id="rating"
          name="rating"
          type="number"
          min="1"
          max="5"
          placeholder="5"
          defaultValue={testimonial?.rating ?? 5}
          required
        />
        {state?.errors?.rating && <p className="text-sm font-medium text-destructive">{state.errors.rating[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="testimonial">Testimonial</Label>
        <Textarea
          id="testimonial"
          name="testimonial"
          placeholder="Write the testimonial here..."
          defaultValue={testimonial?.testimonial ?? ''}
          rows={5}
          required
          maxLength={MAX_TESTIMONIAL_LENGTH}
          onChange={handleTextareaChange}
        />
        <div className="text-right text-sm text-muted-foreground">
            {charCount}/{MAX_TESTIMONIAL_LENGTH}
        </div>
        {state?.errors?.testimonial && <p className="text-sm font-medium text-destructive">{state.errors.testimonial[0]}</p>}
      </div>

      {isDesktop ? (
        <SheetFooter className="mt-4">
            <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
            </SheetClose>
            <SubmitButton isEditing={isEditing} />
        </SheetFooter>
      ) : (
        <DialogFooter className="mt-4">
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <SubmitButton isEditing={isEditing} />
        </DialogFooter>
      )}
    </form>
  );

  const MainDialog = (
     <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-[90vw] w-full rounded-lg">
            <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Testimonial' : 'Add a New Testimonial'}</DialogTitle>
                <DialogDescription>
                    {isEditing
                    ? 'Update the details for this testimonial.'
                    : 'Fill out the form to add a new testimonial.'}
                </DialogDescription>
            </DialogHeader>
            {FormContent}
        </DialogContent>
    </Dialog>
  );

  const MainSheet = (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="sm:max-w-lg overflow-y-auto max-h-screen">
            <SheetHeader>
                <SheetTitle>{isEditing ? 'Edit Testimonial' : 'Add a New Testimonial'}</SheetTitle>
                <DialogDescription>
                    {isEditing
                    ? 'Update the details for this testimonial.'
                    : 'Fill out the form to add a new testimonial.'}
                </DialogDescription>
            </SheetHeader>
            {FormContent}
        </SheetContent>
    </Sheet>
  );

  return (
    <>
      {isDesktop ? MainSheet : MainDialog}
    </>
  );
}
