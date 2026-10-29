import type { Metadata } from 'next';
import { Manrope, Plus_Jakarta_Sans, JetBrains_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';
import ThemeProvider, { themeInitScript } from '@/components/providers/ThemeProvider';
import Preloader from '@/components/ui/Preloader';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AASA CP Holding Company — A Trusted Partner in Infrastructure',
  description: 'Multinational infrastructure group headquartered in Dubai with 30+ years of engineering excellence across UAE, KSA, Qatar and India.',
  keywords: 'AASA, infrastructure, Dubai, UAE, construction, engineering, holding company',
  openGraph: {
    title: 'AASA CP Holding Company',
    description: 'A Trusted Partner in Infrastructure',
    type: 'website',
    url: 'https://aasa.ae',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} overflow-x-hidden`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="overflow-x-hidden w-full max-w-full bg-page text-fg">
        <ThemeProvider>
          {/* Splash: once per session, on whichever page the visitor lands */}
          <Preloader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
