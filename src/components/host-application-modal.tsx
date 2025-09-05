'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HostApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HostApplicationModal({ isOpen, onClose }: HostApplicationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-md p-8 relative animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <div className="w-12 h-12 bg-ember/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-serif font-medium mb-4 text-charcoal">
            Host Applications Coming Soon
          </h2>

          {/* Description */}
          <p className="text-black/70 mb-6 leading-relaxed">
            We're putting the finishing touches on our host application process. 
            In the meantime, we'd love to hear from you about hosting opportunities.
          </p>

          {/* Email CTA */}
          <div className="bg-cream rounded-lg p-6 mb-6">
            <h3 className="font-medium mb-3 text-charcoal">Get in Touch</h3>
            <p className="text-sm text-black/70 mb-4">
              Email us to discuss hosting opportunities, ask questions, or express your interest.
            </p>
            <a 
              href="mailto:pete@winewithpete.me?subject=Host Application Interest"
              className="btn-ember inline-block px-6 py-3 rounded-full text-sm font-medium"
            >
              Email Pete
            </a>
          </div>

          {/* What to expect */}
          <div className="text-left">
            <h4 className="font-medium mb-3 text-charcoal">What to expect:</h4>
            <ul className="text-sm text-black/70 space-y-2">
              <li>• Fire setup guides & conversation decks</li>
              <li>• Menu cards & open-fire recipes</li>
              <li>• Event page creation & RSVP management</li>
              <li>• Community support & resources</li>
            </ul>
          </div>

          {/* Close button */}
          <Button 
            onClick={onClose}
            variant="outline" 
            className="mt-6 w-full border-ember text-ember hover:bg-ember hover:text-white"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}
