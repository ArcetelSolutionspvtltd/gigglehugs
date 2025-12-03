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
import { upsertContactAction, type FormState } from '../actions';
import type { ContactDetail } from '@/lib/types';

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
        isEditing ? 'Save Changes' : 'Add Contact'
      )}
    </Button>
  );
}

type ContactFormProps = {
  children: ReactNode;
  contact?: ContactDetail;
};

export function ContactForm({ children, contact }: ContactFormProps) {
  const isEditing = !!contact;
  const initialState: FormState = { message: '', errors: undefined, success: false };
  const [state, formAction] = useActionState(upsertContactAction, initialState);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isOpen) {
        formRef.current?.reset();
    }
  }, [isOpen])

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: isEditing ? 'Success!' : 'Contact Added!',
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit Contact' : 'Add a New Contact'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the details for this contact.'
              : 'Fill out the form to add a new contact detail.'}
          </SheetDescription>
        </SheetHeader>
        <form
            ref={formRef}
            action={formAction}
            className="flex flex-col gap-6 mt-6"
        >
          {isEditing && <input type="hidden" name="id" value={contact.id} />}
          <div className="space-y-2">
            <Label htmlFor="contact_type">Contact Type</Label>
            <Select name="contact_type" defaultValue={contact?.contact_type ? String(contact.contact_type) : ''}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">Phone</SelectItem>
                    <SelectItem value="2">Email</SelectItem>
                </SelectContent>
            </Select>
            {state?.errors?.contact_type && <p className="text-sm font-medium text-destructive">{state.errors.contact_type[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              name="value"
              placeholder="e.g., info@gigglehugs.org"
              defaultValue={contact?.value ?? ''}
              required
            />
            {state?.errors?.value && <p className="text-sm font-medium text-destructive">{state.errors.value[0]}</p>}
          </div>

          <SheetFooter className="mt-4">
            <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
            </SheetClose>
            <SubmitButton isEditing={isEditing} />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
