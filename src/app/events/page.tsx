'use client';

import Image from 'next/image';
// import Link from 'next/link';
// import { EventCard } from '@/components/event-card';
// import { EventsList } from '@/components/events-list';
import { useState, useEffect } from 'react';
import { Event } from '@/lib/types';

export default function EventsPage(){
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.data || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-display mb-6">Events</h1>
        <p className="text-lg text-black/80 max-w-2xl mx-auto">
          Wine With Pete events are an invitation to slow down.
        </p>
        <p className="text-lg text-black/80 max-w-2xl mx-auto mt-2">
          We host two types of gatherings:
        </p>
      </div>

      {/* Event Types */}
      <div className="space-y-16 mb-16">
        {/* Open Fire Sundays */}
        <div className="relative animate-slide-up">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="card-enhanced bg-white rounded-2xl p-8 shadow-sm border">
                <h2 className="text-2xl font-medium mb-4">🔥 Open Fire Sundays</h2>
                <p className="text-black/80 mb-2">Casual. Coastal. Community-driven.</p>
                <p className="text-black/80">We meet early, cook over fire, and share what&apos;s real.</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <Image 
                  src="/images/events/events-community-gathering.png.png" 
                  alt="Community gathering around a campfire with wine and conversation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Salon Dinners */}
        <div className="relative animate-slide-up">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-1">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <Image 
                  src="/images/about/about-pete-beach-fire.png.png" 
                  alt="Intimate dining scene with wine and thoughtful conversation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="order-2">
              <div className="card-enhanced bg-white rounded-2xl p-8 shadow-sm border">
                <h2 className="text-2xl font-medium mb-4">🍷 Salon Dinners</h2>
                <p className="text-black/80 mb-2">Curated. Intimate. Slower still.</p>
                <p className="text-black/80">A shared meal around hard questions and honest conversation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      {/* <EventsList /> */}
    </div>
  );
}
