import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'GiggleHugs | Sunshine, Giggles & Hugs',
  description: 'The warm, welcoming, and trustworthy babysitting service that makes parents feel happy and confident. Find the perfect sitter at gigglehugs.org.',
  metadataBase: new URL('https://gigglehugs.org'),
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-body antialiased", poppins.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
