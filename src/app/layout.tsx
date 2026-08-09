import type { Metadata } from 'next';
import { Space_Grotesk, Manrope } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Paul Jison | Fullstack Developer',
  description: 'Fullstack developer portfolio — Paul Jison',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
