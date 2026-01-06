import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
        {/* Hero image overlay - wine glasses with fire glow */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-1/2 overflow-hidden">
            <Image
              src="/images/hero/hero-campfire.png.png"
              alt=""
              fill
              className="object-cover object-right-top"
              style={{ opacity: 0.4 }}
              priority
            />
            {/* Warm glow overlay on image */}
            <div className="absolute inset-0 bg-gradient-radial from-[#5b2320]/40 via-transparent to-transparent" 
                 style={{
                   background: 'radial-gradient(ellipse at top right, rgba(91, 35, 32, 0.4) 0%, transparent 60%)'
                 }}></div>
          </div>
        </div>

        {/* Enhanced vignette effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)'
          }}
        ></div>
        
        {/* Multi-layer texture overlay for depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(139, 69, 19, 0.02) 1px, rgba(139, 69, 19, 0.02) 2px),
              repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(160, 82, 45, 0.02) 1px, rgba(160, 82, 45, 0.02) 2px),
              repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(101, 50, 30, 0.015) 2px, rgba(101, 50, 30, 0.015) 3px),
              repeating-linear-gradient(135deg, transparent, transparent 3px, rgba(120, 60, 35, 0.01) 3px, rgba(120, 60, 35, 0.01) 4px)
            `,
            backgroundSize: '200% 200%, 150% 150%, 180% 180%, 220% 220%',
            opacity: 0.35,
            mixBlendMode: 'overlay',
          }}
        ></div>
        
        {/* Subtle ember glow at bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-2/5 bg-gradient-to-t from-[#5b2320]/40 via-[#5b2320]/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="fixed inset-0 overflow-y-auto z-10">
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-[520px] mx-auto">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-center mb-6 text-[#f6f3ef] leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            Wine With Pete
          </h1>
          
          {/* Subline */}
          <p className="text-lg md:text-xl text-center text-[#f6f3ef]/90 mb-12 leading-relaxed font-light drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
            Food, fire, and conversations that stay with you long after the embers die.
          </p>

          {/* Sections */}
          <div className="space-y-10">
            {/* Make Something Delicious */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-medium text-[#f6f3ef]/95 text-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                Make Something Delicious
              </h2>
              <Link 
                href="/recipes"
                className="group relative block w-full py-4 px-6 rounded-full text-[#1f1f1f] font-medium text-lg text-center border border-[#1f1f1f]/15 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18]"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(246, 243, 239, 0.97) 50%, rgba(246, 243, 239, 0.95) 100%)',
                  boxShadow: `
                    0 1px 0 rgba(255, 255, 255, 0.6) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                    0 4px 16px rgba(0, 0, 0, 0.2),
                    0 8px 24px rgba(0, 0, 0, 0.15)
                  `,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `
                    0 1px 0 rgba(255, 255, 255, 0.7) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                    0 6px 20px rgba(0, 0, 0, 0.25),
                    0 12px 32px rgba(0, 0, 0, 0.2)
                  `;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `
                    0 1px 0 rgba(255, 255, 255, 0.6) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                    0 4px 16px rgba(0, 0, 0, 0.2),
                    0 8px 24px rgba(0, 0, 0, 0.15)
                  `;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(1px)';
                  e.currentTarget.style.boxShadow = `
                    0 1px 0 rgba(255, 255, 255, 0.5) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.1) inset,
                    0 2px 8px rgba(0, 0, 0, 0.2),
                    0 4px 12px rgba(0, 0, 0, 0.15)
                  `;
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `
                    0 1px 0 rgba(255, 255, 255, 0.7) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                    0 6px 20px rgba(0, 0, 0, 0.25),
                    0 12px 32px rgba(0, 0, 0, 0.2)
                  `;
                }}
              >
                Explore Fire Recipes
              </Link>
            </section>

            {/* Section separator */}
            <div className="h-px bg-[#f6f3ef]/10"></div>

            {/* Explore Ideas & Stories */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-medium text-[#f6f3ef]/95 text-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                Explore Ideas & Stories
              </h2>
              <div className="space-y-3">
                <Link 
                  href="/essays"
                  className="group relative block w-full py-4 px-6 rounded-full text-[#1f1f1f] font-medium text-lg text-center border border-[#1f1f1f]/15 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18]"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(246, 243, 239, 0.97) 50%, rgba(246, 243, 239, 0.95) 100%)',
                    boxShadow: `
                      0 1px 0 rgba(255, 255, 255, 0.6) inset,
                      0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                      0 4px 16px rgba(0, 0, 0, 0.2),
                      0 8px 24px rgba(0, 0, 0, 0.15)
                    `,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `
                      0 1px 0 rgba(255, 255, 255, 0.7) inset,
                      0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                      0 6px 20px rgba(0, 0, 0, 0.25),
                      0 12px 32px rgba(0, 0, 0, 0.2)
                    `;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `
                      0 1px 0 rgba(255, 255, 255, 0.6) inset,
                      0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                      0 4px 16px rgba(0, 0, 0, 0.2),
                      0 8px 24px rgba(0, 0, 0, 0.15)
                    `;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(1px)';
                    e.currentTarget.style.boxShadow = `
                      0 1px 0 rgba(255, 255, 255, 0.5) inset,
                      0 -1px 0 rgba(0, 0, 0, 0.1) inset,
                      0 2px 8px rgba(0, 0, 0, 0.2),
                      0 4px 12px rgba(0, 0, 0, 0.15)
                    `;
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `
                      0 1px 0 rgba(255, 255, 255, 0.7) inset,
                      0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                      0 6px 20px rgba(0, 0, 0, 0.25),
                      0 12px 32px rgba(0, 0, 0, 0.2)
                    `;
                  }}
                >
                  Read an Essay
                </Link>
                <Link 
                  href="/essays"
                  className="group relative block w-full py-4 px-6 rounded-full text-[#1f1f1f] font-medium text-base text-center border border-[#1f1f1f]/15 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18]"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgba(246, 243, 239, 0.94) 50%, rgba(246, 243, 239, 0.90) 100%)',
                    boxShadow: `
                      0 1px 0 rgba(255, 255, 255, 0.5) inset,
                      0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                      0 3px 12px rgba(0, 0, 0, 0.18),
                      0 6px 18px rgba(0, 0, 0, 0.12)
                    `,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `
                      0 1px 0 rgba(255, 255, 255, 0.6) inset,
                      0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                      0 4px 16px rgba(0, 0, 0, 0.22),
                      0 8px 24px rgba(0, 0, 0, 0.18)
                    `;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `
                      0 1px 0 rgba(255, 255, 255, 0.5) inset,
                      0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                      0 3px 12px rgba(0, 0, 0, 0.18),
                      0 6px 18px rgba(0, 0, 0, 0.12)
                    `;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(1px)';
                    e.currentTarget.style.boxShadow = `
                      0 1px 0 rgba(255, 255, 255, 0.4) inset,
                      0 -1px 0 rgba(0, 0, 0, 0.1) inset,
                      0 2px 6px rgba(0, 0, 0, 0.18),
                      0 3px 10px rgba(0, 0, 0, 0.12)
                    `;
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = `
                      0 1px 0 rgba(255, 255, 255, 0.6) inset,
                      0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                      0 4px 16px rgba(0, 0, 0, 0.22),
                      0 8px 24px rgba(0, 0, 0, 0.18)
                    `;
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
              <h2 className="text-xl font-serif font-medium text-[#f6f3ef]/95 text-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                Connect & Belong
              </h2>
              <Link 
                href="/join"
                className="group relative block w-full py-4 px-6 rounded-full text-[#1f1f1f] font-medium text-lg text-center border border-[#1f1f1f]/15 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18]"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(246, 243, 239, 0.97) 50%, rgba(246, 243, 239, 0.95) 100%)',
                  boxShadow: `
                    0 1px 0 rgba(255, 255, 255, 0.6) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                    0 4px 16px rgba(0, 0, 0, 0.2),
                    0 8px 24px rgba(0, 0, 0, 0.15)
                  `,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `
                    0 1px 0 rgba(255, 255, 255, 0.7) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                    0 6px 20px rgba(0, 0, 0, 0.25),
                    0 12px 32px rgba(0, 0, 0, 0.2)
                  `;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `
                    0 1px 0 rgba(255, 255, 255, 0.6) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                    0 4px 16px rgba(0, 0, 0, 0.2),
                    0 8px 24px rgba(0, 0, 0, 0.15)
                  `;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(1px)';
                  e.currentTarget.style.boxShadow = `
                    0 1px 0 rgba(255, 255, 255, 0.5) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.1) inset,
                    0 2px 8px rgba(0, 0, 0, 0.2),
                    0 4px 12px rgba(0, 0, 0, 0.15)
                  `;
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `
                    0 1px 0 rgba(255, 255, 255, 0.7) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                    0 6px 20px rgba(0, 0, 0, 0.25),
                    0 12px 32px rgba(0, 0, 0, 0.2)
                  `;
                }}
              >
                Join the Circle
              </Link>
            </section>

            {/* Section separator */}
            <div className="h-px bg-[#f6f3ef]/10"></div>

            {/* Join In Person */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-medium text-[#f6f3ef]/95 text-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                Join In Person
              </h2>
              <Link 
                href="/gatherings"
                className="group relative block w-full py-4 px-6 rounded-full text-[#1f1f1f] font-medium text-lg text-center border border-[#1f1f1f]/15 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18]"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(246, 243, 239, 0.97) 50%, rgba(246, 243, 239, 0.95) 100%)',
                  boxShadow: `
                    0 1px 0 rgba(255, 255, 255, 0.6) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                    0 4px 16px rgba(0, 0, 0, 0.2),
                    0 8px 24px rgba(0, 0, 0, 0.15)
                  `,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `
                    0 1px 0 rgba(255, 255, 255, 0.7) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                    0 6px 20px rgba(0, 0, 0, 0.25),
                    0 12px 32px rgba(0, 0, 0, 0.2)
                  `;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `
                    0 1px 0 rgba(255, 255, 255, 0.6) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                    0 4px 16px rgba(0, 0, 0, 0.2),
                    0 8px 24px rgba(0, 0, 0, 0.15)
                  `;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(1px)';
                  e.currentTarget.style.boxShadow = `
                    0 1px 0 rgba(255, 255, 255, 0.5) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.1) inset,
                    0 2px 8px rgba(0, 0, 0, 0.2),
                    0 4px 12px rgba(0, 0, 0, 0.15)
                  `;
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `
                    0 1px 0 rgba(255, 255, 255, 0.7) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.05) inset,
                    0 6px 20px rgba(0, 0, 0, 0.25),
                    0 12px 32px rgba(0, 0, 0, 0.2)
                  `;
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

