import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { getFontByName, getTheme } from '@/lib/queries';
import type { ColorTheme, Font } from '@/lib/types';
import { PT_Sans } from 'next/font/google';

export const dynamic = 'force-dynamic';

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
  const theme = await getTheme();
  const fontName = theme?.font || 'PT Sans';
  const font = await getFontByName(fontName);

  return {
    theme,
    font,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme, font } = await getThemeSettings();
  
  const fontCssFamily = font?.css_family || '"PT Sans", sans-serif';
  const googleFontUrl = font ? `https://fonts.googleapis.com/css2?family=${font.name.replace(/\s+/g, '+')}:wght@400;700&display=swap` : null;

  const primaryColor = theme?.primary?.split(' ').join(', ') ?? '346.8 77.2% 49.8%';

  const themeStyle = theme?.primary ? {
    '--primary': theme.primary,
    '--background': theme.background,
    '--accent': theme.accent,
  } as React.CSSProperties : {};

  return (
    <html lang="en" suppressHydrationWarning style={{ ...themeStyle, fontFamily: fontCssFamily }}>
       <head>
        {googleFontUrl && <link rel="stylesheet" href={googleFontUrl} />}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content={`hsl(${primaryColor})`} />
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
