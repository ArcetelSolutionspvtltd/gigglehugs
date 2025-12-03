import { createClient } from '@/lib/supabase/server';
import { ThemeSettingsForm } from './_components/theme-settings-form';
import type { ColorTheme } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

async function getTheme() {
    const supabase = createClient();
    const { data } = await supabase.from('settings').select('value').eq('key', 'theme').single();
    return data?.value as ColorTheme | null;
}

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const currentTheme = await getTheme();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        <p className="text-muted-foreground">Manage your website settings and appearance.</p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This is the account you are currently logged in with.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user?.email}</p>
            <p className="text-sm text-muted-foreground">Administrator</p>
          </div>
        </CardContent>
      </Card>
      
      <ThemeSettingsForm currentTheme={currentTheme} />
    </div>
  );
}
