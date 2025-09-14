'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Artwork } from '../_data/artworks';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: () => void;
  priority?: boolean;
}

export function ArtworkCard({ artwork, onClick, priority = false }: ArtworkCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  return (
    <div 
      className="group cursor-pointer animate-scale-in"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View ${artwork.title} by focusedart`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-stone-200 group-hover:shadow-lg group-hover:scale-[1.02] transition-all duration-300 focus-ring">
        {/* Image Container with Aspect Ratio */}
        <div 
          className="relative w-full"
          style={{ aspectRatio: artwork.aspectRatio }}
        >
          {/* Loading Skeleton */}
          {isLoading && (
            <div 
              className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200 animate-pulse"
              style={{ backgroundColor: artwork.dominantHex ? `${artwork.dominantHex}20` : undefined }}
            />
          )}

          {/* Error State */}
          {imageError ? (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
              <div className="text-center text-stone-500">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Image unavailable</p>
              </div>
            </div>
          ) : (
            <Image
              src={artwork.src}
              alt={artwork.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onLoad={handleImageLoad}
              onError={handleImageError}
              priority={priority}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Caption */}
        <div className="p-4 space-y-1">
          <h3 className="font-medium text-stone-800 group-hover:text-stone-900 transition-colors">
            {artwork.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-stone-600">
            <span>{artwork.year}</span>
            <span className="text-stone-500">by focusedart</span>
          </div>
          <p className="text-xs text-stone-500">{artwork.medium}</p>
        </div>
      </div>
    </div>
  );
}
