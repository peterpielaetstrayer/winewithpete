'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm border">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <Image src="/images/icons/icon-fire.png" alt="Error" width={48} height={48} />
          </div>
          <h1 className="text-2xl font-serif font-medium mb-4 text-charcoal">Something went wrong</h1>
          <p className="text-lg text-black/70 mb-8">
            We encountered an unexpected error. Don&apos;t worry, it&apos;s not your fault.
          </p>
          <div className="space-y-4">
            <Button 
              onClick={reset}
              className="btn-ember px-8 py-4 rounded-full text-lg font-medium"
            >
              Try Again
            </Button>
            <div className="text-sm text-black/60">
              <p>Or go back to <Link href="/" className="text-ember hover:underline">home</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
