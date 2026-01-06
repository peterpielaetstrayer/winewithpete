import type { Metadata } from "next";
import { Inter, Playfair_Display, Crimson_Text } from "next/font/google";
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@/components/google-analytics';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-crimson",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Wine With Pete - Slow Living Community',
  description: 'Join our community for philosophical conversation, fire-cooked meals, and meaningful connections. Weekly essays, recipe cards, and intimate gatherings.',
  keywords: 'wine, philosophy, community, slow living, fire cooking, conversation, gatherings, essays',
  authors: [{ name: 'Pete' }],
  creator: 'Wine With Pete',
  publisher: 'Wine With Pete',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://winewithpete.me'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Wine With Pete - Slow Living Community',
    description: 'Join our community for philosophical conversation, fire-cooked meals, and meaningful connections.',
    url: 'https://winewithpete.me',
    siteName: 'Wine With Pete',
    images: [
      {
        url: '/images/hero/hero-campfire.png.png',
        width: 1200,
        height: 630,
        alt: 'Wine With Pete community gathering around campfire',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wine With Pete - Slow Living Community',
    description: 'Join our community for philosophical conversation, fire-cooked meals, and meaningful connections.',
    images: ['/images/hero/hero-campfire.png.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${crimsonText.variable} min-h-screen flex flex-col font-sans`}>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
