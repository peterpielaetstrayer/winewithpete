'use client';

import { useState, useMemo } from 'react';
import { Artwork } from '../_data/artworks';
import { ArtworkCard } from './ArtworkCard';
import { Filters } from './Filters';
import { Lightbox } from './Lightbox';

interface GalleryProps {
  artworks: Artwork[];
  availableTags: string[];
}

export function Gallery({ artworks, availableTags }: GalleryProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Filter artworks based on active filter
  const filteredArtworks = useMemo(() => {
    if (activeFilter === 'All') return artworks;
    return artworks.filter(artwork => artwork.tags.includes(activeFilter.toLowerCase()));
  }, [artworks, activeFilter]);

  // Get current artwork index for navigation
  const currentIndex = selectedArtwork 
    ? filteredArtworks.findIndex(artwork => artwork.id === selectedArtwork.id)
    : -1;

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < filteredArtworks.length - 1;

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsLightboxOpen(true);
    // Update URL hash
    window.history.pushState(null, '', `#${artwork.id}`);
  };

  const handleClose = () => {
    setIsLightboxOpen(false);
    setSelectedArtwork(null);
    // Remove hash from URL
    window.history.pushState(null, '', window.location.pathname);
  };

  const handlePrevious = () => {
    if (hasPrevious && currentIndex > 0) {
      const prevArtwork = filteredArtworks[currentIndex - 1];
      setSelectedArtwork(prevArtwork);
      window.history.pushState(null, '', `#${prevArtwork.id}`);
    }
  };

  const handleNext = () => {
    if (hasNext && currentIndex < filteredArtworks.length - 1) {
      const nextArtwork = filteredArtworks[currentIndex + 1];
      setSelectedArtwork(nextArtwork);
      window.history.pushState(null, '', `#${nextArtwork.id}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <Filters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        availableTags={availableTags}
      />

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredArtworks.map((artwork, index) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            onClick={() => handleArtworkClick(artwork)}
            priority={index < 4} // Prioritize first 4 images
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredArtworks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-stone-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-stone-700 mb-2">No artworks found</h3>
            <p className="text-stone-500">Try selecting a different filter to see more pieces.</p>
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        artwork={selectedArtwork}
        isOpen={isLightboxOpen}
        onClose={handleClose}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />
    </div>
  );
}
