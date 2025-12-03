import { createClient } from '@/lib/supabase/server';
import { ThemeSettingsForm } from './_components/theme-settings-form';
import type { ColorTheme } from '@/lib/types';

async function getTheme() {
    const supabase = createClient();
    const { data } = await supabase.from('settings').select('value').eq('key', 'theme').single();
    return data?.value as ColorTheme | null;
}

export default async function SettingsPage() {
  const currentTheme = await getTheme();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        <p className="text-muted-foreground">Manage your website settings and appearance.</p>
      </div>
      <ThemeSettingsForm currentTheme={currentTheme} />
    </div>
  );
}
