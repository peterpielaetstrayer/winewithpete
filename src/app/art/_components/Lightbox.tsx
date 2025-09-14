'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Artwork } from '../_data/artworks';
import { Button } from '@/components/ui/button';

interface LightboxProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function Lightbox({ 
  artwork, 
  isOpen, 
  onClose, 
  onPrevious, 
  onNext, 
  hasPrevious, 
  hasNext 
}: LightboxProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrevious) {
            onPrevious();
          }
          break;
        case 'ArrowRight':
          if (hasNext) {
            onNext();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext, hasPrevious, hasNext]);

  // Focus management
  useEffect(() => {
    if (isOpen && lightboxRef.current) {
      lightboxRef.current.focus();
    }
  }, [isOpen]);

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // Copy link functionality
  const copyLink = async () => {
    if (!artwork) return;
    
    const url = `${window.location.origin}/art#${artwork.id}`;
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (!isOpen || !artwork) return null;

  return (
    <div
      ref={lightboxRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      tabIndex={-1}
    >
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-label="Close lightbox"
      />
      
      {/* Content */}
      <div className="relative max-w-6xl max-h-[90vh] w-full mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <div className="flex-1 min-w-0">
            <h2 id="lightbox-title" className="text-xl font-semibold text-stone-800 truncate">
              {artwork.title}
            </h2>
            <p className="text-sm text-stone-600">
              {artwork.year} • {artwork.medium} • by focusedart
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="text-stone-600 hover:text-stone-800"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-stone-600 hover:text-stone-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative flex-1 min-h-0">
          {/* Loading State */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
              <div className="text-center text-stone-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ember mx-auto mb-2"></div>
                <p>Loading...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {imageError ? (
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-stone-100 to-stone-200">
              <div className="text-center text-stone-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">Image unavailable</p>
                <p className="text-sm">This artwork image could not be loaded.</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-96 md:h-[500px] lg:h-[600px]">
              <Image
                src={artwork.src}
                alt={artwork.alt}
                fill
                className="object-contain"
                onLoad={handleImageLoad}
                onError={handleImageError}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />
            </div>
          )}

          {/* Navigation Arrows */}
          {hasPrevious && (
            <Button
              ref={previousButtonRef}
              variant="outline"
              size="sm"
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
              aria-label="Previous artwork"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          )}

          {hasNext && (
            <Button
              ref={nextButtonRef}
              variant="outline"
              size="sm"
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
              aria-label="Next artwork"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          )}
        </div>

        {/* Description */}
        {artwork.description && (
          <div className="p-4 border-t border-stone-200 bg-stone-50">
            <p className="text-stone-700 leading-relaxed">{artwork.description}</p>
          </div>
        )}

        {/* Future Buy Section - Hidden for now but ready for extension */}
        {artwork.sales && (artwork.sales.printable || artwork.sales.nftMintable) && (
          <div className="p-4 border-t border-stone-200 bg-stone-50">
            <h3 className="text-sm font-medium text-stone-800 mb-3">Available for Purchase</h3>
            <div className="space-y-2">
              {artwork.sales.printable && (
                <div className="text-sm text-stone-600">
                  <span className="font-medium">Prints:</span> {artwork.sales.printSkus?.join(', ')}
                </div>
              )}
              {artwork.sales.nftMintable && (
                <div className="text-sm text-stone-600">
                  <span className="font-medium">NFT:</span> Available for minting
                </div>
              )}
              {/* Future: Add actual buy buttons here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
