'use client';

import Image from 'next/image';
import { Mail } from 'lucide-react';
import { GatheringInterestForm } from '@/components/gathering-interest-form';
import { useState, useEffect } from 'react';
import { Event } from '@/lib/types';
import { EventCard } from '@/components/event-card';

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'pete@winewithpete.me';
const contactMailto = `mailto:${contactEmail}?subject=${encodeURIComponent('Wine With Pete — Gathering Inquiry')}`;

export default function GatheringsPage(){
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events || []);
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
        <h1 className="text-display mb-6">Gatherings</h1>
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
      {loading ? (
        <div className="text-center py-12">
          <p className="text-black/60">Loading events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="mb-16">
          <h2 className="text-section text-center mb-12 text-charcoal">Upcoming Gatherings</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-16 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif font-medium mb-4 text-charcoal">
              Upcoming gatherings are seasonal and location-based
            </h2>
            <p className="text-black/70 leading-relaxed">
              We&apos;ll announce dates and locations as they&apos;re confirmed. 
              Let us know you&apos;re interested and we&apos;ll notify you when gatherings are planned in your area.
            </p>
          </div>
        </div>
      )}

      {/* Direct contact + interest form */}
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-cream rounded-2xl p-8 border border-black/5 text-center">
          <h2 className="text-xl font-serif font-medium text-charcoal mb-2">
            Prefer to reach out directly?
          </h2>
          <p className="text-black/70 mb-5 max-w-md mx-auto leading-relaxed">
            For hosting questions, collaborations, or anything you&apos;d rather say in your own words — I read everything.
          </p>
          <a
            href={contactMailto}
            className="btn-ember inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            Email Pete
          </a>
          <p className="text-sm text-black/50 mt-4">{contactEmail}</p>
        </div>

        <GatheringInterestForm />
      </div>
    </div>
  );
}

