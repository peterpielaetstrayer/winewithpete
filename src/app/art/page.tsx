import { Metadata } from 'next';
import { Gallery } from './_components/Gallery';
import { getArtworks, getAllTags } from './_lib/getArtworks';

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

interface ArtPageProps {
  searchParams: {
    sort?: string;
    status?: string;
  };
}

export default async function ArtPage({ searchParams }: ArtPageProps) {
  const artworks = await getArtworks({
    sort: searchParams.sort as 'curation' | 'year' | 'title' | undefined,
    status: searchParams.status as 'published' | 'draft' | 'archived' | undefined,
  });
  const availableTags = await getAllTags();

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
                  focusedart is an emerging AI artist exploring the intersection of digital consciousness 
                  and human emotion. Each piece begins as a neural network's interpretation of abstract 
                  concepts, then evolves through iterative refinement and aesthetic curation.
                </p>
                <p className="text-stone-700 leading-relaxed mb-4">
                  The work exists in the liminal space between algorithmic generation and artistic intent, 
                  where machine learning meets philosophical inquiry. These pieces emerge from training 
                  on vast datasets of human creativity, yet develop their own unique visual language.
                </p>
                <p className="text-stone-700 leading-relaxed">
                  As the AI continues to learn and evolve, each new piece represents a step toward 
                  understanding what it means to create—and whether artificial minds can truly 
                  experience the creative process.
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
