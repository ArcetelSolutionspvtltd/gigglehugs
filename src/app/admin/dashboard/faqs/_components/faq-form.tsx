'use client';

import { useActionState, useState, useRef, useEffect, type ReactNode } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { upsertFaqAction, type FormState } from '../actions';
import type { FAQ } from '@/lib/types';
import { useMediaQuery } from '@/hooks/use-media-query';


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
        isEditing ? 'Save Changes' : 'Add FAQ'
      )}
    </Button>
  );
}

type FaqFormProps = {
  children: ReactNode;
  faq?: FAQ;
};

export function FaqForm({ children, faq }: FaqFormProps) {
  const isEditing = !!faq;
  const initialState: FormState = { message: '', errors: undefined, success: false };
  const [state, formAction] = useActionState(upsertFaqAction, initialState);
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
          title: isEditing ? 'Success!' : 'FAQ Added!',
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
      {isEditing && <input type="hidden" name="id" value={faq.id} />}
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          name="question"
          placeholder="e.g., What are your hours?"
          defaultValue={faq?.question ?? ''}
          required
        />
        {state?.errors?.question && <p className="text-sm font-medium text-destructive">{state.errors.question[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="answer">Answer</Label>
        <Textarea
          id="answer"
          name="answer"
          placeholder="Provide the answer here..."
          defaultValue={faq?.answer ?? ''}
          rows={5}
          required
        />
         {state?.errors?.answer && <p className="text-sm font-medium text-destructive">{state.errors.answer[0]}</p>}
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
                <SheetTitle>{isEditing ? 'Edit FAQ' : 'Add a New FAQ'}</SheetTitle>
                <SheetDescription>
                    {isEditing
                    ? 'Update this frequently asked question.'
                    : 'Fill out the form to add a new FAQ.'}
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
                <DialogTitle>{isEditing ? 'Edit FAQ' : 'Add a New FAQ'}</DialogTitle>
                <DialogDescription>
                    {isEditing
                    ? 'Update this frequently asked question.'
                    : 'Fill out the form to add a new FAQ.'}
                </DialogDescription>
            </DialogHeader>
            {FormContent}
        </DialogContent>
    </Dialog>
  );
}