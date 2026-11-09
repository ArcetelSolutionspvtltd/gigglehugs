import { createClient } from '@/lib/supabase/server';
import { ThemeSettingsForm } from './_components/theme-settings-form';
import { getFonts, getTheme } from '@/lib/queries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [currentTheme, availableFonts] = await Promise.all([
    getTheme(),
    getFonts()
  ]);

  const googleFontsUrl = availableFonts.length > 0
    ? `https://fonts.googleapis.com/css2?${availableFonts.map(f => `family=${f.name.replace(/\s+/g, '+')}:wght@400;700`).join('&')}&display=swap`
    : null;

  return (
    <>
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
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
        
        <ThemeSettingsForm currentTheme={currentTheme} fonts={availableFonts} />

        <Card>
          <CardHeader>
            <CardTitle>Dashboard Theme</CardTitle>
            <CardDescription>
              Switch between light and dark mode for this admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
              <ThemeToggle />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
