'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import { generateBioAction, type FormState } from '../actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Wand2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Bio
        </>
      )}
    </Button>
  );
}

export function BioGeneratorForm() {
  const initialState: FormState = { message: '', bio: null };
  const [state, formAction] = useActionState(generateBioAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: state.bio ? 'Success!' : 'Oops!',
        description: state.message,
        variant: state.bio ? 'default' : 'destructive',
      });
      if (state.bio) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);
  
  const handleCopy = () => {
    if (state.bio) {
        navigator.clipboard.writeText(state.bio).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }
  };


  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>AI Babysitter Bio Generator</CardTitle>
          <CardDescription>
            Enter the sitter's experience and certifications to generate a unique, heartwarming bio.
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={formAction}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Textarea
                id="experience"
                name="experience"
                placeholder="e.g., 5 years of experience with toddlers, loves arts and crafts, skilled in conflict resolution..."
                rows={5}
                required
              />
               {state.errors?.experience && <p className="text-sm font-medium text-destructive">{state.errors.experience[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications</Label>
              <Textarea
                id="certifications"
                name="certifications"
                placeholder="e.g., CPR Certified, First-Aid Trained, Early Childhood Education certificate..."
                rows={3}
                required
              />
              {state.errors?.certifications && <p className="text-sm font-medium text-destructive">{state.errors.certifications[0]}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.bio && (
        <Card className="w-full max-w-2xl mt-8">
            <CardHeader>
                <CardTitle>Generated Bio</CardTitle>
                 <CardDescription>Here is the AI-generated bio. You can copy it or refine it further.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <p className="text-muted-foreground whitespace-pre-wrap p-4 bg-secondary/50 rounded-md">
                        {state.bio}
                    </p>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        <span className="sr-only">Copy</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
      )}
    </>
  );
}
