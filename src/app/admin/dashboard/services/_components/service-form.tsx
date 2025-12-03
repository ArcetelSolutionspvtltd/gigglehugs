'use client';

import { useActionState, useState, useRef, useEffect, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, ChevronsUpDown } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { upsertServiceAction, type FormState } from '../actions';
import type { Service } from '@/lib/types';
import { iconMap, getIcon } from '@/lib/icons';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

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
  const [isIconPopoverOpen, setIconPopoverOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(service?.icon_name ?? 'default');
  const formRef = useRef<HTMLFormElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const CurrentIcon = getIcon(selectedIcon);

  useEffect(() => {
    if (!isOpen) {
        formRef.current?.reset();
        setSelectedIcon(service?.icon_name ?? 'default');
    }
  }, [isOpen, service]);

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

  const FormContent = (
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
        <Label>Icon</Label>
        <input type="hidden" name="icon_name" value={selectedIcon} />
        <Popover open={isIconPopoverOpen} onOpenChange={setIconPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isIconPopoverOpen}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <CurrentIcon className="h-5 w-5" />
                {selectedIcon.charAt(0).toUpperCase() + selectedIcon.slice(1).replace(/-/g, ' ')}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <ScrollArea className="h-72">
              <div className="grid grid-cols-6 gap-1 p-2">
                {Object.keys(iconMap).map(iconName => {
                  const Icon = iconMap[iconName];
                  return (
                    <Button
                      key={iconName}
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-12 w-full flex flex-col items-center justify-center gap-1",
                        selectedIcon === iconName && "ring-2 ring-primary"
                      )}
                      onClick={() => {
                        setSelectedIcon(iconName);
                        setIconPopoverOpen(false);
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        {state?.errors?.icon_name && <p className="text-sm font-medium text-destructive">{state.errors.icon_name[0]}</p>}
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
            <SheetTitle>{isEditing ? 'Edit Service' : 'Add a New Service'}</SheetTitle>
            <SheetDescription>
                {isEditing
                ? 'Update the details for this service.'
                : 'Fill out the form to add a new service to your website.'}
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
        <DialogContent className="max-w-[90vw] w-full rounded-lg">
            <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Service' : 'Add a New Service'}</DialogTitle>
            <DialogDescription>
                {isEditing
                ? 'Update the details for this service.'
                : 'Fill out the form to add a new service to your website.'}
            </DialogDescription>
            </DialogHeader>
            {FormContent}
        </DialogContent>
    </Dialog>
  );
}
