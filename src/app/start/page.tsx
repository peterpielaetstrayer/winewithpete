import type { Metadata } from 'next';
import Link from 'next/link';
import { StartPageClient } from './start-page-client';

export const metadata: Metadata = {
  title: 'Wine With Pete',
  description: 'Food, fire, and conversations that stay with you long after the embers die.',
  openGraph: {
    title: 'Wine With Pete',
    description: 'Food, fire, and conversations that stay with you long after the embers die.',
    url: 'https://winewithpete.me/start',
    siteName: 'Wine With Pete',
    images: [
      {
        url: '/images/hero/hero-campfire.png.png',
        width: 1200,
        height: 630,
        alt: 'Wine With Pete - Food, fire, and conversations',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wine With Pete',
    description: 'Food, fire, and conversations that stay with you long after the embers die.',
    images: ['/images/hero/hero-campfire.png.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function StartPage() {
  return (
    <StartPageClient>
      {/* Background with fire-lit gradient and texture */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2a1a18] via-[#3d2522] to-[#1f1412] z-0">
        {/* Enhanced vignette effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.6) 100%)'
          }}
        ></div>
        
        {/* Noise texture overlay via pseudo-element simulation */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(139, 69, 19, 0.015) 1px, rgba(139, 69, 19, 0.015) 2px),
              repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(160, 82, 45, 0.015) 1px, rgba(160, 82, 45, 0.015) 2px),
              repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(101, 50, 30, 0.01) 2px, rgba(101, 50, 30, 0.01) 3px)
            `,
            backgroundSize: '200% 200%, 150% 150%, 180% 180%',
            opacity: 0.25,
            mixBlendMode: 'overlay',
          }}
        ></div>
        
        {/* Subtle ember glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/3 bg-gradient-to-t from-[#5b2320]/30 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="fixed inset-0 overflow-y-auto z-10">
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-[520px] mx-auto">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-center mb-6 text-[#f6f3ef] leading-tight">
            Wine With Pete
          </h1>
          
          {/* Subline */}
          <p className="text-lg md:text-xl text-center text-[#f6f3ef]/90 mb-12 leading-relaxed font-light">
            Food, fire, and conversations that stay with you long after the embers die.
          </p>

          {/* Sections */}
          <div className="space-y-10">
            {/* Make Something Delicious */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-medium text-[#f6f3ef]/95 text-center">
                Make Something Delicious
              </h2>
              <Link 
                href="/recipes"
                className="relative block w-full py-4 px-6 rounded-full bg-[#f6f3ef]/95 text-[#1f1f1f] font-medium text-lg text-center border border-[#1f1f1f]/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-[#f6f3ef] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18]"
                style={{
                  background: 'linear-gradient(to bottom, rgba(246, 243, 239, 0.98) 0%, rgba(246, 243, 239, 0.95) 100%)',
                }}
              >
                Explore Fire Recipes
              </Link>
            </section>

            {/* Section separator */}
            <div className="h-px bg-[#f6f3ef]/10"></div>

            {/* Explore Ideas & Stories */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-medium text-[#f6f3ef]/95 text-center">
                Explore Ideas & Stories
              </h2>
              <div className="space-y-3">
                <Link 
                  href="/essays"
                  className="relative block w-full py-4 px-6 rounded-full bg-[#f6f3ef]/95 text-[#1f1f1f] font-medium text-lg text-center border border-[#1f1f1f]/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-[#f6f3ef] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18]"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(246, 243, 239, 0.98) 0%, rgba(246, 243, 239, 0.95) 100%)',
                  }}
                >
                  Read an Essay
                </Link>
                <Link 
                  href="/essays"
                  className="relative block w-full py-4 px-6 rounded-full bg-[#f6f3ef]/90 text-[#1f1f1f] font-medium text-base text-center border border-[#1f1f1f]/10 shadow-[0_3px_10px_rgba(0,0,0,0.12)] hover:bg-[#f6f3ef]/95 hover:shadow-[0_4px_14px_rgba(0,0,0,0.18)] active:translate-y-[1px] active:shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18]"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(246, 243, 239, 0.95) 0%, rgba(246, 243, 239, 0.90) 100%)',
                  }}
                >
                  Browse All Essays
                </Link>
              </div>
            </section>

            {/* Section separator */}
            <div className="h-px bg-[#f6f3ef]/10"></div>

            {/* Connect & Belong */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-medium text-[#f6f3ef]/95 text-center">
                Connect & Belong
              </h2>
              <Link 
                href="/join"
                className="relative block w-full py-4 px-6 rounded-full bg-[#f6f3ef]/95 text-[#1f1f1f] font-medium text-lg text-center border border-[#1f1f1f]/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-[#f6f3ef] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18]"
                style={{
                  background: 'linear-gradient(to bottom, rgba(246, 243, 239, 0.98) 0%, rgba(246, 243, 239, 0.95) 100%)',
                }}
              >
                Join the Circle
              </Link>
            </section>

            {/* Section separator */}
            <div className="h-px bg-[#f6f3ef]/10"></div>

            {/* Join In Person */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-medium text-[#f6f3ef]/95 text-center">
                Join In Person
              </h2>
              <Link 
                href="/gatherings"
                className="relative block w-full py-4 px-6 rounded-full bg-[#f6f3ef]/95 text-[#1f1f1f] font-medium text-lg text-center border border-[#1f1f1f]/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-[#f6f3ef] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18]"
                style={{
                  background: 'linear-gradient(to bottom, rgba(246, 243, 239, 0.98) 0%, rgba(246, 243, 239, 0.95) 100%)',
                }}
              >
                See Gatherings
              </Link>
            </section>
          </div>

          {/* Bottom links */}
          <div className="mt-16 space-y-3 text-center">
            <Link 
              href="/support"
              className="block text-[#f6f3ef]/80 hover:text-[#f6f3ef] text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18] rounded"
            >
              Support Wine With Pete
            </Link>
            <Link 
              href="/about"
              className="block text-[#f6f3ef]/80 hover:text-[#f6f3ef] text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18] rounded"
            >
              About Wine With Pete
            </Link>
          </div>
        </div>
        </div>
      </div>
    </StartPageClient>
  );
}

