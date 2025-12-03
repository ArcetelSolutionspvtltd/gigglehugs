import type { Metadata } from 'next';
import { Poppins, Montserrat, Lato, Roboto, Open_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { createClient } from '@/lib/supabase/server';
import type { ColorTheme } from '@/lib/types';

export const metadata: Metadata = {
  title: 'GiggleHugs | Sunshine Giggles and Hugs',
  description: 'The warm, welcoming, and trustworthy babysitting service that makes parents feel happy and confident. Find the perfect sitter at gigglehugs.org.',
  metadataBase: new URL('https://gigglehugs.org'),
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-open-sans',
});

const fontMap: { [key: string]: { variable: string } } = {
  'poppins': poppins,
  'montserrat': montserrat,
  'lato': lato,
  'roboto': roboto,
  'open-sans': openSans
}

async function getTheme() {
  const supabase = createClient();
  const { data } = await supabase.from('settings').select('value').eq('key', 'theme').single();
  return data?.value as ColorTheme | null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();
  
  const selectedFont = theme?.font ? fontMap[theme.font] : poppins;

  const themeStyle = theme?.primary ? {
    '--primary': theme.primary,
    '--background': theme.background,
    '--accent': theme.accent,
  } as React.CSSProperties : {};

  return (
    <html lang="en" suppressHydrationWarning style={themeStyle}>
      <body className={cn(
        "antialiased", 
        poppins.variable,
        montserrat.variable,
        lato.variable,
        roboto.variable,
        openSans.variable,
        selectedFont.variable,
        "font-sans"
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
