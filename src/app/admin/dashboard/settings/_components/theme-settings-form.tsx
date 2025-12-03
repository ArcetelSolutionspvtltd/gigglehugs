'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Wand2, Loader2, RefreshCw } from 'lucide-react';
import { generateThemeAction, resetThemeAction, type FormState } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { ColorTheme } from '@/lib/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Theme
        </>
      )}
    </Button>
  );
}

function ResetButton() {
    const [isResetting, setIsResetting] = useState(false);
    const { toast } = useToast();

    const handleReset = async () => {
        setIsResetting(true);
        const result = await resetThemeAction();
        if (result.success) {
            toast({ title: 'Success!', description: result.message });
            // This will cause a page reload to show the default theme
            window.location.reload(); 
        } else {
            toast({ title: 'Oops!', description: result.message, variant: 'destructive' });
        }
        setIsResetting(false);
    }
    return (
        <Button type="button" variant="outline" onClick={handleReset} disabled={isResetting}>
            {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Reset to Default
        </Button>
    )
}

type ThemeSettingsFormProps = {
  currentTheme: ColorTheme | null;
}

export function ThemeSettingsForm({ currentTheme }: ThemeSettingsFormProps) {
  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useActionState(generateThemeAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [theme, setTheme] = useState(currentTheme);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        if (state.newTheme) {
            setTheme(state.newTheme);
            // Reload to see changes
            window.location.reload();
        }
      } else {
        toast({
          title: 'Oops!',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Theme Customizer</CardTitle>
        <CardDescription>
          Describe the look and feel you want, and let AI generate a color palette for your site.
          Try prompts like "warm and friendly", "professional and calm", or "ocean vibes".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Theme Prompt</Label>
            <Input
              id="prompt"
              name="prompt"
              placeholder="e.g., modern and playful with a touch of pink"
              required
            />
            {state.errors?.prompt && <p className="text-sm font-medium text-destructive">{state.errors.prompt[0]}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 rounded-md border bg-card">
              <div className="h-10 w-10 rounded-full border" style={{ backgroundColor: `hsl(${theme?.primary})` }} />
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">{theme?.primary ?? 'Default'}</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 rounded-md border bg-card">
              <div className="h-10 w-10 rounded-full border" style={{ backgroundColor: `hsl(${theme?.background})` }} />
              <p className="text-sm font-medium">Background</p>
              <p className="text-xs text-muted-foreground">{theme?.background ?? 'Default'}</p>
            </div>
             <div className="flex flex-col items-center gap-2 p-4 rounded-md border bg-card">
              <div className="h-10 w-10 rounded-full border" style={{ backgroundColor: `hsl(${theme?.accent})` }} />
              <p className="text-sm font-medium">Accent</p>
              <p className="text-xs text-muted-foreground">{theme?.accent ?? 'Default'}</p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
        <ResetButton />
        <form action={formAction} className="w-full sm:w-auto">
             <input type="hidden" name="prompt" value={formRef.current?.prompt.value ?? ''} />
            <SubmitButton />
        </form>
      </CardFooter>
    </Card>
  );
}
