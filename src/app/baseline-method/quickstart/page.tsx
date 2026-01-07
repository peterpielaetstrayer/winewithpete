import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Baseline Method Quick Start | Wine With Pete',
  description: 'A condensed guide to start the Baseline Method today.',
  openGraph: {
    title: 'Baseline Method Quick Start | Wine With Pete',
    description: 'A condensed guide to start the Baseline Method today.',
    url: 'https://winewithpete.me/baseline-method/quickstart',
    siteName: 'Wine With Pete',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function QuickStartPage() {
  // Quickstart guide pages (14 pages total)
  const quickstartPages = [
    '/images/baseline-method/quickstart/1.png',
    '/images/baseline-method/quickstart/2.png',
    '/images/baseline-method/quickstart/3.png',
    '/images/baseline-method/quickstart/4.png',
    '/images/baseline-method/quickstart/5.png',
    '/images/baseline-method/quickstart/6.png',
    '/images/baseline-method/quickstart/7.png',
    '/images/baseline-method/quickstart/8.png',
    '/images/baseline-method/quickstart/9.png',
    '/images/baseline-method/quickstart/10.png',
    '/images/baseline-method/quickstart/11.png',
    '/images/baseline-method/quickstart/12.png',
    '/images/baseline-method/quickstart/13.png',
    '/images/baseline-method/quickstart/14.png',
  ];

  return (
    <div className="min-h-screen bg-dr-cream">
      {/* Header */}
      <div className="bg-white border-b border-dr-charcoal/10 sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-semibold text-dr-charcoal">
                Baseline Method Quick Start
              </h1>
              <p className="text-sm text-dr-charcoal/70 mt-1">
                A condensed guide to get started today
              </p>
            </div>
            <Link href="/baseline-method">
              <Button variant="outline" size="sm" className="border-dr-charcoal/20 text-dr-charcoal hover:bg-dr-cream">
                Full Guide
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quickstart Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          {quickstartPages.map((imagePath, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-dr-charcoal/5"
            >
              <div 
                className="relative w-full bg-dr-cream/30"
                style={{ aspectRatio: '8.5/11' }}
              >
                <Image
                  src={imagePath}
                  alt={`Quick Start Guide Page ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-dr-sage/10 rounded-xl p-8 md:p-12 text-center border border-dr-sage/20">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-dr-charcoal mb-4">
            Ready for the Full Guide?
          </h2>
          <p className="text-dr-charcoal/80 mb-6 max-w-2xl mx-auto text-lg leading-relaxed">
            Get the complete 4-week Baseline Method guide with detailed daily anchors, 
            choice menus, weekly rhythms, and more.
          </p>
          <Link href="/baseline-method">
            <Button className="bg-dr-terracotta hover:bg-dr-terracotta/90 text-white px-8 py-6 text-lg font-medium">
              Get the Full Baseline Method Guide
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

