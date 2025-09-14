import { Metadata } from 'next';
import { Gallery } from './_components/Gallery';
import { getArtworks, getAllTags } from './_data/artworks';

export const metadata: Metadata = {
  title: 'focusedart — Wine With Pete',
  description: 'A rotating wall of digital experiments from focusedart. Abstract compositions, philosophical landscapes, and contemplative pieces that explore the intersection of art and thought.',
  keywords: 'focusedart, digital art, abstract art, philosophical art, wine with pete, contemporary art, AI art',
  authors: [{ name: 'focusedart' }],
  creator: 'focusedart',
  publisher: 'Wine With Pete',
  metadataBase: new URL('https://winewithpete.me'),
  alternates: {
    canonical: '/art',
  },
  openGraph: {
    title: 'focusedart — Wine With Pete',
    description: 'A rotating wall of digital experiments from focusedart. Abstract compositions, philosophical landscapes, and contemplative pieces.',
    url: 'https://winewithpete.me/art',
    siteName: 'Wine With Pete',
    images: [
      {
        url: '/images/art/digital-dreams-01.jpg',
        width: 1200,
        height: 1000,
        alt: 'focusedart digital composition',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'focusedart — Wine With Pete',
    description: 'A rotating wall of digital experiments from focusedart. Abstract compositions, philosophical landscapes, and contemplative pieces.',
    images: ['/images/art/digital-dreams-01.jpg'],
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

export default async function ArtPage() {
  const artworks = await getArtworks();
  const availableTags = getAllTags();

  return (
    <div className="min-h-screen bg-[var(--wwp-cream)]">
      <main className="space-section">
        <div className="mx-auto max-w-6xl px-4">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-display text-charcoal mb-4">
              focusedart
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              A rotating wall of experiments from focusedart.
            </p>
            
            {/* About focusedart Expandable Section */}
            <details className="mt-8 max-w-3xl mx-auto">
              <summary className="cursor-pointer text-ember hover:text-ember-light transition-colors duration-200 font-medium">
                About focusedart
                <svg className="inline-block w-4 h-4 ml-2 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 p-6 bg-white/50 rounded-2xl border border-stone-200 text-left">
                <p className="text-stone-700 leading-relaxed mb-4">
                  focusedart is the digital pseudonym for a collection of experimental pieces that explore 
                  the intersection of technology, philosophy, and human connection. Each work begins as an 
                  AI-generated seed, then grows through careful post-processing and human curation.
                </p>
                <p className="text-stone-700 leading-relaxed mb-4">
                  These pieces are born from the same contemplative space as Wine With Pete—a place where 
                  we pause to consider what matters, where technology meets tradition, and where digital 
                  tools become instruments of deeper human expression.
                </p>
                <p className="text-stone-700 leading-relaxed">
                  The collection evolves with the community, reflecting our ongoing conversations about 
                  slow living, meaningful connection, and the search for something real in our digital age.
                </p>
              </div>
            </details>
          </div>

          {/* Gallery */}
          <Gallery artworks={artworks} availableTags={availableTags} />
        </div>
      </main>
    </div>
  );
}
