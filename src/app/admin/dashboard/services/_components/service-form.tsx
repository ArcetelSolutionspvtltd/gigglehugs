'use client';

import { useActionState, useState, useRef, useEffect, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { PlusCircle, Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import { upsertServiceAction, type FormState } from '../actions';
import type { Service } from '@/lib/types';
import { iconMap } from '@/lib/icons';

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
        isEditing ? 'Save Changes' : 'Add Service'
      )}
    </Button>
  );
}

type ServiceFormProps = {
  children: ReactNode;
  service?: Service;
};

export function ServiceForm({ children, service }: ServiceFormProps) {
  const isEditing = !!service;
  const initialState: FormState = { message: '', errors: undefined, success: false };
  const [state, formAction] = useActionState(upsertServiceAction, initialState);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: isEditing ? 'Success!' : 'Service Added!',
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
          <SheetTitle>{isEditing ? 'Edit Service' : 'Add a New Service'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the details for this service.'
              : 'Fill out the form to add a new service to your website.'}
          </SheetDescription>
        </SheetHeader>
        <form
            ref={formRef}
            action={formAction}
            className="flex flex-col gap-6 mt-6"
        >
          {isEditing && <input type="hidden" name="id" value={service.id} />}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Gentle Care for Infants"
              defaultValue={service?.title ?? ''}
              required
            />
            {state?.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the service..."
              defaultValue={service?.description ?? ''}
              rows={4}
              required
            />
             {state?.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon_name">Icon</Label>
            <Select name="icon_name" defaultValue={service?.icon_name ?? ''}>
                <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(iconMap).map(iconName => (
                        <SelectItem key={iconName} value={iconName}>
                            {iconName.charAt(0).toUpperCase() + iconName.slice(1).replace('-', ' ')}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {state?.errors?.icon_name && <p className="text-sm font-medium text-destructive">{state.errors.icon_name[0]}</p>}
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
