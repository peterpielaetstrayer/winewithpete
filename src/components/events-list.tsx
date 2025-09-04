'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EventCard } from './event-card';
import type { Event } from '@/lib/types';

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-ember"></div>
        <p className="mt-4 text-black/70">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center bg-white rounded-2xl p-12 border">
        <h3 className="text-xl font-serif mb-4">Unable to load events</h3>
        <p className="text-black/70 mb-6 max-w-lg mx-auto">
          There was an error loading the events. Please try again later.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[var(--wwp-ember)] hover:opacity-90 text-white rounded-full px-8 py-3 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center bg-white rounded-2xl p-12 border">
        <h3 className="text-xl font-serif mb-4">No upcoming events scheduled.</h3>
        <p className="text-black/70 mb-6 max-w-lg mx-auto">
          Join the circle to be notified or contact us if you&apos;d like to host one in your space.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/join">
            <button className="bg-[var(--wwp-ember)] hover:opacity-90 text-white rounded-full px-8 py-3 font-medium">
              Join the Circle
            </button>
          </Link>
          <Link href="/wine-with">
            <button className="border border-[var(--wwp-ember)] text-[var(--wwp-ember)] hover:bg-[var(--wwp-ember)] hover:text-white rounded-full px-8 py-3 font-medium transition-colors">
              Become a Host
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-serif font-medium text-center mb-12 text-charcoal">
        Upcoming Events
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
