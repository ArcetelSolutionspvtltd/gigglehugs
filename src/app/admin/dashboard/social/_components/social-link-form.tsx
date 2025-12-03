'use client';

import { useActionState, useEffect, useRef, useState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import { upsertSocialLinkAction, type FormState } from '../actions';
import type { SocialLink } from '@/lib/types';
import { useMediaQuery } from '@/hooks/use-media-query';

const socialPlatforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'whatsapp'];

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
        isEditing ? 'Save Changes' : 'Add Link'
      )}
    </Button>
  );
}

type SocialLinkFormProps = {
  children: ReactNode;
  link?: SocialLink;
};

export function SocialLinkForm({ children, link }: SocialLinkFormProps) {
  const isEditing = !!link;
  const initialState: FormState = { message: '', errors: undefined, success: false };
  const [state, formAction] = useActionState(upsertSocialLinkAction, initialState);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (!isOpen) {
        formRef.current?.reset();
    }
  }, [isOpen])

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: isEditing ? 'Success!' : 'Link Added!',
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

  const FormContent = (
    <form
        ref={formRef}
        action={formAction}
        className="flex flex-col gap-6 mt-6"
    >
      {isEditing && <input type="hidden" name="id" value={link.id} />}
      <div className="space-y-2">
        <Label htmlFor="platform">Platform</Label>
        <Select name="platform" defaultValue={link?.platform ?? ''}>
            <SelectTrigger>
                <SelectValue placeholder="Select a platform" />
            </SelectTrigger>
            <SelectContent>
                {socialPlatforms.map(platform => (
                    <SelectItem key={platform} value={platform}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        {state?.errors?.platform && <p className="text-sm font-medium text-destructive">{state.errors.platform[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          name="url"
          type='url'
          placeholder="https://facebook.com/your-page"
          defaultValue={link?.url ?? ''}
          required
        />
        {state?.errors?.url && <p className="text-sm font-medium text-destructive">{state.errors.url[0]}</p>}
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

  if (isDesktop) {
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent>
            <SheetHeader>
            <SheetTitle>{isEditing ? 'Edit Social Link' : 'Add a New Social Link'}</SheetTitle>
            <SheetDescription>
                {isEditing
                ? 'Update the details for this social link.'
                : 'Fill out the form to add a new social link.'}
            </SheetDescription>
            </SheetHeader>
            {FormContent}
        </SheetContent>
        </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Social Link' : 'Add a New Social Link'}</DialogTitle>
                <DialogDescription>
                    {isEditing
                    ? 'Update the details for this social link.'
                    : 'Fill out the form to add a new social link.'}
                </DialogDescription>
            </DialogHeader>
            {FormContent}
        </DialogContent>
    </Dialog>
  );
}