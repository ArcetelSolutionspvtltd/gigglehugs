import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { createClient } from '@/lib/supabase/server';
import type { ColorTheme, Font } from '@/lib/types';
import { PT_Sans } from 'next/font/google';

export const metadata: Metadata = {
  title: 'GiggleHugs | Sunshine Giggles and Hugs',
  description: 'The warm, welcoming, and trustworthy babysitting service that makes parents feel happy and confident. Find the perfect sitter at gigglehugs.org.',
  metadataBase: new URL('https://gigglehugs.org'),
};

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

type ThemeSettings = {
  theme: ColorTheme | null,
  font: Font | null,
}

async function getThemeSettings(): Promise<ThemeSettings> {
  const supabase = createClient();
  const { data: themeSetting } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'theme')
    .single();

  const fontName = (themeSetting?.value as ColorTheme)?.font || 'PT Sans';

  const { data: fontData } = await supabase
    .from('fonts')
    .select('*')
    .eq('name', fontName)
    .single();

  return {
    theme: themeSetting?.value as ColorTheme | null,
    font: fontData as Font | null,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme, font } = await getThemeSettings();
  
  const fontCssFamily = font?.css_family || '"PT Sans", sans-serif';
  const fontVariable = font?.css_family.split(',')[0].toLowerCase().replace(/"/g, '').replace(/\s+/g, '-');
  const googleFontUrl = font ? `https://fonts.googleapis.com/css2?family=${font.name.replace(/\s+/g, '+')}:wght@400;700&display=swap` : null;

  const themeStyle = theme?.primary ? {
    '--primary': theme.primary,
    '--background': theme.background,
    '--accent': theme.accent,
  } as React.CSSProperties : {};

  return (
    <html lang="en" suppressHydrationWarning style={{ ...themeStyle, fontFamily: fontCssFamily }}>
      <head>
        {googleFontUrl && (
          <link rel="stylesheet" href={googleFontUrl} />
        )}
      </head>
      <body className={cn(
        "antialiased font-sans",
        ptSans.variable
        )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
