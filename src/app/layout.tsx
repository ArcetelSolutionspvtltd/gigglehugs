import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
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
  
  const themeStyle = theme ? {
    '--primary': theme.primary,
    '--background': theme.background,
    '--accent': theme.accent,
  } as React.CSSProperties : {};

  return (
    <html lang="en" suppressHydrationWarning style={themeStyle}>
      <body className={cn("font-sans antialiased", poppins.variable)}>
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
