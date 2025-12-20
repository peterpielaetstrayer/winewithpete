'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HostApplicationModal } from '@/components/host-application-modal';
import { useState } from 'react';

export default function WineWithLanding(){
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-serif">Wine With — Host an Event</h1>
        <p className="mt-4 text-black/80">
          A toolkit for gathering people around fire, food, and honest conversation. Apply to host,
          get resources, and share your nights with the community.
        </p>
        <div className="mt-6 flex gap-3">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="btn-ember"
          >
            Apply to host
          </Button>
          <Link className="underline" href="/gatherings">See how events work →</Link>
        </div>
        <ul className="mt-10 list-disc pl-6 space-y-2 text-sm opacity-80">
          <li>Fire setup guides & conversation decks</li>
          <li>Menu cards & open-fire recipes</li>
          <li>Event page + RSVP (coming soon)</li>
        </ul>
      </div>

      <HostApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
