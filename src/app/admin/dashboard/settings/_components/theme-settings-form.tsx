'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, RefreshCw, Save } from 'lucide-react';
import { generateThemeAction, resetThemeAction, type FormState } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { ColorTheme } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const fonts = [
  { name: 'Poppins', variable: '--font-poppins' },
  { name: 'Montserrat', variable: '--font-montserrat' },
  { name: 'Lato', variable: '--font-lato' },
  { name: 'Roboto', variable: '--font-roboto' },
  { name: 'Open Sans', variable: '--font-open-sans' },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </>
      )}
    </Button>
  );
}

type ThemeSettingsFormProps = {
  currentTheme: ColorTheme | null;
}

export function ThemeSettingsForm({ currentTheme }: ThemeSettingsFormProps) {
  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useActionState(generateThemeAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        if (state.newTheme) {
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
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of your public-facing website.
        </CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="font">Website Font</Label>
             <Select name="font" defaultValue={currentTheme?.font ?? 'poppins'}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                    {fonts.map(font => (
                        <SelectItem key={font.variable} value={font.name.toLowerCase().replace(' ', '-')}>
                            {font.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              This will change the primary font for all text on your public pages.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
