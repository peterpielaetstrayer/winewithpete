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
      <div className="fixed inset-0 overflow-y-auto">
      {/* Background with fire-lit gradient and texture */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2a1a18] via-[#3d2522] to-[#1f1412] z-0">
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40 pointer-events-none" 
             style={{
               background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.5) 100%)'
             }}></div>
        
        {/* Texture overlay using CSS noise */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 69, 19, 0.03) 2px, rgba(139, 69, 19, 0.03) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(160, 82, 45, 0.03) 2px, rgba(160, 82, 45, 0.03) 4px)
            `,
            backgroundSize: '100% 100%',
          }}
        ></div>
        
        {/* Subtle ember glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/3 bg-gradient-to-t from-[#5b2320]/30 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-[520px] mx-auto">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-center mb-6 text-[#f6f3ef] leading-tight">
            Wine With Pete
          </h1>
          
          {/* Subline */}
          <p className="text-lg md:text-xl text-center text-[#f6f3ef]/90 mb-16 leading-relaxed font-light">
            Food, fire, and conversations that stay with you long after the embers die.
          </p>

          {/* Sections */}
          <div className="space-y-12">
            {/* Make Something Delicious */}
            <section className="space-y-4">
              <h2 className="text-xl font-serif font-medium text-[#f6f3ef]/95 text-center">
                Make Something Delicious
              </h2>
              <Link 
                href="/recipes"
                className="block w-full py-4 px-6 rounded-full bg-[#f6f3ef]/95 text-[#1f1f1f] font-medium text-lg shadow-lg hover:bg-[#f6f3ef] hover:shadow-xl active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18] text-center"
              >
                Explore Fire Recipes
              </Link>
            </section>

            {/* Explore Ideas & Stories */}
            <section className="space-y-4">
              <h2 className="text-xl font-serif font-medium text-[#f6f3ef]/95 text-center">
                Explore Ideas & Stories
              </h2>
              <div className="space-y-3">
                <Link 
                  href="/essays"
                  className="block w-full py-4 px-6 rounded-full bg-[#f6f3ef]/95 text-[#1f1f1f] font-medium text-lg shadow-lg hover:bg-[#f6f3ef] hover:shadow-xl active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18] text-center"
                >
                  Read an Essay
                </Link>
                <Link 
                  href="/essays"
                  className="block w-full py-4 px-6 rounded-full bg-[#f6f3ef]/90 text-[#1f1f1f] font-medium text-base shadow-md hover:bg-[#f6f3ef]/95 hover:shadow-lg active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18] text-center"
                >
                  Browse All Essays
                </Link>
              </div>
            </section>

            {/* Connect & Belong */}
            <section className="space-y-4">
              <h2 className="text-xl font-serif font-medium text-[#f6f3ef]/95 text-center">
                Connect & Belong
              </h2>
              <Link 
                href="/join"
                className="block w-full py-4 px-6 rounded-full bg-[#f6f3ef]/95 text-[#1f1f1f] font-medium text-lg shadow-lg hover:bg-[#f6f3ef] hover:shadow-xl active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18] text-center"
              >
                Join the Circle
              </Link>
            </section>

            {/* Join In Person */}
            <section className="space-y-4">
              <h2 className="text-xl font-serif font-medium text-[#f6f3ef]/95 text-center">
                Join In Person
              </h2>
              <Link 
                href="/gatherings"
                className="block w-full py-4 px-6 rounded-full bg-[#f6f3ef]/95 text-[#1f1f1f] font-medium text-lg shadow-lg hover:bg-[#f6f3ef] hover:shadow-xl active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18] text-center"
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

